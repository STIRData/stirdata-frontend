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
                <b-nav-item :to="{ path: 'profile/logout' }">Sign out</b-nav-item>
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
                <b-form-input v-model="newPassword" placeholder="Password" type="password" minlength="7"/>
              </div>
              <div class="inputform"><span class="label">Re-type Password</span>
                <b-form-input placeholder="Password" type="password" v-model="verifyPassword" minlength="7"/>
              </div>
              </template>
              <!-- Registered email -->
              <div class="inputform"><span class="label">Email address</span>
                <b-form-input v-model="email" placeholder="Email" :disabled="!isStrategyLocal"/>
              </div>
              <div class="text-danger" v-show="error">{{ error }}</div>
               <div class="text-primary" v-show="success">{{ success }}</div>
              <div class="inputaction">
                <!-- TODO Save and Reset should only be available for local users -->
                <b-button v-if="isStrategyLocal" type="submit">Save</b-button><span class="note space"><a href="#" @click="reset()" v-if="isStrategyLocal">Reset</a></span>
                <b-button class="delete" @click="showMsgDeleteAccount()">Delete Account</b-button>
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

    isStrategyLocal(){
     return this.$auth.$state.user.userLoginType === 'CUSTOM';
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

    showMsgDeleteAccount() {
      this.error=null;
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete your account and all your saved views?', {
        title: 'Please confirm account deletion',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: 'I\'m sure',
        cancelTitle: 'NO',
        footerClass: 'p-1',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
            this.$calls.deleteUser()
            .then(response =>{
                this.$toast.show('User account deleted',{ 
                      theme: "toasted-primary", 
                      position: "top-center", 
                      duration : 3000
                  });
                this.$router.push('/profile/logout');
              })
            .catch(error => {
                this.error = error.message+" : "+error.response.data.error;
                return error;
                  
              });
        });

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

        let updatedUser = {
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName
            
        };
        this.email!== this.currentUser.email ? Object.assign(updatedUser, {email: this.email}) : 0 ;
        this.oldPassword !=="" ? Object.assign(updatedUser, {oldPassword: this.oldPassword, newPassword: this.newPassword }) : 0;
        this.$calls.updateUser(updatedUser).then(response =>{
            this.updateAuthUser();
            this.success = 'User  account updated successfully';
        })
        .catch(error =>{
            this.error = error.message+" : "+error.response.data.error;
            return;
        })
     },
    reset() {
      this.initValues();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .modal-{
  &header, &footer {
    height:4em;
    margin:0; }
}
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
