<template>
<div>
  <Alert show-icon closable>I am Iron man , you are my didi
    <span slot="desc">desce test</span>
  </Alert>
  <Alert type="success" show-icon>
    A success prompt
    <span slot="desc">Content of prompt. Content of prompt. Content of prompt. Content of prompt. </span>
</Alert>
<Alert type="error" closeable show-icon> </Alert>
<Alert type='warning' show-icon closable>A warning
  <span slot="desc">
            Custom error description copywriting.
  </span>
  <span slot="close"><i class="icon ios-md-heart"></i></span>
</Alert>
</div>
</template>

<script>
import Alert from '_c/alert'
export default {
  name: 'alertPage',
  components: {
    Alert
  },
}
</script>
