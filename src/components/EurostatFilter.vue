<template>
  <div class="eurostat-filter">
    <div>
      <div class="check-wrap d-flex justify-content-between">
        <div class="eurostat-title" v-b-tooltip.hover.right :title="filter.text">
          {{ filter.text }}
        </div>
        <a :href="'https://ec.europa.eu/eurostat/web/products-datasets/-/'+dsCode" target="_blank" rel="noopener noreferrer">
          <i class="fa fa-external-link"></i>
        </a>
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
            <template
              v-if="isUnitProperty(property) && oneLeafProperty(property)"
            >
              <div class="eurostat-title">
                {{ property.subLevels[0].text }}
                <i
                  class="fa fa-info-circle"
                  v-b-tooltip.hover.right
                  :title="`Range between ${minRange} to ${maxRange}`"
                />
              </div>
              <b-row>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="property.subLevels[0].value + '-text--from'"
                    :min="minRange"
                    :max="maxValue || maxRange"
                    placeholder="From"
                    v-model="minValue"
                    @change="selectTag()"
                  ></b-form-input>
                </b-col>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="property.subLevels[0].value + '-text--to'"
                    :min="minValue || minRange"
                    :max="maxRange"
                    placeholder="To"
                    v-model="maxValue"
                    @change="selectTag()"
                  ></b-form-input>
                </b-col>
              </b-row>
            </template>
            <template
              v-else-if="isUnitProperty(property) && !oneLeafProperty(property)"
            >
              <div class="eurostat-title">Unit</div>
              <b-form-group>
                <b-form-radio-group
                  :id="'radio-group-' + property.value"
                  v-model="options[property.value]"
                  :name="property.value"
                  stacked
                >
                  <b-form-radio
                    class="eurostat-child"
                    v-for="(option, index) of property.subLevels"
                    :key="option.value"
                    :value="option.value + ',' + option.minValue + ',' + option.maxValue"
                    :id="option.value + '-radio'"
                    @change="selectUnit(property, option, index)"
                    v-b-tooltip.hover.right
                    :title="option.text"
                  >
                    {{ option.text }}
                  </b-form-radio>
                </b-form-radio-group>
              </b-form-group>
              <b-row>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="
                      property.subLevels[selectedUnitIndex].value +
                      '-text--from'
                    "
                    :min="minRange"
                    :max="
                      maxValue || maxRange
                    "
                    placeholder="From"
                    v-model="minValue"
                    @change="selectTag()"
                    :disabled="options[property.value] == ''"
                  ></b-form-input>
                </b-col>
                <b-col md="5" sm="10">
                  <b-form-input
                    type="number"
                    :id="
                      property.subLevels[selectedUnitIndex].value + '-text--to'
                    "
                    :min="
                      minValue || minRange
                    "
                    :max="maxRange"
                    placeholder="To"
                    v-model="maxValue"
                    @change="selectTag()"
                    :disabled="options[property.value] == ''"
                  ></b-form-input>
                </b-col>
                <b-col
                  md="2"
                  sm="2"
                  class="align-self-center d-sm-block d-none"
                >
                  <i
                    class="fa fa-info-circle"
                    v-b-tooltip.hover.right
                    :title="`Range between ${minRange} to ${maxRange}`"
                  />
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
                      :value="option.value + ',' + option.minValue + ',' + option.maxValue"
                      :id="option.value + '-radio'"
                      @change="changeRange('field')"
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
      minRangeArray: [],
      maxRangeArray: [],
      minRange: 0,
      maxRange: 0,
      minValue: null,
      maxValue: null,
      dsCode: "",
      selectedUnitIndex: 0,
    };
  },
  mounted() {
    let dsCode = this.filter.datasetCode.split(":")[1];
    this.dsCode = dsCode.toLowerCase();
    this.filter.subLevels.forEach((subLevel) => {
      this.options[subLevel.value] = null;
    });

    for (let property of this.filter.subLevels){
      if(this.isUnitProperty(property)){
        this.minRangeArray = [property.subLevels[0].minValue];
        this.maxRangeArray = [property.subLevels[0].maxValue];
      }
    }
    this.minRange = Math.max(...this.minRangeArray);
    this.maxRange = Math.min(...this.maxRangeArray);

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
                this.options[sub1.value] = sub2.value + ',' + sub2.minValue + ',' + sub2.maxValue;
              }
            }
          }
        }
      }
    });
  },
  computed: {
  },
  methods: {
    changeRange(fieldState) {
      // We store in the arrays all the thresholds for every filter
      // and we show in the tooltip the intersection of these limits
      let cnt = 1;
      if (fieldState == 'unit') {
        cnt = 0
      }
      for ( let key in this.options) {
        let val = this.options[key];
        if(val) {
          this.minRangeArray[cnt] = parseInt(val.split(',')[1]);
          this.maxRangeArray[cnt] = parseInt(val.split(',')[2]);
        }
        cnt++;
      }
      this.minRange = Math.max(...this.minRangeArray);
      this.maxRange = Math.min(...this.maxRangeArray);
      this.selectTag()
    },
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
    selectUnit(property, option, index) {
      this.selectedUnitIndex = index;
      this.changeRange('unit');
      this.selectTag(property, option);
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

.check-wrap {
  align-items: center;
}

.expand {
  margin-top: 0 !important;
}

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

.fa-external-link {
  color: #355FAA;
  margin: 0 24px 0 8px;
  font-size: 12px;
}
</style>
