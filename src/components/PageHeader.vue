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
          <li><b-link :to="{ name: 'providers' }">Data Providers</b-link></li>
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
      <b-navbar-toggle target="hamburger-menu">
        <span class="navbar-toggler-icon"></span>
      </b-navbar-toggle>
      <b-collapse id="hamburger-menu" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'search' }">Explore</b-nav-item>
          <b-nav-item :to="{ name: 'statistics' }">Statistics</b-nav-item>
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
          <b-nav-item :to="{ name: 'partners' }">Partners</b-nav-item>
          <b-nav-item :to="{ name: 'providers' }">Data Providers</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
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
      }
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/variables.scss";

  #hamburger-menu {
    background: $accent-first-color;
    position: absolute;
    right: var(--bs-gutter-x, 0.75rem);
    top: 99px;
    z-index: 2;
    width: 50%;
    border-radius: 4px;
    ul li {
      border-bottom: 1px solid #4b78c7;
      a {
        color: $background-color;
        padding: 10px 20px;
        display: block;
        text-align: right;
        text-decoration: none;
      }
    }
  }
</style>
