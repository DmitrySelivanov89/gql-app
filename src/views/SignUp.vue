<template>
  <v-card class="ma-auto" width="500">
    <v-form v-model="isValid" class="ma-auto" @submit.prevent="signUp">
      <v-card-title>Sign Up</v-card-title>
      <v-card-text>
        <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            prepend-icon="mdi-email"
            required
            @blur="$v.email.$touch()"
            @input="$v.email.$touch()"
            @keydown.enter="signUp"
        />
        <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="passwordErrors"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            @blur="$v.password.$touch()"
            @input="$v.password.$touch()"
            @keydown.enter="signUp"
            @click:append="showPassword = !showPassword"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="ma-auto">
        <v-btn class="ma-5 info" @click="$router.push({ name: 'SignIn' })">
          Sign In
        </v-btn>
        <v-btn
            :disabled="!isValid || isLoading || this.password && this.email === '' "
            class="ma-5 info"
            @click="signUp"
            @keydown.enter="signUp"
        >
          Sign Up
        </v-btn>
        <v-alert v-if="signedUp" class="ma-5" dense outlined type="error">
          Login already taken
        </v-alert>
      </v-card-actions>
    </v-form>
    <div v-if="isLoading" class="text-center ma-5 ">
      <v-progress-circular
          :rotate="360"
          :size="100"
          :value="valueProgress"
          :width="10"
          color="primary"
      >
        {{ valueProgress }}
      </v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import {email, minLength, required} from "vuelidate/lib/validators";
import gql from "graphql-tag";
import {validationMixin} from "vuelidate";

const REGISTER_MUTATION = gql`
  mutation Register($login: String!, $password: String!) {
    register(login: $login, password: $password) {
      accessToken
      login
      refreshToken
    }
  }
`;

export default {
  mixins: [validationMixin],
  name: "SignUp",

  data() {
    return {
      email: "",
      password: "",
      signedUp: false,
      showPassword: false,
      isValid: true,
      isLoading: false,
      interval: {},
      valueProgress: 0,
    };
  },

  validations: {
    email: {required, email},
    password: {required, minLength: minLength(8)},
  },

  mounted() {
    this.interval = setInterval(() => {
      if (this.valueProgress === 100) {
        return (this.valueProgress = 0);
      }
      this.valueProgress += 20;
    }, 3000);
  },

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
      errors.push("The password must consist at least 8 characters");
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    },
  },

  methods: {
    signUp() {
      this.isLoading = true;
      this.$apollo
          .mutate({
            mutation: REGISTER_MUTATION,
            variables: {
              login: this.email,
              password: this.password,
            },
          })
          .then((response) => {
            localStorage.setItem(
                "accessToken",
                response.data.authenticate.accessToken
            );
            localStorage.setItem(
                "refreshToken",
                response.data.authenticate.refreshToken
            );
            this.$router.push("/Dashboard");
          })
          .catch((error) => console.log(error));
      this.$v.$touch();
      this.signedUp = true;
      this.isLoading = true;
    }
  }
}
</script>

<style scoped></style>
