<template>
  <component :is="wrapperComponent"
  :offset-top="offsetTop"
  :offset-bottom="offsetBottom"
  @on-change="handleAffixStateChange">
    <div :class="`${prefix}-wrapper`" :style="wrapperStyle">
      <div :class="`${prefix}`">
        <div :class="`${prefix}-ink`">
          <span v-show="showInk" :class="`${prefix}-ink-ball`" :style="{top: `${inkTop}px`}"></span>
        </div>
        <slot></slot>
      </div>
    </div>
  </component>
</template>

<script>
import { on, off } from '@/utils/event'
import { scrollTop, findComponentsDownward, sharpMatcherRegx } from '@/utils/assist';
import Affix from '_c/affix'
export default {
  name: 'Anchor',
  components: {
    Affix
  },
  provide () {
    return {
      anchorCom: this
    }
  },
  data () {
    return {
      prefix: 'zh-anchor',
      isAffixed: false, // 是否固定在屏幕上
      inkTop: 0,
      animating: false,
      currentLink: '',
      currentId: '',
      scrollContainer: null,
      scrollElement: null,
      titlesOffsetArr: [],
      wrapperTop: 0,
      upperFirstTitle: true
    }
  },
  props: {
    // 是否变成Affix(固定在屏幕上)
    affix: {
      type: Boolean,
      default: true
    },
    // 顶部偏移
    offsetTop: {
      type: Number,
      default: 0
    },
    // 底部偏移
    offsetBottom: {
      type: Number,
      default: 0
    },
    // 滑动点 每次移动距离
    bounds: {
      type: Number,
      default: 5
    },
    container: null,
    showInk: {
      type: Boolean,
      default: false
    },
    scrollOffset: {
      type: Number,
      default: 0
    }
  },
  computed: {
    wrapperComponent () {
      return this.affix ? 'Affix' : 'div';
    },
    wrapperStyle () {
      return {
        maxHeight: this.offsetTop ? `calc(100vh - ${this.offsetTop}px)` : '100vh'
      }
    },
    containerIsWindow () {
      return this.scrollContainer === window;
    }
  },
  methods: {
    handleAffixStateChange (state) {
      this.isAffixed = this.affix && state;
    },
    handleScroll (e) {
      this.upperFirstTitle = e.target.scrollTop < this.titlesOffsetArr[0].offset;
      if (this.animating) return;
      this.updateTitleOffset();
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || e.target.scrollTop;
      this.getCurrentScrollAtTitleId(scrollTop);
    },
    getCurrentScrollAtTitleId (scrollTop) {
      let i = -1;
      let len = this.titlesOffsetArr.length;
      let titleItem = {
        link: '#',
        offset: 0
      };
      scrollTop += this.bounds;
      while (++i < len) {
        let currentEle = this.titlesOffsetArr[i];
        let nextEle = this.titlesOffsetArr[i + 1];
        if (scrollTop >= currentEle.offset && scrollTop < ((nextEle && nextEle.offset) || Infinity)) {
          titleItem = this.titlesOffsetArr[i];
          break;
        }
      }
      this.currentLink = titleItem.link;
      this.handleSetInkTop();
    },
    init () {
      this.handleHashChange(); // 没有锚点的情况就不做处理了，这里直接返回
      this.$nextTick(() => {
        this.removeListener();
        this.getContainer();
        this.wrapperTop = this.containerIsWindow ? 0 : this.scrollElement.offsetTop;
        this.handleScrollTo();
        this.handleSetInkTop();
        this.updateTitleOffset();
        if (this.titlesOffsetArr[0]) {
          this.upperFirstTitle = this.scrollElement.scrollTop < this.titlesOffsetArr[0].offset;
        }
        on(this.scrollContainer, 'scroll', this.handleScroll);
        on(window, 'hashchange', this.handleHashChange);
      })
    },
    // 获取锚点
    handleHashChange () {
      const url = window.location.href;
      const sharpLinkMatch = sharpMatcherRegx.exec(url);
      if(!sharpLinkMatch) return;
      // 此处应用history模式
      this.currentLink = sharpLinkMatch[0]; // 匹配全部字符，就是带#
      this.currentId = sharpLinkMatch[1]; // 锚点
    },
    // 移除事件监听
    removeListener () {
      off(this.scrollContainer, 'scroll', this.handleScroll);
      off(window, 'hashchange', this.handleHashChange);
    },
    // 获取 滚动的内容 html
    getContainer () {
      this.scrollContainer = this.container ?
      (typeof this.container === 'string' ?
      document.querySelector(this.container) : this.container) : window;
      this.scrollElement = this.container ?
      this.scrollContainer :
      (document.documentElement || document.body);
    },
    handleScrollTo () {
      const anchor = document.getElementById(this.currentId);
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`)
      let offset = this.scrollOffset;
      if (currentLinkElementA) {
        offset = parseFloat(currentLinkElementA.getAttribute('data-scroll-offset'));
      }

      if (!anchor) return;
      const offsetTop = anchor.offsetTop - this.wrapperTop - offset;
      this.animating = true;

      scrollTop(this.scrollContainer, this.scrollElement.scrollTop, offsetTop, 600, () => {
        this.animating = false;
      })
    },
    handleSetInkTop () {
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`);
      if (!currentLinkElementA) return ;
      const elementATop = currentLinkElementA.offsetTop;
      const top = (elementATop < 0 ? this.offsetTop : elementATop);
      this.inkTop = top;
    },
    updateTitleOffset () {
      console.log(findComponentsDownward(this,'AnchorLink'))
      const links = findComponentsDownward(this, 'AnchorLink').map(link => {
        return link.href;
      })
      const idArr = links.map(link => {
        return link.split('#')[1];
      })
      let offsetArr = [];
      idArr.forEach(id => {
        const titleEle = document.getElementById(id);
        if (titleEle) offsetArr.push({
          link: `#${id}`,
          offset: titleEle.offsetTop - this.scrollElement.offsetTop
        });
      });
      this.titlesOffsetArr = offsetArr;

    }
  },
  watch: {
    '$route' () {
      this.handleHashChange();
      this.$nextTick(() => {
        this.handleScrollTo();
      });
    },
    container () {
      this.init();
    },
    currentLink (newHref, oldHref) {
      this.$emit('on-change', newHref, oldHref);
    }
  },
  mounted () {
    this.init();
  },
  beforeDestroy () {
    this.removeListener();
  }
}
</script>

<style lang="less" scoped>

</style>
