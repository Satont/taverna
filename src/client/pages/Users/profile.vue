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
          <v-card-title>
            Последние рейдеры
          </v-card-title>
          <v-card-text>
            <v-list max-height="450px" style="overflow: auto">
              <v-list-item 
                v-for="raid of user.channel.raids.latestTo" 
                link 
                @click="$router.push({
                  name: 'UserProfile', 
                  params: { id: raid.userId } }, 
                  () => reload = true
                );" 
                v-bind:key="raid.createdAt"
              >
                <v-list-item-avatar>
                  <v-img :src="raid.profile_image_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ raid.login }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <span v-if="raid.viewers">{{ raid.viewers }} <v-icon>{{ icons.mdiEye }} </v-icon></span>
                  {{ dayjs().to(dayjs(raid.date)) }}
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        </v-col>
        <v-col>
        <v-card class="col-10" elevation="10">
          <v-card-title>
            Статистика
          </v-card-title>
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
      </v-card-text>
    </v-card>
    <div class="text-center" v-else>
      <v-progress-circular size="100" align="center" indeterminate color="primary" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import axios from 'axios'
import day from 'dayjs'
import { mdiEye, mdiEmail } from '@mdi/js'

@Component
export default class extends Vue {
  user = {
    user: {},
    channel: {},
  }
  loaded = false
  dayjs = day
  icons = {
    mdiEye,
    mdiEmail,
  }

  mounted() {
    this.load()
  }

  async load() {
    this.user = (await axios.get(`/api/team/users/${this.$route.params.id}`)).data
    this.loaded = true
  }

  @Watch('$route')
  onUrlChange() {
    this.load()
  }
}
</script>
