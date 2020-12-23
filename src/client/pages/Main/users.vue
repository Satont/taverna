<template>
  <div>
    <v-row v-if="usersLoaded">
      <v-col cols="3" v-for="channel of users" v-bind:key="channel._id">
        <v-card max-width="374">
          <v-img height="250" :src="channel.profile_image_url"></v-img>
          <v-card-title>
            {{ channel.display_name }}
            <v-icon v-if="channel.broadcaster_type === 'partner'" style="color: #a970ff" class="pl-2">
              {{ icons.verifyed }}
            </v-icon>
            <v-spacer></v-spacer>
            <v-tooltip open-on-hover top>
              <template v-slot:activator="{ on, attrs }">
                <v-badge content="В ЭФИРЕ" v-if="channel.stream" color="red darken-1" v-bind="attrs" v-on="on" inline />
              </template>
              <span>Top tooltip</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            {{ channel.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-purple lighten-2" text target="_blank" :href="`https://twitch.tv/${channel.login}`">
              Посетить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-progress-circular size="100" indeterminate color="primary" />
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mdiCheckDecagram } from '@mdi/js'
import axios from 'axios'

@Component
export default class extends Vue {
  usersLoaded = false
  users = []
  icons = {
    verifyed: mdiCheckDecagram,
  }

  async mounted() {
    const { data: users } = await axios.get('/api/team/users')
    this.users = users
    this.usersLoaded = true
  }
}
</script>
