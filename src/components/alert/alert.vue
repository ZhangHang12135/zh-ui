<template>
  <transition name="fade">
    <div v-if="!closed" :class="wrapClasses">
      <span :class="iconClasses" v-if="showIcon">
        <slot name="icon">
          <!-- <ion-icon :name="iconType"></ion-icon> -->
          <i class="icon ion-ios-close-circle"></i>
        </slot>
      </span>
      <span :class="messageClasses"><slot></slot></span>
      <span :class="descClasses"><slot name="desc"></slot></span>
      <a :class="closeClasses" v-if="closable" @click="close">
        <slot name="close">
          <!-- <ion-icon name="ios-close"></ion-icon> -->
          <i class="icon ion-ios-close"></i>
        </slot>
      </a>
    </div>
  </transition>
</template>
<script>
import { oneOf } from "@/utils/assist";

const prefixCls = 'zh-alert';
export default {
  name: 'Alert',
  props: {
    // alert弹窗类型
    type: {
      // prop 的自定义验证函数
      validator (value) {
        return oneOf(value, ['success', 'info', 'warning', 'error'])
      },
      default: 'info'
    },
    // 是否显示关闭图标
    closable: {
      type: Boolean,
      default: false
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false
    },
    banner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      closed: false,
      desc: false
    }
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-icon`]: this.showIcon,
          [`${prefixCls}-with-desc`]: this.desc,
          [`${prefixCls}-with-banner`]: this.banner
        }
        ];
    },
    messageClasses () {
      return `${prefixCls}-message`;
    },
    descClasses () {
      return `${prefixCls}-desc`;
    },
    closeClasses () {
      return `${prefixCls}-close`;
    },
    iconClasses () {
      return `${prefixCls}-icon`;
    },
    iconType () {
      let type = '';

      switch (this.type) {
        case 'success':
          type = 'ios-checkmark-circle';
          break;
        case 'warning':
          type = 'ios-alert';
          break;
        case 'error':
          type = 'ios-close-circle';
          break;
        default:
          type = 'ios-information-circle';
          break;
      }
      // 变白（只渲染轮廓的那种）
      if(this.desc) type += '-outline';
      return type;
    }
  },
  mounted () {
    // 存在desc的插槽时，图标就会变成轮廓样
    this.desc = this.$slots.desc != undefined;
  },
  methods: {
    close (e) {
      this.closed = true;
      this.$emit('on-close', e);
    }
  }
}
</script>
<style lang="less" scoped>

@import url('./alert.less');

</style>
