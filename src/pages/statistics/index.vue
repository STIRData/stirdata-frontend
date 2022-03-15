<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <div class="maps small">
      <!--#chart-map.map-box-->
      <!-- to be replaced with js maps-->
      <img src="../../assets/img/img-temp-map.png" />
    </div>
    <b-container>
      <div class="headingtext">
        <h1>Statistics</h1>
        <p class="half">
          STIRDATA is an online platform for searching, navigating, synthetically analysing, and visualising company-related open data content.
        </p>
      </div>
    </b-container>
    <section class="statistics">
      <b-container>
        <div class="headingtext">
          <h2>Explore countries statistics in<br />STIRDATA database</h2>
        </div>
        <div v-if="loading" class="d-flex justify-content-center">
          <Spinner />
        </div>
        <b-row class="statistics-countries-list" v-else>
          <b-col
            sm="12" md="6" lg="auto" xl="auto" class="country"
            v-for="country in countries"
            :key="country.country.code"
          >
            <b-link
              class="wrap"
              :to="{ name: 'statistics-region-region', params: { region: country.country.code } }"
            >
              <h3>{{ country.country.label }}</h3>
              <ul>
                <li>
                  <span class="amount">
                    {{ Number(country.count).toLocaleString() }}
                  </span>
                  <div class="label">Companies</div>
                </li>
              </ul>
            </b-link>
          </b-col>
        </b-row>
        <div class="statistics-activity-list">
          <div class="headingtext">
            <h2>Explore business activity statistics<br />STIRDATA database</h2>
          </div>
          <div v-if="loading" class="d-flex justify-content-center">
            <Spinner />
          </div>
          <div class="statistics-activity-list-wrap" v-else>
            <VueSlickCarousel v-bind="activityCarouselSettings" v-if="!loading">
              <ul v-for="index in activityNumberOfTriads" :key="index">
                <li
                  v-for="activity in arraySlice(index - 1, index)"
                  :key="activity.activity.code"
                >
                  <b-link
                    class="wrap"
                    :to="{ name: 'statistics-activity-activity', params: { activity: activity.activity.code.split(':')[1] } }"
                  >
                    <div class="icon">
                      <img :src="getImagePath(activity)" />
                    </div>
                    <div class="text">
                      <div class="counter">
                        {{ Number(activity.count).toLocaleString() }}
                      </div>
                      <div class="label">
                        {{ capitalizeTheFirstLetterOfEachWord(activity.activity.label) }}
                      </div>
                    </div>
                  </b-link>
                </li>
              </ul>
              <template #prevArrow="">
                <button type="button" class="slick-prev">
                  <font-awesome-icon :icon="['fa', 'angle-left']" />
                </button>
              </template>
              <template #nextArrow="">
                <button type="button" class="slick-next">
                  <font-awesome-icon :icon="['fa', 'angle-right']" />
                </button>
              </template>
            </VueSlickCarousel>
          </div>
        </div>
      </b-container>
    </section>
  </main>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import { mapState } from "vuex";

export default {
  components: {
    Breadcrumb: () => import("../../components/Breadcrumb"),
    Spinner: () => import("../../components/Spinner"),
    VueSlickCarousel,
  },

  data() {
    return {
      loading: true,
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "STATISTICS",
          active: true,
        }
      ],
      statistics: [],
      activityCarouselSettings: {
        dots: false,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 760,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 520,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            }
          }
        ]
      }
    };
  },

  async mounted() {
    this.loading = true;
    if (this.countries.length) {
      this.loading = false;
      return;
    }
    await this.$store.dispatch('fetchTopLevelStatistics');
    this.loading = false
  },

  computed: {
    ...mapState({
        countries: state => state.countriesStatistics,
        activities: state => state.activitiesStatistics,
    }),
    activityNumberOfTriads: function () {
      return Math.ceil(this.activities.length / 3);
    }
  },

  methods: {
    arraySlice: function (start, end) {
      return this.activities.slice(start * 3, 3 * end);
    },
    capitalizeTheFirstLetterOfEachWord: function (words) {
      var separateWord = words.toLowerCase().split(" ");
      for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }
      separateWord = separateWord.join(" ");
      if (separateWord.length > 75) {
        separateWord = separateWord.slice(0, 75) + "...";
      }
      return separateWord;
    },
    getImagePath: function (activity) {
      return require(`../../assets/img/icons/ic-${
        activity.activity.code.split(":")[1]
      }.png`);
    }
  }
};
</script>