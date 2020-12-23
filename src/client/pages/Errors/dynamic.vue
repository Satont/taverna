<template>
  <v-card elevation="2">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ subTitle }}</v-card-subtitle>
    <v-card-text>{{ text }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: String,
    subTitle: String,
    text: String,
  }
})
</script>
