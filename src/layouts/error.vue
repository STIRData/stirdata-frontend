
<template>
<div class="nuxt-error">
<main role="main">
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>  
  </div>
  </main>
  </div>
</template>
<script>

export default {
  name: 'nuxt-error',
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  }

}
</script>
