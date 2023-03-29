<script setup lang="ts">
import { RouterView } from "vue-router"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
</script>

<template>
  <div class="container mx-auto px-10 my-4">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
