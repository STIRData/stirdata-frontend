<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <section class="profile">
      <b-container>
        <b-row>
          <b-col md="4" lg="3" xl="3" class="profile-sidebar">
            <h3>Welcome,</h3>
            <h1>{{ getDisplayName() }}</h1>
            <!-- navigation-->
            <nav class="sidenavigation">
              <ul>
                <b-nav-item :to="{ name: 'profile' }">Profile</b-nav-item>
                <b-nav-item class="active" :to="{ name: 'profile-savedview' }">Saved view</b-nav-item>
                <b-nav-item :to="{ path: 'logout' }">Sign out</b-nav-item>
              </ul>
            </nav>
          </b-col>
          <!-- column-->
          <b-col sm="12" md="8" lg="7" xl="7" class="profile-content">
            <!-- heading-->
            <div class="headingtext">
              <h2>Saved view</h2>
              <p>List of saved search queries</p>
            </div>
            <Spinner class="text-center" v-if="loading" />
            <h5 v-else-if="views.length === 0">
              You haven't any saved views yet. You can save your views in the <b-link :to="{ name: 'explore' }" class="anchor">Explore page</b-link>.
            </h5>
            <!-- saved list-->
            <div class="savedlist" v-else>
              <!-- page details-->
              <div class="pagination-detail">Showing {{views.length}} Results</div>
              <!-- table-->
              <table class="table table-borderless table-stir">
                <thead>
                  <tr>
                    <th scope="col">Name </th>
                    <th scope="col">Date Created</th>
                    <th class="end" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="view of views" :key="view.creationDate">
                    <td>
                      <b-link
                        :to="{ name: 'explore', params: { savedViewId: view.id } }"
                      >
                        {{ view.name }}
                      </b-link>
                    </td>
                    <td>{{view.creationDate | formatDate}}</td>
                    <td class="end">
                      <b-dropdown
                        no-caret
                        toggle-class="text-decoration-none px-0 py-1"
                        variant="link"
                      >
                        <template #button-content>
                          <img src="../../../assets/img/ic-bullets.png"/>
                        </template>
                        <b-dropdown-item
                          :to="{ name: 'explore', params: { savedViewId: view.id } }"
                        >
                          Show
                        </b-dropdown-item>
                        <b-dropdown-item
                          target="_blank"
                          rel="noopener noreferrer"
                          @click="deleteView(view.id)"
                        >
                          Delete
                        </b-dropdown-item>

                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-col>
          <b-col lg="2" xl="2" class="profile-decor">
            <img src="../../../assets/img/ic-decor-vertical.png">
          </b-col>
        </b-row>
      </b-container>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  middleware: 'auth',
  components: {
    Breadcrumb: () => import('../../../components/Breadcrumb')
  },
  //TODO protected by auth middlewear, only accesible for logged in users

  data() {
    return {
      breadcrumb_items: [
        {
          text: 'HOME',
          to: { name: 'index' }
        },
        {
          text: 'PROFILE',
          to: { name: 'profile' }
        },
        {
          text: 'SAVED VIEW',
          active: true
        }
      ],
      savedViews: [],
      loading: true

    };
  },
  async mounted() {
    this.views = await this.$calls.getSavedViews();
    this.loading = false;
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
    // TODO replaced all with auth-next methods after api endpoints are done
    getDisplayName() {
      if (this.isAuthenticated) {
        if (!this.authuser.firstName && !this.authuser.lastName) {
          return this.authuser.email.substring(0, this.authuser.email.lastIndexOf("@"));
        }
        else {
          return this.authuser.firstName + ' ' + this.authuser.lastName;
        }
      }
      return;
    },
    async deleteView(id) {
      this.loading = true
      await this.$calls.deleteView(id)
      this.views = await this.$calls.getSavedViews();
      this.loading = false;
    },
    reset() {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
