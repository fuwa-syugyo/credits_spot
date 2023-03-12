<script setup lang="ts">
import { ref } from 'vue';

const term = ref('検索');
const searchType = ref('曲名')
</script>

<template>
  <div id="app">
    <input type="radio" v-model="searchType" value="曲名">曲名
    <input type="radio" v-model="searchType" value="人物名">人物名
    <input v-model="term" />
    
  </div>
</template>
