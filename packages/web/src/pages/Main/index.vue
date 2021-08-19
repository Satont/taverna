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
    <v-row>
      <Users />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Stats from './stats.vue';
import Users from './users.vue';

@Component({
  components: {
    Stats,
    Users,
  },
})
export default class Index extends Vue {
  info = this.$store.state.meta.info;
}
</script>
