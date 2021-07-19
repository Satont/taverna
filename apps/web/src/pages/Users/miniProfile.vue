<template>
  <v-menu v-model="profile" :close-on-content-click="false" :nudge-width="200" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-avatar size="36px" class="mt-1" dark v-bind="attrs" v-on="on">
        <img :src="$store.state.user.profile_image_url" />
      </v-avatar>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="$store.state.user.profile_image_url" :alt="$store.state.user.display_name" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $store.state.user.display_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ $store.state.user.login }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense v-if="isInCommunity()">
        <v-list-item-group v-model="selectedMenuItem" color="primary">
          <v-list-item v-for="(item, i) in menu" :key="i" :to="{ name: item.name }">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="red darken-1" href="/api/auth/logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { mdiCalendarMultiple } from '@mdi/js';
import { Permissions } from '../../libs/permissions';

@Component
export default class MiniProfile extends Mixins(Permissions) {
  profile = false;
  selectedMenuItem = 0;

  menu = [{ text: 'Events', icon: mdiCalendarMultiple, name: 'EventsList' }];

  get() {}
}
</script>
