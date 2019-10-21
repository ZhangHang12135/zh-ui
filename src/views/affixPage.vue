<template>
<div class="affix">
    <Affix>
        <div class="demo-affix">固定在最顶部</div>
    </Affix>
    <div class="content"></div>
    <Affix :offsetBottom="50"><div class="demo-affix">固定在最底部</div></Affix>
    <div class="content"></div>
</div>
</template>

<script>
import Affix from '_c/affix'
export default {
    components:{
      Affix
    },
    data (){
      return {}
    }
}
</script>
<style>
.affix,.content{
  width: 100px;
  height: 1000px;
}
.demo-affix{
  width: 100px;
  height: 30px;
  background: #f60;
  color: #fff;
}
</style>
