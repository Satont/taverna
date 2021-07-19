<template>
  <v-card elevation="2">
    <v-card-title>{{ $route.params.title }}</v-card-title>
    <v-card-subtitle>{{ $route.params.subTitle }}</v-card-subtitle>
    <v-card-text>{{ $route.params.text }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Error extends Vue {
  /* @Prop()
  readonly title: string;
  @Prop()
  readonly subTitle: string;
  @Prop()
  readonly text: string; */
}
</script>
