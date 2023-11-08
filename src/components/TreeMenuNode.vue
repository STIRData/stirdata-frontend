<template>
  <div>
    <div>
      <div class="check-wrap d-flex justify-content-between">
        <b-form-checkbox
          :id="menuType+'-checkbox-'+menuItem.value"
          :disabled="isDisabled"
          v-model="selected"
          :name="menuType+'-checkbox-'+menuItem.value"
          :value=true
          :unchecked-value=false
          v-b-tooltip.hover.right
          :title="menuItem.text"
          @change="selectTag(`${menuItem.type}:${menuItem.value}`, selected)"
        >
          {{ menuItem.text }}
        </b-form-checkbox>
        <div
          v-if="hasSubLevels"
          class="plus-expander"
          v-b-toggle="'collapse'+menuItem.value"
        >
          <span class="expand"></span>
        </div>
      </div>
      <b-collapse
        v-if="hasSubLevels"
        class="accordion-collapse"
        :id="'collapse'+menuItem.value"
        @show="isCollapseOpen = true"
      >
        <ul
          v-if="isCollapseOpen"
          class="treeMenu"
        >
          <li
            v-for="level in subLevels"
            :key="'menu-'+level.value"
            :id="'menu-'+level.value"
            class="treeMenuNode"
          >
            <tree-menu-node
              :menuType="menuType"
              :menuItem="level"
              :tags="tags"
              @select-tag="forwardEvent"
            />
          </li>
        </ul>
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeMenuNode',

  props: {
    menuType: {
      type: String,
      required: true
    },
    menuItem: {
      type: Object,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      isCollapseOpen: false,
      subLevels: [],
      selected: false,
      isDisabled: false
    };
  },

  mounted() {
    let nodeTag = `${this.menuItem.type}:${this.menuItem.value}`;
    if (this.tags.includes(nodeTag)) {
      this.selected = true;
    }

    if (this.menuItem.type === 'lau') {
      return;
    }

    if (this.menuItem.type === 'stat') {
      if (this.menuItem.value.startsWith('feature') || this.menuItem.value.startsWith('filter')) {
        let inputFieldLabel = document.getElementById(`stat-checkbox-${this.menuItem.value}`).nextSibling;
        inputFieldLabel.classList.add('hideInputCheckbox');
        this.isDisabled = true;
      }
      if (this.menuItem.subLevels) {
        this.subLevels = this.menuItem.subLevels;
      }
    }
    else {
      this.$calls.getSubLevels(this.menuType, `${this.menuItem.type}:${this.menuItem.value}`)
        .then(response => {
          this.subLevels = response;
        })
        .catch(error => console.error(error));
    }
  },

  computed: {
    hasSubLevels() {
      return this.subLevels.length > 0;
    }
  },

  methods: {
    selectTag(tagCode, checked) {
      this.$emit('select-tag', {tagCode: tagCode, type: this.menuType, checked: checked});
    },
    forwardEvent(e) {
      this.$emit('select-tag', e);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

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

::v-deep .hideInputCheckbox {
  background-image: none !important;
  padding-left: 0 !important;
  color: #21314D !important;
}
</style>
