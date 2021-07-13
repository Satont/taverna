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
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text v-for="item in menu" :key="item.title" :to="item.path">{{ item.title }}</v-btn>
        <v-btn text v-if="!$store.state.user" href="/api/auth/twitch">Войти</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="$store.state.user">
        <MiniProfile />
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
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { Permissions } from './libs/permissions';
import MiniProfile from './pages/Users/miniProfile.vue';

@Component({
  components: {
    MiniProfile,
  },
  mixins: [Permissions],
})
export default class App extends Vue {
  sidebar = false;
  menu = [
    /* { path: '/', title: 'Главная' } */
  ];
}
</script>
