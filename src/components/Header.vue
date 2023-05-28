<script setup lang="ts">
import SearchForm from './SearchForm.vue';
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="container  border-b-4 mb-2 md:w-[930px]">
    <div class="my-4 w-full md:w-[500px]">
      <router-link to="/">
        <div class="header__logo-box">
          <img src="../../public/logo.png" alt="Site Logo" class="header__logo" style="height: 100px;">
        </div>
      </router-link>
      <div class="my-4">
        <SearchForm />
      </div>
    </div>
  </div>
</template>
