<script setup lang="ts">
import SearchForm from './SearchForm.vue';
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="px-4 my-4 border-b-4">
    <router-link to="/">
      <h3>クレジットサーチプロトタイプ</h3>
    </router-link>
    <div class="px-4 my-4">
      <SearchForm />
    </div>
  </div>
</template>
