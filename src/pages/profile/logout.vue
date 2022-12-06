<template>
  <div />
</template>

<script>
  export default {
    middleware: 'auth',
    layout: 'minimal',
    created(){
      this.logout();   
    },
    methods: {
      logout() {
          this.$auth.logout();
        }
    }
  }
</script>

