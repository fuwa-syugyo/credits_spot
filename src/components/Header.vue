<script setup lang="ts">
import SearchForm from './SearchForm.vue';
import { RouterLink } from "vue-router";
</script>

<template>
  <router-link to="/">
    <h3>クレジットサーチプロトタイプ</h3>
  </router-link>
  <SearchForm />
</template>
