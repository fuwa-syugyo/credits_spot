<script setup lang="ts">
import SearchForm from './SearchForm.vue';
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="container  border-b-4">
    <div class="px-4 my-4 w-[500px]">
    <router-link to="/">
      <div class="header__logo-box">
        <img src="../../public/logo.png" alt="Logo" class="header__logo" style="height: 100px;">
      </div>
    </router-link>
    <div class="px-4 my-4">
      <SearchForm />
    </div>
  </div>
  </div>
</template>
