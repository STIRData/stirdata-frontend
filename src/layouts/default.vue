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
