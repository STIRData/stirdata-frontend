<template>
  <div class="eurostat-filter">
    <div>
      <div class="check-wrap d-flex justify-content-between">
        <div class="eurostat-title" v-b-tooltip.hover.right :title="filter.text">
          {{ filter.text }}
        </div>

        <div
          v-if="filter.subLevels"
          class="plus-expander"
          v-b-toggle="'collapse' + filter.value"
        >
          <span class="expand"></span>
        </div>
      </div>
      <b-collapse
        class="accordion-collapse"
        :id="'collapse' + filter.value"
        @show="isCollapseOpen = true"
      >
        <ul v-if="isCollapseOpen" class="treeMenu">
          <li>prop</li>
        </ul>
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selected: false,
      isCollapseOpen: false,
    };
  },
  mounted() {
    console.dir(this.filter);
  },
  methods: {
    selectTag(tagCode, checked) {
      console.log(this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.eurostat-title {
  display: inline-block;
  width: 90%;
  height: 23px;
  cursor: pointer;
  line-height: 1.563rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-control.custom-checkbox {
  width: 97%;
  padding-left: 0;
  height: 30px;

  ::v-deep .custom-control-label::before {
    display: none;
  }
}

.treeMenuNode .custom-control.custom-checkbox::after {
  content: "";
  background: url(../assets/img/ic-hierarchy-small.png);
  position: relative;
  display: flex;
  top: -24px;
  left: -22px;
  width: 8px;
  height: 8px;
}

ul.treeMenu {
  margin: 5px 0 0 26px !important;
}

.tooltip {
  top: -1px !important;
  margin-left: 1.2rem;
}
</style>
