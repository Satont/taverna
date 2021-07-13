<template>
  <v-list>
    <v-list-item v-for="item of items" v-bind:key="item.text">
      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>{{ item.value }}</v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Stats extends Vue {
  items = [
    {
      text: 'Участников сообщества',
      value: this.$store.state.meta.users.length,
    },
    {
      text: 'Сообщений',
      value: this.$store.state.meta.stats.messages,
    },
    {
      text: 'Рейдов',
      value: this.$store.state.meta.stats.raids,
    },
  ];
}
</script>
