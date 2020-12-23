<template>
  <v-menu
    v-model="profile"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar size="36px" class="mt-1" dark v-bind="attrs" v-on="on">
        <img :src="$store.state.user.profile_image_url" />
      </v-avatar>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="$store.state.user.profile_image_url" :alt="$store.state.user.display_name">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $store.state.user.display_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ $store.state.user.login }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="red darken-1" href="/auth/logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  profile = false
}
</script>
