<template>
  <div>
    <PageHeader keep-alive />
    <Nuxt />
    <PageFooter keep-alive />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader';
  import PageFooter from '../components/PageFooter';

  export default {
    components: {
      PageHeader,
      PageFooter
    }
  }
</script>

<style type="text/css">
  [v-cloak] {
    display: none;
  }
</style>
