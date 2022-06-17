<template>
 <main role="main">
  <div class="container">
    <h1>{{error.message}}</h1>
    <p>The link you clicked on may be broken or no longer exists.</p>
  </div>
  </main>
</template>
<script>
export default {
  name: 'error-404',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
