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
                Sign in using your email and password or <b-link :to="{ name: 'signup' }" class="anchor">Sign up</b-link> if you haven’t got an account.
              </p>
            </div>
            <!-- sign in form-->
            <div class="text-danger" v-show="message">{{ message }}</div>
            <div class="form">
              <div class="inputform">
                <span class="label">Email</span>
                <input v-model="login.email" type="email" @keydown.enter.prevent="loginWithLocal()">
              </div>
              <div class="inputform">
                <span class="label">Password</span>
                <input v-model="login.password" type="password" @keydown.enter.prevent="loginWithLocal()">
              </div>
              <div class="inputaction">
                <b-button type="submit" @click="loginWithLocal()">
                  Sign in
                </b-button>
                <!--<span class="note">
                  <span>or</span>
                  <a href="#">Forgot Password</a>
                </span>-->
                <button
                  v-show="isAuthenticated"
                  class="google"
                  type="button"
                  @click="signOut"
                >
                  Sign out
                </button>

                <div class="float-right">
                  <b-button @click="loginWithGoogle()" v-show="!isAuthenticated" class="login-btn">
                      <span class="icon"><font-awesome-icon icon="fa-brands fa-google" class="google-icon" /></span>
                      <span class="label">Sign in with Google</span>
                  </b-button>
<!--
                  <SolidLogin
                    v-if="!isAuthenticated"
                    ref="solidlogin"
                    popup-uri="../../dist-popup/popup.html"
                  >
                    <div
                      slot-scope="{ initializing, login }"
                      class="mt-2"
                    >
                     
                      <button v-if="initializing">
                        Loading...
                      </button>
                      <button
                        v-else
                        type="button"
                        class="login-btn"
                        @click="login()"
                      >
                        <span class="icon">
                          <svg class="solid-icon" viewBox="0 0 352 322">
                            <g fill="none">
                              <path
                                d="M87.973 282.353l-60.732-105.33a31.6 31.6 0 010-31.538L87.973 40.233c5.646-9.784 16.08-15.795 27.321-15.795H236.68c11.266 0 21.727 6.011 27.321 15.795l60.758 105.304a31.6 31.6 0 010 31.537l-60.732 105.33c-5.646 9.784-16.08 15.795-27.321 15.795H115.372a31.846 31.846 0 01-27.4-15.846z"
                                fill="#FFF"
                              ></path>
                              <path
                                d="M93.151 275.197l-57.115-99.06c-5.308-9.185-5.308-20.504 0-29.663l57.115-99.086a29.742 29.742 0 0125.734-14.857h114.23c10.59 0 20.426 5.646 25.734 14.857l57.167 99.034c5.308 9.185 5.308 20.504 0 29.663l-57.141 99.138a29.742 29.742 0 01-25.734 14.858H118.937a29.787 29.787 0 01-25.786-14.884z"
                                fill="#7C4DFF"
                              ></path>
                              <path
                                d="M118.469 142.233h117.534a2.649 2.649 0 002.654-2.654v-22.04c0-14.65-11.891-26.54-26.54-26.54h-70.568c-20.53-.026-37.157 16.6-37.157 37.13-.026 7.833 6.27 14.104 14.077 14.104zm11.527 97.368h70.229c21.207 0 38.432-17.225 38.432-38.432 0-7.078-5.724-12.828-12.828-12.828H106.942a2.537 2.537 0 00-2.55 2.55v23.054c-.026 14.181 11.475 25.656 25.604 25.656z"
                                fill="#F7F7F7"
                              ></path>
                              <path
                                d="M109.596 139.319l87.663 87.662c5.802 5.803 15.196 5.803 20.998 0l15.196-15.196c5.803-5.802 5.803-15.196 0-20.998l-87.637-87.663c-5.802-5.802-15.196-5.802-20.998 0l-15.196 15.196c-5.855 5.803-5.855 15.222-.026 20.999z"
                                fill="#F7F7F7"
                              ></path>
                              <path
                                fill="#444"
                                opacity=".3"
                                d="M198.69 228.464l-51.495-40.123h11.397zm-54.33-126.797l40.565 40.566h13.765z"
                              ></path>
                            </g>
                          </svg>
                        </span>
                        <span class="label">Sign in with Solid</span>
                      </button>
                    </div>
                  </SolidLogin>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
 import ErrorHandler from '@zaengle/error-handler';

  export default {
    middleware: 'guest',
    data() {
      return {
        login: {
          email: '',
          password: ''
        } ,
        id_token: null,
        webId: '',
        message: null

      }
    },

    solid: {
      user: {
        name: 'name',
        title: 'foaf:title'
      }
    },

    computed: {
      isAuthenticated() {
        this.$auth.loggedIn;
      }
    },
    async loggedIn() {
      this.message = null;
      let session = await this.$solid.auth.currentSession();
      const userUrl='/user/me';
      if (session) {
        // The ID token for backend:
        this.id_token = session.authorization.id_token;
        this.$api
          .post('oauth/authorize/solid', { token: this.id_token })
          .then((response) => {
            this.$api.setToken(response.data.token, 'Bearer');
            this.$auth.strategy.token.set('Bearer '+ response.data.token);
            this.$auth.setStrategy('local');
            async() => {
                      const user = await this.$api.$get(userUrl);
                      this.$auth.setUser(user);
                      this.$router.push('/');
             }
            
          })
          .catch(error => {
              const errorResponse = new ErrorHandler().setAll(error).parse();
              this.message = `Error status: ${errorResponse.status}. Error message: ${errorResponse.message}`;
              localStorage.clear();
              return false;

            })
      }
    },
    methods: {
      async loginWithGoogle() {
        this.message = null;
        await this.$auth.loginWith("google");
      },
      async loginWithLocal() {
			  this.message = null;

        try {
          await this.$auth.loginWith('local', { data: this.login })
            .catch(error => {
              //let response = error.response.data;
              const errorResponse = new ErrorHandler().setAll(error).parse();

              this.message = `Login failed, please try again: ${errorResponse.message}`;
              return false;

            })
          this.$router.push('/profile');

        } catch (e) {
           const errorResponse = new ErrorHandler().setAll(error).parse();
           this.message = `Error status: ${errorResponse.status}. Error message: ${errorResponse.message}`;
           return false;
        }
		  },
      signOut() {
        this.$auth.logout();
        if (this.$solid.auth) {
          this.$solid.auth.logout()
            .then(() => {
              this.$store.commit('setUser', null);
            });
        }

      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .abcRioButton {
    .abcRioButtonContentWrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .abcRioButtonContents {
        font-family: inherit;

        span {
          font-size: 12pt;
        }
      }
    }
  }

  .login-btn {
    display: inline-flex !important;
    align-items: center;
    width: 200px;
    height: 42px;
    padding: 5px 15px !important;

    svg {
      &.solid-icon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 0.5rem;
        margin-bottom: 3px;
      }
      &.google-icon {
        margin-right: 0.5rem;
        height: 1.4rem;
        margin-top: 3px;
        margin-left: 2px;
      }
    }
  }
</style>
