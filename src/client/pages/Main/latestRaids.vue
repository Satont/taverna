<template>
<v-list style="overflow: auto; max-height: 160px !important;">
        <v-list-item
          v-for="raid of raids"
          v-bind:key="raid.id"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-row>
                <v-col class="no-grow"><v-img :src="getChannel(raid.from.id).logo || twitchDefaultAvatar" max-width="20px" class="rounded-circle" /></v-col>
                <v-col class="no-grow">{{ raid.from.username }}</v-col> 
              </v-row>
              <v-row>
                <v-col class="no-grow"><v-img :src="getChannel(raid.to.id).logo || twitchDefaultAvatar" max-width="20px" class="rounded-circle" /></v-col>
                <v-col class="no-grow">{{ raid.to.username }}</v-col> 
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <span v-if="raid.viewers">{{ raid.viewers || 0 }} <v-icon>{{ icons.mdiEye }}</v-icon></span>
            {{ dayjs().to(dayjs(raid.createdAt)) }}
          </v-list-item-action>
        </v-list-item>
      </v-list>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import day from 'dayjs'
import { mdiEye } from '@mdi/js'

@Component
export default class extends Vue {
  raids = []
  dayjs = day
  twitchDefaultAvatar = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1dd-9f00b46cbd3d-profile_image-70x70.png'
  icons = {
    mdiEye,
  }
  async created() {
    const request = await fetch('api/raids')
    this.raids = await request.json()
  }

  getChannel(id: string) {
    return this.$store.state.meta.users.find(u => u._id === id)
  }
}
</script>

<style scoped>
.no-grow {
  flex-grow: 0 !important;
}
</style>