<template>
  <Anchor>
    <Anchor-link href="#1" title="1">1</Anchor-link>
    <Anchor-link href="#2" title="2">2</Anchor-link>
    <Anchor-link href="#3" title="3">3</Anchor-link>
    <Anchor-link href="#4" title="4">4</Anchor-link>
    <Anchor-link href="#5" title="5">5</Anchor-link>
  </Anchor>
</template>

<script>
import { Anchor, AnchorLink } from '_c/anchor'
export default {
  name: 'anchorPage',
  components: {
    Anchor,
    AnchorLink
  },
  mounted () {
    // console.log(total)
  }
}
</script>

<style lang="less" scoped>

</style>
