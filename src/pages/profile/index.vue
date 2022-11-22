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
            <b-form class="form" method="post" @submit.prevent="updateUser">
              <b-row>
                <b-col xl="6">
                  <div class="inputform"><span class="label">First Name</span>
                    <b-form-input v-model="firstName" placeholder="First Name" :disabled="!isStrategyLocal">
                    </b-form-input>
                  </div>
                </b-col>
                <b-col xl="6">
                  <div class="inputform"><span class="label">Last Name</span>
                    <b-form-input v-model="lastName" placeholder="Last Name" :disabled="!isStrategyLocal">
                    </b-form-input>
                  </div>
                </b-col>
              </b-row>
              <template v-if="isStrategyLocal">
              <div class="inputform"><span class="label">Current Password</span>
                <b-form-input v-model="oldPassword" placeholder="Current Password" type="password" />
              </div>
              <div class="inputform"><span class="label">New Password</span>
                <b-form-input v-model="newPassword" placeholder="Password" type="password" />
              </div>
              <div class="inputform"><span class="label">Re-type Password</span>
                <b-form-input placeholder="Password" type="password" v-model="verifyPassword" />
              </div>
              </template>
              <!-- Registered email -->
              <div class="inputform"><span class="label">Email address</span>
                <b-form-input v-model="email" placeholder="Email" :disabled="!isStrategyLocal"/>
              </div>
              <div class="inputaction">
                <!-- TODO Save and Reset should only be available for local users -->
                <b-button v-if="isStrategyLocal" type="submit">Save</b-button><span class="note space"><a href="#" @click="reset()" v-show="authStrategy === 'local'">Reset</a></span>
                <b-button class="delete">Delete Account</b-button>
              </div>
            </b-form>
            <div class="text-danger" v-show="error">{{ error }}</div>
            <div class="text-primary" v-show="success">{{ success }}</div>
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
  data() {
    return {
      currentUser: null,
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      verifyPassword: '',
      error: null,
      success: null,
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
    this.initValues();   
  },

  computed: {
   
    isAuthenticated() {
      return this.$auth.loggedIn;
    },

    authStrategy(){
     return this.$auth.$state.strategy;
    },

    isStrategyLocal(){
     return this.$auth.$state.strategy === 'local';
    }
  },

  methods: {
    initValues(){
      this.currentUser = Object.assign({}, this.$auth.user);
      this.firstName = this.currentUser.firstName;
      this.lastName = this.currentUser.lastName;
      this.email = this.currentUser.email;
    },
    
    getDisplayName() {
      if (this.isAuthenticated) {
        if (!this.currentUser.firstName && !this.currentUser.lastName) {
          return this.currentUser.email.substring(0, this.currentUser.email.lastIndexOf("@"));
        }
        else {
          return this.currentUser.firstName + ' ' + this.currentUser.lastName;
        }
      }
      return;
    },
    
    updateAuthUser() {
      this.currentUser.email = this.email;
      this.currentUser.firstName = this.firstName;
      this.currentUser.lastName = this.lastName;
      let clone=JSON.parse(JSON.stringify(this.currentUser)); //create for deep clone for store mutation
      this.$auth.setUser(clone);
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
    
    async updateUser() {
        this.error = null;
        this.success = null;
        if(this.oldPassword !=='' || this.newPassword !=='' || this.newPassword!==this.verifyPassword){
            
            if(this.newPassword !=='' && this.oldPassword ==''){
              this.error = 'You must provide your current password';
              return;
            }
            if(this.newPassword !== this.verifyPassword){
              this.error = 'Password and password verification don\'t match';
              return;
            }
            
        };
        try {
          await this.$api.put('user/updateUserDetails', {
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
            
          })

        } catch (e) {
          this.error = e.response.data.message
        } finally{
           this.updateAuthUser();
           this.success = 'User  account updated successfully';
        }
     },
    reset() {
      this.initValues();
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
