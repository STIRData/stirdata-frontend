<template>
  <div>
    <PageHeader
      keep-alive
    />
    <Nuxt />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader';

  export default {
    components: {
      PageHeader
    }
  }
</script>

<style type="text/css">
  [v-cloak] {
    display: none;
  }
</style>
