<template>
  <header>
    <b-container class="d-flex align-items-center navbar">
      <b-link :to="{ name: 'index' }">
        <img
          class="logo"
          src="../assets/img/ic-logo.png"
        >
      </b-link>
      <!-- navigation-->
      <nav
        id="navbarCollapse"
        class="mainnav collapse"
      >
        <ul>
          <li>
            <b-link :to="{ name: 'explore' }">
              Explore
            </b-link>
          </li>
          <li>
            <b-link :to="{ name: 'statistics' }">
              Statistics
            </b-link>
          </li>
          <li>
            <b-link :to="{ name: 'about' }">
              About
            </b-link>
          </li>
          <li>
            <b-link :to="{ name: 'partners' }">
              Partners
            </b-link>
          </li>
          <li>
            <b-link :to="{ name: 'providers' }">
              Data Providers
            </b-link>
          </li>
        </ul>
      </nav>
      <!-- navigation-->
      <client-only>
      <nav
        v-if="!isAuthenticated"
        class="actionnav">
        <ul>
          <li class="sign">
            <b-link :to="{ name: 'signin' }">
              Sign in
            </b-link>
          </li>
          <li>
            <b-link
              :to="{ name: 'signup' }"
              class="button"
            >
              Get Started
            </b-link>
          </li>
        </ul>
      </nav>
      <nav
        v-else
        class="actionnav"
      >
        <b-dropdown
          id="dropdownMenu"
          class="username"
          variant="outline-none"
          no-caret
          left
        >
          <template #button-content>
            {{ $auth.user.email }}<span class="caret"><i class="fa fa-angle-down" /></span>
          </template>
          <b-dropdown-item
            class="ml-0 pl-0 dropdown-item left"
            :to="{ path: '/profile' }"
          >
              Profile
          </b-dropdown-item>
          <b-dropdown-item
            class="ml-0 pl-0 dropdown-item left"
            :to="{ path: '/profile/savedview' }"
          >
            Saved view
          </b-dropdown-item>
          <b-dropdown-item
            class="ml-0 pl-0 dropdown-item"
            @click="signOut"
          >
            Sign out
          </b-dropdown-item>
        </b-dropdown>
      </nav>
      </client-only>
      <!-- hamburger-->
      <b-navbar-toggle target="hamburger-menu">
        <span class="navbar-toggler-icon" />
      </b-navbar-toggle>
      <b-collapse
        id="hamburger-menu"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'explore' }">
            Explore
          </b-nav-item>
          <b-nav-item :to="{ name: 'statistics' }">
            Statistics
          </b-nav-item>
          <b-nav-item :to="{ name: 'about' }">
            About
          </b-nav-item>
          <b-nav-item :to="{ name: 'partners' }">
            Partners
          </b-nav-item>
          <b-nav-item :to="{ name: 'providers' }">
            Data Providers
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </header>
</template>

<script>
  /* global gapi */
  import { mapGetters } from 'vuex';

  export default {
    name: 'PageHeader',

    data() {
      return {
        id_token: null
      };
    },

    computed: {
      authuser() {
        return this.$auth.user;
      },

      isAuthenticated() {
        return this.$auth.loggedIn;
      }
    },

    methods: {
      signOut() {
        this.$auth.logout();
        if (this.$solid.auth) {
          this.$solid.auth.logout()
            .then(() => {
              this.$store.commit('setUser', null);
            });
        } 
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
