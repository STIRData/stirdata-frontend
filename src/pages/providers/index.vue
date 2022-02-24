<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <div class="pageintro">
      <b-container>
        <div class="headingtext">
          <h1>Data Providers</h1>
          <p class="half">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </p>
        </div>
      </b-container>
    </div>
    <section class="two-columns">
      <b-container>
        <b-row>
          <b-col lg="4" xl="3" class="two-columns-sidebar">
            <div class="ads">
              <div class="ads-learn">
                <img class="decor" src="../../assets/img/ic-ads.png" />
                <p>
                  STIRDATA is an online platform for searching, navigating,
                  synthetically analyzing, and visualizing company related open
                  data content
                </p>
                <nav class="heronav">
                  <ul>
                    <li>
                      <b-link class="button" :to="{ name: 'about' }">Learn More</b-link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div class="ads-explore">
                <h2>Explore <br />Companies</h2>
                <p>
                  Search, Navigate, Analyze, and Visualizing Company related
                  Open Data Content
                </p>
                <nav class="heronav">
                  <ul>
                    <li>
                      <b-link class="button" :to="{ name: 'search' }">Explore Now</b-link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </b-col>
          <b-col lg="8" xl="9" class="two-columns-content">
            <div class="data-availability">
              <div class="headingtext">
                <h2>Data Availability Mapping</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div class="text-center" v-if="providers.length === 0">
                <Spinner />
              </div>
              <b-row class="table-section" v-else>
                <b-col sm="5" md="3" lg="3" xl="3" class="table-section-column">
                  <ul class="table-section-label countrylabel">
                    <li class="head">Metadata</li>
                    <li>Company Name</li>
                    <li>Founding date</li>
                    <li>Dissolution date</li>
                    <li>Economic activity</li>
                    <li>Location</li>
                  </ul>
                </b-col>
                <b-col sm="7" md="9" lg="9" xl="9" class="table-section-data">
                  <VueSlickCarousel v-bind="carouselSettings">
                    <ul
                      class="country"
                      v-for="provider in providers"
                      :key="provider.country.code"
                    >
                      <li class="head">{{ provider.country.label }}</li>
                      <li><img src="../../assets/img/ic-check.png" /></li>
                      <li>
                        <img v-if="'foundingDate' in provider" src="../../assets/img/ic-check.png" />
                      </li>
                      <li>
                        <img v-if="'dissolutionDate' in provider" src="../../assets/img/ic-check.png" />
                      </li>
                      <li>
                        <img v-if="'activityVocabularies' in provider" src="../../assets/img/ic-check.png" />
                      </li>
                      <li>
                        <img v-if="'placeVocabularies' in provider" src="../../assets/img/ic-check.png" />
                      </li>
                    </ul>
                    <template #prevArrow="">
                      <button type="button" class="slick-prev">
                        <font-awesome-icon :icon="['fas', 'angle-left']" />
                      </button>
                    </template>
                    <template #nextArrow="">
                      <button type="button" class="slick-next">
                        <font-awesome-icon :icon="['fas', 'angle-right']" />
                      </button>
                    </template>
                  </VueSlickCarousel>
                </b-col>
              </b-row>
            </div>
            <div class="data-information">
              <div class="headingtext">
                <h2>Data Information</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div class="text-center" v-if="providers.length === 0">
                <Spinner />
              </div>
              <b-row class="table-section" v-else>
                <b-col xs="6" sm="5" md="3" lg="4" xl="3" class="table-section-column">
                  <ul class="table-section-label countrylabel">
                    <li class="head">Information</li>
                    <li>Last Updated</li>
                    <!-- <li>Update Frequency</li> -->
                    <li>SPARQL Endpoint</li>
                    <li>Number of Entries</li>
                    <li class="source">Source</li>
                    <!-- <li>License</li> -->
                  </ul>
                </b-col>
                <b-col xs="6" sm="7" md="9" lg="8" xl="9" class="table-section-data">
                  <VueSlickCarousel v-bind="carouselSettings">
                    <ul
                      class="country"
                      v-for="provider in providers"
                      :key="provider.country.code"
                    >
                      <li class="head">{{ provider.country.label }}</li>
                      <li>
                        <span v-if="'lastUpdated' in provider">{{
                          provider.lastUpdated | formatDate
                        }}</span>
                      </li>
                      <!-- <li>Monthly</li> -->
                      <li>
                        <a :href="provider.sparqlEndpoint" target="_blank" rel="noopener noreferrer">
                          {{ provider.country.label }}
                        </a>
                      </li>
                      <li>
                        {{ Number(provider.legalEntityCount).toLocaleString() }}
                      </li>
                      <li class="source">
                        <a
                          v-if="'source' in provider && 'label' in provider.source"
                          :href="provider.source.uri" target="_blank" rel="noopener noreferrer"
                        >
                          {{ provider.source.label }}
                        </a>
                      </li>
                      <!-- <li>CC BY-SA</li> -->
                    </ul>
                    <template #prevArrow="">
                      <button type="button" class="slick-prev">
                        <font-awesome-icon :icon="['fas', 'angle-left']" />
                      </button>
                    </template>
                    <template #nextArrow="">
                      <button type="button" class="slick-next">
                        <font-awesome-icon :icon="['fas', 'angle-right']" />
                      </button>
                    </template>
                  </VueSlickCarousel>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </main>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";

export default {
  components: {
    Breadcrumb: () => import("../../components/Breadcrumb"),
    Spinner: () => import("../../components/Spinner"),
    VueSlickCarousel,
  },

  data() {
    return {
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "DATA PROVIDERS",
          active: true,
        },
      ],
      carouselSettings: {
        dots: false,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 760,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 520,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
      providers: [],
    };
  },
  async mounted() {
    this.providers = await this.$calls.getProviders();
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/mixin.scss";
  @import "../../assets/scss/variables.scss";

  .slick-slider {
    position: initial;
  }

  .table-section-data {
    @include clearfix();

    padding-left: 0;
    border-top: 2px solid $accent-first-color;
  }

  .country {
    margin: 0;
    float: left;
    width: 25%;

    li {
      text-align: center;
      img {
        width: 19px;
        display: inline-block !important;
      }
    }
  }
</style>
