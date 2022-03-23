<template>
  <footer>
    <b-container>
      <div class="d-flex justify-content-between top">
        <div class="logo">
          <b-link :to="{ name: 'index' }">
            <img src="../assets/img/ic-logo-small.png">
          </b-link>
        </div>
        <b-nav class="bottomnav">
          <ul>
            <li>
              <b-link :to="{ name: 'index' }">
                Home
              </b-link>
            </li>
            <li>
              <b-link :to="{ name: 'search' }">
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
            <li>
              <b-link :to="{ name: 'signin' }">
                Sign In
              </b-link>
            </li>
            <li>
              <b-link :to="{ name: 'signup' }">
                Sign Up
              </b-link>
            </li>
          </ul>
        </b-nav>
        <b-nav class="social">
          <ul>
            <li>
              <a
                href="https://www.facebook.com/STIRData-Action-112222720952173"
                target="_blank"
              ><i class="fa fa-facebook-f" /></a>
            </li>
            <li>
              <a
                href="https://twitter.com/stirdata"
                target="_blank"
              ><i class="fa fa-twitter" /></a>
            </li>
          </ul>
        </b-nav>
      </div>
    </b-container>
    <div class="bottom">
      <b-container>
        <p>
          STIRDATA is co-financed by the Connecting Europe Facility Programme of the European Union, under GA n. INEA/CEF/ICT/A2019/2063078
        </p>
      </b-container>
    </div>
  </footer>
</template>

<script>
  /* global gapi */
  import { mapGetters } from 'vuex';

  export default {
    name: 'PageFooter',

    computed: {},

    methods: {}
  };
</script>

<style lang="scss" scoped>
</style>
