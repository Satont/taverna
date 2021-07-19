<template>
  <div>
    <v-card class="mx-auto" tile v-if="loaded">
      <v-img height="250px" :src="user.user.offline_image_url">
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12">
            <v-avatar class="profile" color="grey" size="164" tile>
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
        <v-row dense>
          <v-col>
            <v-card class="col-10" elevation="10">
              <v-card-title>
                Топ 10 общительных
                <v-spacer />
                <v-icon>{{ icons.mdiEmail }}</v-icon> {{ user.channel.messages.total }}
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
          </v-col>
          <v-col>
            <v-card class="col-10" elevation="10">
              <v-card-title> Статистика </v-card-title>
              <v-card-text>
                <v-list max-height="450px" style="overflow: auto">
                  <v-list-item>
                    <v-list-item-content>Входящих рейдов</v-list-item-content>
                    <v-list-item-action>{{ user.channel.raids.total.incoming }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>Исходящих рейдов</v-list-item-content>
                    <v-list-item-action>{{ user.channel.raids.total.outcoming }}</v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-card class="col-10" elevation="10">
              <v-card-title> Последние рейдеры </v-card-title>
              <v-card-text>
                <v-list max-height="450px" style="over/auth/twitchflow: auto">
                  <v-list-item
                    v-for="raid of user.channel.raids.latestTo"
                    link
                    :to="{
                      name: 'UserProfile',
                      params: { id: raid.from.id },
                    }"
                    v-bind:key="raid.id"
                  >
                    <v-list-item-avatar>
                      <v-img :src="raid.channel.profile_image_url || twitchDefaultAvatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ raid.channel.login || raid.from.username }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <span v-if="raid.viewers"
                        >{{ raid.viewers }} <v-icon>{{ icons.mdiEye }} </v-icon></span
                      >
                      {{ dayjs().to(dayjs(raid.createdAt)) }}
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="col-10" elevation="10">
              <v-card-title> Последние рейды </v-card-title>
              <v-card-text>
                <v-list max-height="450px" style="overflow: auto">
                  <v-list-item
                    v-for="raid of user.channel.raids.latestFrom"
                    link
                    :to="{
                      name: 'UserProfile',
                      params: { id: raid.to.id },
                    }"
                    v-bind:key="raid.id"
                  >
                    <v-list-item-avatar>
                      <v-img :src="raid.channel.profile_image_url || twitchDefaultAvatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ raid.channel.login || raid.to.username }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <span v-if="raid.viewers"
                        >{{ raid.viewers }} <v-icon>{{ icons.mdiEye }} </v-icon></span
                      >
                      {{ dayjs().to(dayjs(raid.createdAt)) }}
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div class="text-center" v-else>
      <v-progress-circular size="100" align="center" indeterminate color="primary" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import day from 'dayjs';
import { mdiEye, mdiEmail } from '@mdi/js';

@Component
export default class Profile extends Vue {
  user = {
    user: {} as any,
    channel: {} as any,
  };
  loaded = false;
  dayjs = day;
  icons = {
    mdiEye,
    mdiEmail,
  };
  twitchDefaultAvatar =
    'https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1dd-9f00b46cbd3d-profile_image-70x70.png';

  mounted() {
    this.load();
  }

  async load() {
    this.user = (await axios.get(`/api/team/users/${this.$route.params.id}`)).data;
    this.loaded = true;
  }

  @Watch('$route')
  onUrlChange() {
    this.load();
  }
}
</script>
