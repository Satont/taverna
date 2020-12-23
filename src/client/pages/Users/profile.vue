<template>
  <div>
    <v-card class="mx-auto" tile v-if="loaded">
      <v-img height="250px" :src="user.user.offline_image_url">
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12" >
            <v-avatar class="profile" color="grey" size="164" tile >
              <v-img :src="user.user.profile_image_url"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ user.user.display_name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.user.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
      <v-card-text>
        <v-card class="col-md-3 col-12" elevation="10">
          <v-card-title>
            Топ 10 общительных
            <v-spacer />
            {{ user.channel.messages.total }}
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="user of user.channel.messages.top10" v-bind:key="user.id">
                <v-list-item-avatar>
                  <v-img :src="user.profile_image_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ user.login }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>{{ user.messages }}</v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <div class="text-center" v-else>
      <v-progress-circular size="100" align="center" indeterminate color="primary" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class extends Vue {
  user = {
    user: {},
    channel: {},
  }
  loaded = false

  async mounted() {
    this.user = (await axios.get(`/api/team/users/${this.$route.params.id}`)).data
    this.loaded = true
  }
}
</script>
