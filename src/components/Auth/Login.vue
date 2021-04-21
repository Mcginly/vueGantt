<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Авторизация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" validation>
              <v-text-field
                prepend-icon="fas fa-user"
                name="email"
                label="Логин"
                type="login"
                color="blue-grey darken-4"
                :rules="emailRules"
                v-model="email"
                required
                v-on:keyup.enter="onSubmit"
              >
              </v-text-field>
              <v-text-field
                id="password"
                prepend-icon="fas fa-key"
                name="password"
                label="Пароль"
                type="password"
                color="blue-grey darken-4"
                :counter="6"
                :rules="passwordRules"
                v-model="password"
                required
                v-on:keyup.enter="onSubmit"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              width="150px"
              v-on:keyup.enter="onSubmit"
              @click="onSubmit"
              :loading="loading"
              :disabled="!valid || loading">
              Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'Необходимо ввести логин',
        v => (v && v.length >= 1) || 'Необходимо ввести логин'
      ],
      passwordRules: [
        v => !!v || 'Введите пароль',
        v => (v && v.length >= 6) || 'Пароль должен содержать 6 или более символов'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    },
    userLdap () {
      return this.$store.getters.userLdap
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        // const user = {
        //   login: this.email,
        //   pwd: this.password
        // }
        this.$store.dispatch('ldapLogin', { user: this.email, pwd: this.password }) // loginUser
          .then(() => {
            this.$cookie.set('user_id', this.user, { expires: 365 })
            this.$router.push('/')
          }).catch(() => {
          })
      }
    }
  },
  mounted () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Авторизйтесь для доступа к этой странице')
    }
  }
}
</script>
