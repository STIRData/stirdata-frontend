<template>
  <main role="main">
    <!-- breadcrumb-->
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <!-- container-->
    <section class="about-hero">
      <b-container>
        <!-- row-->
        <b-row>
          <!-- column.col-sm-12.col-md-6.col-lg-3.col-xl-3-->
          <b-col
            sm="12"
            md="8"
            class="headingtext"
          >
            <!-- heading-->
            <h1>About STIRDATA</h1>
            <h3>Explore registered companies in Europe</h3>
            <p>
              STIRData Action proposes the use of Linked Data and semantic
              technologies as the means to overcome the technical barriers that
              hamper the reuse of open data, namely, poor quality and limited
              availability of Open Data. In particular, the Action seeks to
              assist data sources through a set of data specifications,
              guidelines, and an accompanying harmonisation toolset for
              streamlining and facilitating the process of enriching and
              publishing company data as Linked Data.
            </p>
            <!-- counter-->

            <ul class="counter" v-if="fetched">
              <li>
                <span class="count">{{ countriesStatistics.length }}</span><span class="text"> European <br>Countries</span>
              </li>
              <li>
                <span class="count">{{ totalCompanies.toLocaleString()}}</span><span class="text">Registered<br>Companies</span>
              </li>
              <li>
                <span class="count">{{ activitiesStatistics.length }}</span><span class="text"> Business<br>Activities</span>
              </li>
            </ul>
            <div
              v-else
              class="d-flex justify-content-center"
            >
              <Spinner />
            </div>
            <!-- button nav-->
            <b-nav class="heronav">
              <ul class="w-100 d-flex justify-content-between">
                <li>
                  <b-link
                    class="button"
                    :to="{ name: 'partners'}"
                  >
                    View Partners
                  </b-link>
                </li>
                <li>
                  <b-link
                    class="button ml-2"
                    href="https://stirdata.eu/"
                    target="_blank"
                  >
                    About STIRData Project
                  </b-link>
                </li>
              </ul>
            </b-nav>
          </b-col>
          <!-- column-->
          <b-col
            md="4"
            class="decor"
          >
            <!-- illustration--><img
              src="../../assets/img/ic-illustration-wide.png"
            >
          </b-col>
        </b-row>
      </b-container>
    </section>
    <!-- highlight text-->
    <section class="about-highlight">
      <b-container>
        <!-- row-->
        <div class="box">
          <b-row>
            <!-- left .col-sm-12.col-md-6.col-lg-3.col-xl-3-->
            <b-col
              sm="12"
              md="5"
              class="contact"
            >
              <!-- icon-->
              <div class="contactwrap">
                <img
                  class="decor"
                  src="../../assets/img/ic-remarks.png"
                >
                <p>Contact us for more information regarding STIRDATA</p>
                <nav class="heronav">
                  <ul>
                    <li>
                      <a
                        class="button"
                        href="mailto:stirdata-portal@ails.ece.ntua.gr"
                      >Contact Us</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </b-col>
            <!-- right-->
            <b-col
              sm="12"
              md="7"
              class="comment"
            >
              <!-- comment-->
              <div class="commentwrap">
                <p>
                  The enhanced datasets will be also published to the national
                  open data portals of Greece (data.gov.gr), Norway
                  (data.norge.no), and Czechia (data.gov.cz) so that they can be
                  harvested by the EDP. The overall STIRData approach, technical
                  tools, and online services will be of a general purpose and
                  can be uptaken to facilitate harmonisation and reusability of
                  open data in other domains.
                </p>
                <img
                  class="triangle"
                  src="../../assets/img/ic-triangle.png"
                >
              </div>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </section>
  </main>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    components: {
      Breadcrumb: () => import('../../components/Breadcrumb')
    },

    data() {
      return {
        breadcrumb_items: [
          {
            text: 'HOME',
            to: { name: 'index' }
          },
          {
            text: 'ABOUT',
            active: true
          }
        ],
        fetched: false
      };
    },

    computed: {
      ...mapState({
        countriesStatistics: state => state.countriesStatistics,
        activitiesStatistics: state => state.activitiesStatistics,
        totalCompanies: state => state.totalCompanies
      })
    },

    async mounted() {
      await this.$store.dispatch('fetchTopLevelStatistics');
      this.fetched = true;
    },

    methods: {
    }
  };
</script>

<style lang="scss" scoped>
.breadcrumb {
  background-color: transparent;
  display: flex;
  flex-wrap: wrap;
  padding: 0 0;
  margin-bottom: 1rem;
  list-style: none;
}
</style>
