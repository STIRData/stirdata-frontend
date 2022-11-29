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
          /* TODO solid logout check
           if (this.$solid.auth) {
            this.$solid.auth.logout()
            .then(() => {
              this.$store.commit('setUser', null);
            });
          }*/
        }
    }
  }
</script>

