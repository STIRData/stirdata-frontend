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
          :to="{ name: 'index'}"
        >
          HOME
        </b-nav-item>
        <b-nav-item
          :to="{ name: 'search'}"
        >
          SEARCH
        </b-nav-item>
        <b-nav-item
          href="https://stirdata.eu/"
          target="_blank"
        >
          PROJECT
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

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
