<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <h3 class="ml-5">Under Construction...</h3>
  </main>
</template>

<script>
export default {
  components: {
    Breadcrumb: () => import("../../../components/Breadcrumb"),
  },

  data() {
    return {
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "STATISTICS",
          to: {name: "statistics"},
        },
        {
          text: "ACTIVITY",
          active: true
        },
        {
          text: "CURRENT ACTIVITY",
          active: true
        },
      ],
    };
  },
  computed: {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
