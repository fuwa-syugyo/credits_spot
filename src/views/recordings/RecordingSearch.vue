<script setup lang="ts">
  import { ref, onMounted } from "vue";

    const onClickHandler = async (page: number) => {
      console.log(page);
      const term = "ありがとう"
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${term}&offset=&${page}&fmt=json`)
      const data = await res.json();
      console.log(data);
    };

    const currentPage = ref(1);

    onMounted(() => {
      onClickHandler(currentPage.value)
    })
</script>

<template>
  <vue-awesome-paginate
    :total-items="50"
    :items-per-page="5"
    :max-pages-shown="5"
    v-model="currentPage"
    :on-click="onClickHandler"
  />
</template>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>
