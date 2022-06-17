<template>
 <main role="main">
  <div class="container">
    <h1>Network error</h1>
    <p>{{error.message}}</p>
    <p>Please contact the system administrator.</p>
  </div>
  </main>
</template>
<script>
export default {
  name: 'error-500',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
