<template>
  <div class="container">
    <SingleMap
      @toast-warning="throwToast"
    />
  </div>
</template>

<script>
  export default {
    components: {
      SingleMap: () => import("../components/map/SimpleMap"),
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
