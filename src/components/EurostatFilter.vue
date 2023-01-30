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
          <li v-for="property of filter.subLevels" :key="property.value">
            <div class="eurostat-title" v-b-tooltip.hover.right :title="property.text">
              {{ property.text }}
            </div>
            <b-form-group>
              <b-form-radio-group
                :id="'radio-group-' + property.value"
                v-model="options[property.value]"
                :name="property.value"
                stacked
              >
                <b-form-radio
                  class="eurostat-child"
                  v-for="option of property.subLevels"
                  :key="option.value"
                  :value="option.value"
                  @change="selectTag(property, option)"
                >
                  {{ option.text }}
                </b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </li>
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
      options: {},
    };
  },
  mounted() {
    console.dir(this.filter);
    this.filter.subLevels.forEach((subLevel) => {
      this.options[subLevel.value] = null;
    });
    console.log(this.options);
  },
  methods: {
    selectTag(property, option) {
      console.log(property, option)
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


.eurostat-child::after {
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
