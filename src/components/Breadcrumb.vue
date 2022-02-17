<template>
  <nav class="bread" aria-label="breadcrumb">
    <b-breadcrumb :items="breadcrumb_items"></b-breadcrumb>
  </nav>
</template>

<script>
  export default {
    name: "Breadcrumb",

    props: {
      breadcrumb_items: {
        type: Array,
        required: true,
      },
    },

    computed: {}
  };
</script>

<style lang="scss" scoped>
  .breadcrumb {
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    padding: 0 0;
    margin-bottom: 1rem;
    list-style: none;
  }
</style>
