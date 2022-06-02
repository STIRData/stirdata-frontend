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
                <b-nav-item class="active" :to="{ name: 'profile' }">Profile</b-nav-item>
                <b-nav-item :to="{ name: 'profile-savedview' }">Saved view</b-nav-item>
                <b-nav-item @click="signOut()">Sign out</b-nav-item>
              </ul>
            </nav>
          </b-col>
          <!-- column-->
          <b-col sm="12" md="8" lg="7" xl="7" class="profile-content">
            <!-- heading-->
            <div class="headingtext">
              <h2>Profile</h2>
              <p>Profile details</p>
            </div>
            <!-- sign in form-->
            <b-form class="form">
              <b-row>
                <b-col xl="6">
                  <div class="inputform"><span class="label">First Name</span>
                    <b-form-input v-model="currentUser.firstName" placeholder="First Name">
                    </b-form-input>
                  </div>
                </b-col>
                <b-col xl="6">
                  <div class="inputform"><span class="label">Last Name</span>
                    <b-form-input v-model="currentUser.lastName" placeholder="Last Name">
                    </b-form-input>
                  </div>
                </b-col>
              </b-row>
              <!-- TODO Only for local account password -->

              <div class="inputform"><span class="label">Password</span>
                <b-form-input placeholder="Password" type="password" />
              </div>
              <!-- Organisation info only available for local users -->
              <div class="inputform"><span class="label">Organisation</span>
                <b-form-input v-model="currentUser.org" placeholder="Organisation" />
              </div>
              <div class="inputaction">
                <!-- TODO Save and Reset should only be available for local users -->
                <b-button type="button" v-show="authStrategy === 'local'">Save</b-button><span class="note space"><a href="#" @click="reset()" v-show="authStrategy === 'local'">Reset</a></span>
                <b-button class="delete">Delete Account</b-button>
              </div>
            </b-form>
          </b-col>
          <b-col lg="2" xl="2" class="profile-decor">
            <img src="../../assets/img/ic-decor-vertical.png">
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
    Breadcrumb: () => import('../../components/Breadcrumb')
  },
  //TODO protected by auth middlewear, only accesible for logged in users

  data() {
    return {
      currentUser: null,
      breadcrumb_items: [{
          text: 'HOME',
          to: {
            name: 'index'
          }
        },
        {
          text: 'PROFILE',
          active: true
        }
      ]

    };
  },
  created(){
    this.currentUser = this.getUser();
  }, 

  computed: {
    authuser() {
      return this.$auth.user;
    },

    isAuthenticated() {
      return this.$auth.loggedIn;
    },

    authStrategy(){
     return this.$auth.$state.strategy;
    }
  },

  methods: {
    // TODO replaced all with auth-next methods after api endpoints are done
    getDisplayName() {
      if (this.isAuthenticated) {
        return this.authuser.firstName + ' ' + this.authuser.lastName;
      }
      return;
    },
    getUser(){
      return Object.assign({}, this.$auth.user);
    },

    signOut() {
      this.$auth.logout();
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

    reset() {

    }
  }
};
</script>

<style lang="scss" scoped>
textarea:hover,
input:hover,
textarea:active,
input:active,
textarea:focus,
input:focus,
button:focus,
button:active,
button:hover,
label:focus,
.btn:active,
.btn.active {
  outline: 0px !important;
  -webkit-appearance: none;
  box-shadow: none !important;
}
</style>
