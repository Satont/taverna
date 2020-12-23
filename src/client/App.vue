<template>

<v-app>
  <v-app-bar app dense dark :src="$store.state.meta.logo">
    <template v-slot:img="{ props }">
      <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)" />
    </template>
    <span class="hidden-sm-and-up">
      <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
    </span>
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">{{ $store.state.meta.display_name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-tabs right color="#fff" class="my-navbar" active-class="active-tab">
      <v-tab :to="{ name: 'Players' }">qwe</v-tab>
    </v-tabs> -->
    <v-toolbar-items class="hidden-xs-only">
      <v-btn text v-for="item in menu" :key="item.title" :to="item.path">{{ item.title }}</v-btn>
    </v-toolbar-items>
  </v-app-bar>

  <v-navigation-drawer v-model="sidebar" app>
    <v-list>
      <v-list-item v-for="item in menu" :key="item.title" :to="item.path">
        <v-list-item-content>{{ item.title }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main id="appMain">
    <v-container>
      <router-view />
    </v-container>
  </v-main>
</v-app>
</template>

<style>
  .my-navbar .v-tabs-slider {
    background-color: #00ccff;
  }
</style>

<script lang="ts">
import  { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  sidebar = false
  menu = [
    { path: '/', title: 'Главная' }
  ]
}
</script>
