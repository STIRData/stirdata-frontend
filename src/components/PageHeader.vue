<template>
  <header
    class="m-0 navbar-brand container-fluid d-flex justify-content-between"
    role="banner"
  >
    <b-link
      :to="{ name: 'index'}"
    >
      <img
        src="../assets/img/stirdata-logo.png"
        alt="logo"
        class="logo ml-3"
      >
    </b-link>
    <b-navbar
      class="align-items-center flex-row d-flex p-0 mr-3"
      role="navigation"
    >
      <b-navbar-nav class="ml-xl-auto top-navbar">
        <b-nav-item
          class="my-2"
          :to="{ name: 'index'}"
        >
          HOME
        </b-nav-item>
        <b-nav-item
          class="my-2"
          :to="{ name: 'search'}"
        >
          SEARCH
        </b-nav-item>
        <b-nav-item
        class="my-2"
          href="https://stirdata.eu/"
          target="_blank"
        >
          PROJECT
        </b-nav-item>
        <b-nav-item
          v-show="isAuthenticated"
          class="my-2 pl-3 ml-3 border-left"
          @click="signOut"
        >
          <i class="fa fa-sign-out fa-lg" aria-hidden="true" />
          <span>SIGN OUT</span>
        </b-nav-item>
        <b-nav-item v-show="!isAuthenticated">
          <div
            id="google-signin-button"
            class="g-signin2"
          />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

<script>
  /* global gapi */
  import { mapGetters } from "vuex";

  export default {
    name: 'PageHeader',

    data() {
      return {
        id_token: null
      };
    },

    computed: {
      ...mapGetters({
        user: "user"
      }),

      isAuthenticated() {
        return this.$store.getters['isAuthenticated'];
      }
    },

    mounted() {
      setTimeout(() => {
        gapi.signin2.render('google-signin-button', {
          onsuccess: this.onSignIn
        })
      });
    },

    methods: {
      onSignIn(user) {
        const profile = user.getBasicProfile();
        this.$store.commit('setUser', profile);
        // console.log('ID: ' + profile.getId()); // Don't send this directly to your server!
        // console.log('Full Name: ' + profile.getName());
        // console.log('Given Name: ' + profile.getGivenName());
        // console.log('Family Name: ' + profile.getFamilyName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        this.$store.commit('setUser', profile);

        // The ID token for backend:
        this.id_token = user.getAuthResponse().id_token;
        // console.log('ID Token: ' + this.id_token);
      },

      signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut()
          .then(function () {
            auth2.disconnect();
          })
          .then(this.$store.commit('setUser', null));
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container-fluid {
    background: $white;
    height: 4rem;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 1030;
    padding: 0;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.08);

    &:not(.show) ::v-deep .search-query,
    &:not(.show) ::v-deep .auto-suggest-dropdown {
      display: none;
    }
  }

  .navbar-brand {
    min-width: 11.0625rem;
    flex: 0 0 auto;
    font-size: 0.9rem;

    .logo {
      padding: 5px;
      transition: 0.3s ease-in-out;
      width: 9.5625rem;
    }

    a.nav-link {
      padding: 18px 10px 18px 10px;
    }

    a.nav-link.nuxt-link-exact-active.nuxt-link-active {
      color: $default;
      font-weight: bold;
    }
  }
</style>
