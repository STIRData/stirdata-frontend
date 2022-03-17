<template>
  <b-modal
    id="info-modal"
    title="Company Details"
    button-size="sm"
    hide-footer
    centered
  >
    <h5>Legal name</h5>
    <p>{{ details.name }}</p>

    <h5>Founding date</h5>
    <p>{{ details.date }}</p>

    <h5>Activity</h5>
    <p>{{ details.activityCode }} - {{ details.activityLabel }}</p>
  </b-modal>
</template>

<script>
  export default {
    name: 'InfoModal',

    props: {
      item: {
        type: Object,
        required: true
      }
    },

    computed: {
      details() {
        return {
          'name': this.item['name'],
          'date': this.item['registration_date'],
          'activityCode': this.item.activity ? this.item.activity[0].code.split('/').pop() : '',
          'activityLabel': this.item.activity ? this.item.activity[0].label : ''
        };
      }
    }
  };
</script>
