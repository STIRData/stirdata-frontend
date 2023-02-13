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
            <template v-if="isUnitProperty(property)">
              <div class="eurostat-title">
                {{ property.subLevels[0].text }}
                <i
                  class="fa fa-info-circle"
                  v-b-tooltip.hover.right
                  :title="`Range between ${property.subLevels[0].minValue} to ${property.subLevels[0].maxValue}`"
                />
              </div>
              <b-row>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="property.subLevels[0].value + '-text--from'"
                    :min="property.subLevels[0].minValue"
                    :max="maxValue || property.subLevels[0].maxValue"
                    placeholder="From"
                    v-model="minValue"
                    @change="selectTag()"
                  ></b-form-input>
                </b-col>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="property.subLevels[0].value + '-text--to'"
                    :min="minValue || property.subLevels[0].minValue"
                    :max="property.subLevels[0].maxValue"
                    placeholder="To"
                    v-model="maxValue"
                    @change="selectTag()"
                  ></b-form-input>
                </b-col>
              </b-row>
            </template>
            <template v-else>
              <template v-if="!oneLeafProperty(property)">
                <div
                  class="eurostat-title"
                  v-b-tooltip.hover.right
                  :title="property.text"
                >
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
                      :id="option.value + '-radio'"
                      @change="selectTag(property, option)"
                    >
                      {{ option.text }}
                    </b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
              </template>
            </template>
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
    tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: false,
      isCollapseOpen: false,
      options: {},
      minValue: null,
      maxValue: null,
    };
  },
  mounted() {
    let dsCode = this.filter.datasetCode.split(":")[1];
    this.filter.subLevels.forEach((subLevel) => {
      this.options[subLevel.value] = null;
    });

    this.tags.forEach((tag) => {
      let tagArray = tag.split(":");
      if (tagArray[1] == dsCode) {

        let parameters = tagArray[3].split("~");
        for (let param of parameters) {
          if (param.startsWith("unit")) {
            let minVal = tag.split(param)[1].split(":")[1];
            let maxVal = tag.split(param)[1].split(":")[2];
            this.minValue = parseInt(minVal);
            this.maxValue = parseInt(maxVal);
          }
          for (let sub1 of this.filter.subLevels) {
            for (let sub2 of sub1.subLevels) {
              if (sub2.value.includes(param)) {
                this.options[sub1.value] = sub2.value;
              }
            }
          }
        }
      }
    });
  },
  methods: {
    selectTag() {
      if (!this.checkIfAllFieldsAreFilled()) {
        return;
      }
      this.$emit("select-tag", {
        datasetCode: this.filter.datasetCode.split(":").pop(),
        propertyCode: this.filter.propertyCode.split(":").pop(),
        options: this.options,
        minValue: this.minValue,
        maxValue: this.maxValue,
      });
    },
    isUnitProperty(prop) {
      return prop.subLevels[0].value.split(":").pop().startsWith("unit");
    },
    oneLeafProperty(prop) {
      return prop.subLevels.length == 1;
    },
    checkIfAllFieldsAreFilled() {
      if (!this.minValue && !this.maxValue) {
        return false;
      }

      for (let property of this.filter.subLevels) {
        if (property.subLevels.length == 1) {
          this.options[property.value] = property.subLevels[0].value;
        }
      }
      for (let key in this.options) {
        if (!this.options[key]) {
          return false;
        }
      }
      return true;
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

.form-control {
  margin-top: 0 !important;
  margin-bottom: 5px;
}

.fa-info-circle {
  color: $accent-first-color;
  margin-left: 3px;
}
</style>
