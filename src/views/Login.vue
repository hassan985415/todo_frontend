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
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Email"
                  name="email"
                  v-model="user.email"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>
                <!-- <div v-if="errors.email">
                  {{ errors.email }}
                </div> -->

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  v-model="user.password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Login</v-btn>
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
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      snackbar: false,
      snackbarText: "",
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.$router.push("/todo");
    }
    this.$emit("update:layout", LoginSingupLayout);
  },
  methods: {
    login() {
      axios
        .post("/login", this.user)
        .then((response) => {
          // console.warn(response.data.access_token.plainTextToken);

          if (response.status == 200) {
            this.snackbar = true;
            this.snackbarText = "Logged In Successfully!";
            localStorage.setItem(
              "token",
              response.data.access_token.plainTextToken
            );
            this.$router.push("/todo");
          }
        })
        .catch((res) => {
          console.warn(res);
        });
    },
  },
};
</script>
