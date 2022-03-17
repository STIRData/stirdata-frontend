<template>
  <main role="main">
    <section class="authentication">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-6 authentication-left">
            <!-- box-->
            <div class="box signin">
              <!-- banner feature-->
              <VueSlickCarousel
                :arrows="false"
                :dots="true"
                :autoplay="true"
                class="bannerfeatures slick-features"
              >
                <li>
                  <img src="../../assets/img/img-feature-1.png">
                  <div class="text">
                    <h2>
                      Explore, Search and <br>Navigate
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/img-feature-2.png">
                  <div class="text">
                    <h2>
                      Visualize, Analyze and<br>Save
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                  </div>
                </li>
              </VueSlickCarousel>
            </div>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 authentication-right">
            <!-- heading-->
            <div class="headingtext">
              <h1>Sign in</h1>
              <p>
                Sign in using your email and password or <a
                  class="anchor"
                  href="signup.html"
                >Sign up  </a> if you haven’t got an account.
              </p>
            </div>
            <!-- sign in form-->
            <div class="form">
              <div class="inputform">
                <span class="label">Email</span>
                <input type="email">
              </div>
              <div class="inputform">
                <span class="label">Password</span>
                <input type="password">
              </div>
              <div class="inputaction">
                <button type="button">
                  Sign in
                </button><span class="note"><span>or</span><a href="#">Forgot Password</a></span>
                <button
                  v-show="isAuthenticated"
                  class="google"
                  type="button"
                  @click="signOut"
                >
                  Sign out
                </button>
                <div
                  v-show="!isAuthenticated"
                  id="google-signin-button"
                  class="g-signin2 float-right google"
                />

                <SolidLogin
                  v-if="!isAuthenticated"
                  ref="solidlogin"
                  popup-uri="../../dist-popup/popup.html"
                >
                  <div
                    slot-scope="{ initializing, login }"
                    class="mt-2"
                  >
                    <!--<span v-if="webId">{{ webId }}</span>-->
                    <button v-if="initializing">
                      Loading...
                    </button>
                    <!--<button v-else-if="loggedIn" @click="logout()" :title="webId">Solid Log out</button>-->
                    <button
                      v-else
                      type="button"
                      @click="login()"
                    >
                      Solid Log In
                    </button>
                  </div>
                </SolidLogin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        id_token: null,
        webId: ''

      };
    },
    solid: { user: {
      name: 'name',
      title: 'foaf:title'
    } },
    computed: {
      isAuthenticated() {
        return this.$store.getters['isAuthenticated'];
      }

    },

    mounted() {
      setTimeout(() => {
        gapi.signin2.render('google-signin-button', {
          onsuccess: this.onSignIn
        });
      });
    },
    async loggedIn() {
      console.log('USERNAME:' + this.user.name);
      let session = await this.$solid.auth.currentSession();
      if (session) {
        // The ID token for backend:
        this.id_token = session.authorization.id_token;
        console.log(this.id_token);
        this.webId = session.webId;
        // Build a custom user json object
        let usrObj = { 'name': '' + this.user.name, 'webID': this.webId };
        this.$store.commit('setUser', usrObj);
      }
      this.$router.push('/');
    },
    methods: {
      onSignIn(user) {
        const profile = user.getBasicProfile();
        this.$store.commit('setUser', profile);
        // The ID token for backend:
        this.id_token = user.getAuthResponse().id_token;
        console.log(this.id_token);
        this.$router.push('/');
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
      }
    }
  };
</script>
