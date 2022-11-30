<template>
  <main role="main">
    <section class="authentication">
      <div class="container">
        <div class="row">
          <div class="col-md-6 authentication-left">
            <!-- box-->
            <div class="box signup">
              <!-- banner feature-->
              <VueSlickCarousel
                :arrows="false"
                :dots="true"
                :autoplay="true"
                class="bannerfeatures slick-features"
              >
                <li>
                  <img src="../../assets/img/img-feature-1-yellow.png">
                  <div class="text">
                    <h2>
                      Explore, Search and <br>Navigate
                    </h2>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/img-feature-2-yellow.png">
                  <div class="text">
                    <h2>
                      Visualize, Analyze and<br>Save
                    </h2>
                  </div>
                </li>
              </VueSlickCarousel>
            </div>
          </div>
          <div class="col-md-6 authentication-right">
            <!-- heading-->
            <div class="headingtext">
                <h1>Sign up</h1>
                <p>Sign up to start using additional tools in the STIRDATA Platform, or <b-link :to="{ name: 'signin' }" class="anchor">Sign in</b-link> if you already have an account.</p>
              </div>
            <!-- sign in form-->
            <div class="text-danger" v-show="error">{{ error }}</div>
            <form method="post" @submit.prevent="register">
            <div class="form">
                <div class="row">
                  <div class="col-xl-6">
                    <div class="inputform"><span class="label">First Name</span>
                      <input type="text" v-model="firstName" required>
                    </div>
                  </div>
                  <div class="col-xl-6">
                    <div class="inputform"><span class="label">Last Name</span>
                      <input type="text" v-model="lastName" required>
                    </div>
                  </div>
                </div>
                <div class="inputform"><span class="label">Email</span>
                  <input type="email" v-model="email" required>
                </div>
                <div class="inputform"><span class="label">Password</span>
                  <input type="password" v-model="password" required>
                </div>
                <div class="inputform"><span class="label">Repeat Password</span>
                  <input type="password" v-model="passwordconf" required>
                </div>
                <div class="inputform"><span class="label">Organisation</span>
                  <input type="text" v-model="organisation">
                </div>
                <div class="inputaction">
                  <button type="submit">Sign up</button>
                </div>
              </div>
            </form>
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordconf:'',
        organisation:'',
        error: null

      }
    },
    methods: {
      async register() {
        try {
          if(this.password!==this.passwordconf){
            this.error = 'Password and password confirmation don\'t match';
            return;
          }
          await this.$api.post('user/register', {
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            organisation: this.organisation
          })

          await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            },
          })

          this.$router.push('/')
        } catch (e) {
          this.error = e.response.data.message
        }
     }
    }
  };
</script>
