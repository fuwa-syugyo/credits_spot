<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const term = ref('');
const searchType = ref('曲名')

const search = (): void => {
  const type = searchType.value === '曲名' ? 'Recording' : 'Artist';
  router.push({ name: type + 'Search', query: { term: term.value} });
  }
</script>

<template>
  <div id="app">
    <form v-on:submit.prevent="search">
      <input type="radio" v-model="searchType" value="曲名">曲名
      <input type="radio" v-model="searchType" value="人物名">人物名
      <input v-model="term" />
      <button type="submit">検索</button>
    </form>
  </div>
</template>
