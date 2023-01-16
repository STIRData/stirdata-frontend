<template>
  <ul>
    <li class="separator" :class="{ 'no-parent-separator': false }">
      <ul>
        <li class="pill">
          <a class="not-clickable">
            {{ child.label ? child.label : child.code }}
          </a>
        </li>
        <template v-if="child.child">
          <ActivityChildNode :child="child.child" />
        </template>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ActivityChildNode",
  props: {
    child: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
