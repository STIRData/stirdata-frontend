<template>
  <header>
    <b-container class="d-flex align-items-center navbar">
      <b-link :to="{ name: 'index' }">
        <img class="logo" src="../assets/img/ic-logo.png" />
      </b-link>
      <!-- navigation-->
      <nav class="mainnav collapse" id="navbarCollapse">
        <ul>
          <li><b-link :to="{ name: 'search' }">Explore</b-link></li>
          <li><b-link :to="{ name: 'statistics' }">Statistics</b-link></li>
          <li><b-link :to="{ name: 'about' }">About</b-link></li>
          <li><b-link :to="{ name: 'partners' }">Partners</b-link></li>
          <li><b-link :to="{ name: 'data_providers' }">Data Providers</b-link></li>
        </ul>
      </nav>
      <!-- navigation-->
      <nav class="actionnav">
        <ul>
          <li class="sign">
            <b-link :to="{ name: 'signin' }">Sign in</b-link>
          </li>
          <li>
            <b-link :to="{ name: 'signup' }" class="button">Get Started</b-link>
          </li>
          <!-- TODO: Remove these 2 nav-items after implementing sign-in page -->
          <!-- <b-nav-item
            v-show="isAuthenticated"
            class="my-2 pl-3 ml-3 border-left"
            @click="signOut"
          >
            <i class="fa fa-sign-out fa-lg" aria-hidden="true" />
            <span>SIGN OUT</span>
          </b-nav-item>
          <b-nav-item v-show="!isAuthenticated">
            <div id="google-signin-button" class="g-signin2" />
          </b-nav-item> -->
        </ul>
      </nav>
      <!-- hamburger-->
      <button
        class="navbar-toggler collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </b-container>
  </header>
</template>

<script>
  /* global gapi */
  import { mapGetters } from "vuex";

  export default {
    name: "PageHeader",

    data() {
      return {
        id_token: null,
      };
    },

    computed: {
      ...mapGetters({
        user: "user",
      }),

      isAuthenticated() {
        return this.$store.getters["isAuthenticated"];
      },
    },

    mounted() {
      setTimeout(() => {
        gapi.signin2.render("google-signin-button", {
          onsuccess: this.onSignIn,
        });
      });
    },

    methods: {
      onSignIn(user) {
        const profile = user.getBasicProfile();
        this.$store.commit("setUser", profile);
        // console.log('ID: ' + profile.getId()); // Don't send this directly to your server!
        // console.log('Full Name: ' + profile.getName());
        // console.log('Given Name: ' + profile.getGivenName());
        // console.log('Family Name: ' + profile.getFamilyName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        this.$store.commit("setUser", profile);

        // The ID token for backend:
        this.id_token = user.getAuthResponse().id_token;
        // console.log('ID Token: ' + this.id_token);
      },

      signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2
          .signOut()
          .then(function () {
            auth2.disconnect();
          })
          .then(this.$store.commit("setUser", null));
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
