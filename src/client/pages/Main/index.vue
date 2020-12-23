<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Немного статистики</v-card-title>
          <v-card-text>
            <Stats />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card>
          <v-card-title>О сообществе</v-card-title>
          <v-card-text v-html="$store.state.meta.info" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="usersLoaded">
      <v-col cols="3" v-for="channel of users" v-bind:key="channel._id">
        <v-card max-width="374">
          <v-img height="250" :src="channel.profile_image_url"></v-img>
          <v-card-title>
            {{ channel.display_name }}
            <v-icon
              v-if="channel.broadcaster_type === 'partner'"
              style="color: #a970ff"
              class="pl-2"
            >
              {{ icons.verifyed }}
            </v-icon>
            <v-spacer></v-spacer>
            <v-tooltip open-on-hover top>
              <template v-slot:activator="{ on, attrs }">
                <v-badge
                  content="В ЭФИРЕ"
                  v-if="channel.stream"
                  color="red darken-1"
                  v-bind="attrs"
                  v-on="on"
                  inline
                />
              </template>
              <span>Top tooltip</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            {{ channel.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="deep-purple lighten-2"
              text
              target="_blank"
              :href="`https://twitch.tv/${channel.login}`"
              >Посетить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-progress-circular
      size="100"
      v-else
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mdiCheckDecagram } from "@mdi/js";
import axios from "axios";
import Stats from './stats.vue'

@Component({
  components: {
    Stats,
  }
})
export default class extends Vue {
  icons = {
    verifyed: mdiCheckDecagram,
  };
  usersLoaded = false;
  users = [];

  async mounted() {
    const { data: users } = await axios.get("/api/team/users");
    this.users = users;
    this.usersLoaded = true;
  }
}
</script>
