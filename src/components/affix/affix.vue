<template>
    <div>
        <div ref="point" :class="classes" :style="styles">
          <slot>default</slot>
        </div>
        <div v-show="slot" :style="slotStyle"></div>
    </div>
</template>

<script>
import { on, off } from '@/utils/event';
const prefixCls = 'zh-affix'; //类名

/**
 * @description 获得当前滚动栏位置
 * @param target 一般为 window
 * @param top true: 获取竖直滚动栏位置;false: 获取水平滚动栏位置
 */
function getScroll(target, top) {
  const prop = top ? 'pageYOffset' : 'pageXOffset';
  const method = top ? 'scrollTop' : 'scrollLeft';

  let ret = target[prop];

  if( typeof ret !== 'number') {
    ret = window.document.documentElement[method];
  }
  return ret;
}

/**
 * 获取元素实际的偏移，content部分
 */
function getOffset(element) {
  // 获取元素的块级对象（坐标，边框长宽，偏移量等等）
  const rect = element.getBoundingClientRect();

  const scrollTop = getScroll(window, true);
  const scrollLeft = getScroll(window, false);

  const docEl = window.document.body;
  const clientTop = docEl.clientTop || 0; // 上边框宽
  const clientLeft = docEl.clientLedt || 0;// 左边框宽

  return  {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft
  };
}
export default {
    name: 'Affix',
    props: {
        // 顶部偏移量
        offsetTop: {
            type: Number,
            default: 0
        },
        // 底部偏移量
        offsetBottom: {
            type: Number
        }
    },
    data () {
        return {
            affix: false, // false: 表示还没有fixed定位
            styles: {},
            slot: false,
            slotStyle: {}
        };
    },
    computed: {
        // 偏移类型
        offsetType () {
            return this.offsetBottom >= 0 ?
                'bottom' : 'top';
        },
        // class
        classes () {
            return [{
                [`${prefixCls}`]: this.affix
            }];
        }
    },
    mounted () {
      on(window, 'scroll', this.handleScroll);
      on(window, 'resize', this.handleScroll);
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    beforeDestroy () {
      off(window, 'scroll', this.handleScroll);
      off(window, 'resize', this.handleScroll);
    },
    methods: {
        handleScroll () {
          const affix = this.affix;
          const scrollTop = getScroll(window, true);
          const elOffset = getOffset(this.$el); // this.$el 表示当前组件DOM元素
          const windowHeight = window.innerHeight; // 视窗高度
          // 第一个块，就是主块
          const elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;

          // Fixed Top
          if((elOffset.top - this.offsetTop) < scrollTop &&
            this.offsetType === 'top' && !affix){
              this.affix = true;
              this.slotStyle =  {
                width: this.$refs.point.clientWidth + 'px',
                height: this.$refs.point.clientHeight + 'px'
              };
              this.slot = true;
              this.styles = {
                top: `${this.offsetTop}px`,
                left: `${elOffset.left}px`,
                width: `${this.$el.offsetWidth}px`
              };

              this.$emit('on-change', true);
            } else if ((elOffset.top - this.offsetTop) > scrollTop &&
              this.offsetType == 'top' && affix) {
                this.slot = false;
                this.slotStyle = {};
                this.affix = false;
                this.styles = null;

                this.$emit('onchange', false);
            }
            // Fixed Bootm
            if((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight)
              && this.offsetType == 'bottom'
              && !affix) {
              this.affix = true;
              this.styles = {
                bottom:  `${this.offsetBottom}px`,
                left:  `${elOffset.left}px`,
                window: `${this.$el.offsetWidth}px`
              };

              this.$emit('on-change', true);
            } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight)
              && this.offsetType == 'bottom'
              && affix){
              this.affix = false;
              this.styles = null;

              this.$emit('on-change', false);
            }
      }
    }
}
</script>

<style lang="less" scoped>
.zh-affix {
  position: fixed;
  z-index: 10;
}
</style>
