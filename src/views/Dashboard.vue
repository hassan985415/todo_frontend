<template>
  <div class="grey--text mb-2 text-center pa-10 display-1">Welcome to TODO</div>
</template>

<script>
import DashboardLayout from "../layouts/DashboardLayout.vue";
export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    let token = localStorage.getItem("token");
    if (token) {
      this.isLoggedIn = true;
    }
    this.$emit("update:layout", DashboardLayout);
  },
};
</script>


