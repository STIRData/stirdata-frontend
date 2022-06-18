<template>
  <div>
    <PageHeader v-if="!loading"/>
    <Nuxt/>
    <LazyPageFooter keep-alive />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader';
  import PageFooter from '../components/PageFooter';

  export default {
    components: {
      PageHeader,
      PageFooter
    },
     data: () => ({
       loading: true
     }),
     created () {
        this.$nextTick(function () {
           this.loading = false
       })
     }
  };
</script>

<style type="text/css">
  [v-cloak] {
    display: none;
  }
</style>
