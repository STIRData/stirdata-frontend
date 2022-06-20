import Vue from 'vue';

export default () => {
  Vue.filter('formatDate', (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString(['en-US'], {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }),
  Vue.filter('formatDateForCompany', (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  });
};

