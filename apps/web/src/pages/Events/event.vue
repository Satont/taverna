<template>
  <div>
    <h1>{{ event.name }}</h1>
    <h3>{{ event.description }}</h3>
    qweqwe {{ id }} {{ event }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '../../libs/api';
import { Event } from '@taverna/typeorm';

@Component
export default class EventInfo extends Vue {
  id: number = 0;
  event: Partial<Event> = {};

  async mounted() {
    this.id = Number(this.$route?.params.id);

    const { data } = await api.get<Event>(`events/${this.id}`);
    this.event = data;
  }
}
</script>
