<template>
  <v-container>
    <v-row v-masonry origin-left="true" horizontal-order="true" transition-duration="0.3s" item-selector=".item" v-if="usersLoaded">
      <v-col v-masonry-tile class="item" v-for="channel of users" v-bind:key="channel.id" xs="3" sm="6" md="4" lg="3">
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
            <v-btn color="deep-purple lighten-2" text @click="$router.push({ name: 'UserProfile', params: { id: channel.id } })"
              >Подробнее</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="deep-purple lighten-2" text target="_blank" :href="`https://twitch.tv/${channel.login}`">Посетить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center" v-else>
      <v-progress-circular size="100" align="center" indeterminate color="primary" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mdiCheckDecagram } from '@mdi/js';
import axios from 'axios';
import { VueMasonryPlugin } from 'vue-masonry';

@Component({
  components: {
    VueMasonryPlugin,
  },
})
export default class Users extends Vue {
  usersLoaded = false;
  users = [];
  icons = {
    verifyed: mdiCheckDecagram,
  };

  async mounted() {
    const { data: users } = await axios.get('/api/team/users');
    this.users = users;
    this.usersLoaded = true;
  }
}
</script>
