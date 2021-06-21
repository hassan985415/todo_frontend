<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Todo App </v-list-item-title>
          <v-list-item-subtitle> line your work :) </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app absolute color="primary" dark>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Todo Application</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn color="grey" v-if="isLoggedIn == true" @click="logout">
        Logout
      </v-btn>
      <div v-if="isLoggedIn == false">
        <v-btn color="grey" to="/login"> Login </v-btn>
        <v-btn color="ml-2 success" to="/register"> Register </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
Vue.use(axios);

export default {
  created() {
    let token = localStorage.getItem("token");
    if (token) {
      this.isLoggedIn = true;
    }
  },
  methods: {
    logout() {
      axios
        .get("http://127.0.0.1:8000/api/logout", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.status == 200) {
            this.snackbar = true;
            this.snackbarText = "Logged Out Successfully!";
            localStorage.removeItem("token");
            this.$router.push("/login");
          }
        })
        .catch((res) => {
          console.warn(res);
        });
    },
  },
  data: () => ({
    isLoggedIn: false,
    drawer: null,
    items: [
      { title: "Dashboard", icon: "mdi-menu", to: "/" },
      { title: "Todo", icon: "mdi-format-list-checks", to: "/todo" },
    ],
    right: null,
  }),
};
</script>