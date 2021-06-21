<template>
  <v-app id="inspire">
    <component :is="layout">
      <router-view :layout.sync="layout"></router-view>
    </component>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    //in case if no layout is define
    layout: "div",
   
  }),
};
</script>