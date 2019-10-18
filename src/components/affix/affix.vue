<template>
    <div>
        <div :class="classes" :style="styles">
            <slot></slot>
        </div>
        <div v-show="slot" :style="slotStyle"></div>
    </div>
</template>

<script>
import { on, off } from '@/utils/event';
const prefixCls = 'zh-affix'; //类名

function getScroll(target, top) {

}

function getOffset(element) {

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
            affix: false,
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
          }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
