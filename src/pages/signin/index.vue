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
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/img-feature-2.png">
                  <div class="text">
                    <h2>
                      Visualize, Analyze and<br>Save
                    </h2>
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
                  @click="$router.push({ name: '/profile/logout'})"
                >
                  Sign out
                </button>

                <div class="float-right">
                  <b-button @click="loginWithGoogle()" v-show="!isAuthenticated" class="login-btn">
                      <span class="icon"><font-awesome-icon icon="fa-brands fa-google" class="google-icon" /></span>
                      <span class="label">Sign in with Google</span>
                  </b-button>
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
    computed: {
      isAuthenticated() {
        this.$auth.loggedIn;
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
          .then((response) => { this.$router.push('/profile'); })
            .catch(error => {
              const errorResponse = new ErrorHandler().setAll(error).parse();

              this.message = `Login failed, please try again: ${errorResponse.message}`;
              return false;

            })
        } catch (e) {
           const errorResponse = new ErrorHandler().setAll(error).parse();
           this.message = `Error status: ${errorResponse.status}. Error message: ${errorResponse.message}`;
           return false;
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
      &.google-icon {
        margin-right: 0.5rem;
        height: 1.4rem;
        margin-top: 3px;
        margin-left: 2px;
      }
    }
  }
</style>
