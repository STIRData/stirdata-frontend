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
                <b-nav-item @click="signOut()">Sign out</b-nav-item>
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
            <!-- saved list-->
            <div class="savedlist">
              <!-- page details-->
              <div class="pagination-detail">Showing 1 - 10 from 21</div>
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
                  <tr>
                    <td> <a href="savedviewdetail.html">Animal Production Companies in Belgium and Norway </a></td>
                    <td>12 April 2021</td>
                    <td class="end"><a href="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false"><img src="img/ic-bullets.png"></a>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                        <li> <a class="dropdown-item" href="#">Details</a></li>
                        <li> <a class="dropdown-item" href="#">View</a></li>
                        <li> <a class="dropdown-item" href="#">Delete</a></li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td> <a href="savedviewdetail.html">Mining and Agriculture Companies in Europe </a></td>
                    <td>12 April 2021</td>
                    <td class="end"><a href="#" role="button" id="dropdownMenuLink2" data-bs-toggle="dropdown" aria-expanded="false"><img src="img/ic-bullets.png"></a>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                        <li> <a class="dropdown-item" href="#">Details</a></li>
                        <li> <a class="dropdown-item" href="#">View</a></li>
                        <li> <a class="dropdown-item" href="#">Delete</a></li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- action-->
              <div class="inputaction">
                <nav class="pagination-stir">
                  <ul>
                    <li><a href="#">Prev</a></li>
                    <li class="active"><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">Next</a></li>
                  </ul>
                </nav>
              </div>
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
      ]

    };
  },

  computed: {
    authuser() {
      return this.$store.getters.user;
    },

    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    }
  },

  methods: {
    // TODO replaced all with auth-next methods after api endpoints are done
    getDisplayName() {
      if (this.isAuthenticated) {
        return this.authuser.name ? this.authuser.name : this.authuser.getName();
      }
      return;
    },

    signOut() {
      if (this.$solid.auth) {
        this.$solid.auth.logout()
          .then(() => {
            this.$store.commit('setUser', null);
          });
      } else {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2
          .signOut()
          .then(() => {
            auth2.disconnect();
          })
          .then(this.$store.commit('setUser', null));
      }
      this.$router.push('/');
    },

    reset(){

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
