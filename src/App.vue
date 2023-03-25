<script setup lang="ts">
import { RouterView } from "vue-router"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

</script>

<template>
  <Header />
  <main>
    <RouterView/>
  </main>
  <Footer />
</template>
