<template>
    <div>
        <div :class="classes" :style="styles">
            <slot></slot>
        </div>
        <div v-show="slot" :style="slotStyle"></div>
    </div>
</template>

<script>
export default {
    name: 'Affix',
    data () {
        return {
            
        }
    }
}
</script>

<style lang="less" scoped>

</style>