<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="success" dark>
              <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Name"
                  name="name"
                  v-model="user.name"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  name="email"
                  v-model="user.email"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  v-model="user.password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="Confirm Password"
                  name="password"
                  v-model="user.password_confirmation"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="register">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import LoginSingupLayout from "../layouts/LoginSignupLayout.vue";

Vue.use(axios);
export default {
  created() {
    this.$emit("update:layout", LoginSingupLayout);
  },
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      snackbar: false,
      snackbarText: "",
    };
  },
  methods: {
    register() {
      axios
        .post("http://127.0.0.1:8000/api/register/", this.user)
        .then((response) => {
          // console.warn(response.data.access_token.plainTextToken);
          if (response.status == 201) {
            this.snackbar = true;
            this.snackbarText = "Registered Successfully!";
            localStorage.setItem(
              "token",
              response.data.access_token.plainTextToken
            );
            this.$router.push("/todo");
          }
        });
    },
  },
};
</script>
