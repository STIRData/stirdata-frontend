<template>
  <div class="container">
    <SimpleMap
      @toast-warning="throwToast"
    />
  </div>
</template>

<script>
  export default {
    components: {
      SimpleMap: () => import("../components/map/SimpleMap")
    },

    methods: {
      throwToast(message) {
        this.$bvToast.toast(message, {
          variant: 'danger',
          title: 'Warning',
          solid: true
        });
      }
    }
  };
</script>
