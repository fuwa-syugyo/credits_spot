<script setup lang="ts">
  import { ref, onMounted } from "vue";

  type RecordingData = {
      id: string;
      title: string;
      artist: string;
      first_release_date: string;
    };

    const recording_data = ref<RecordingData[]>([]);

    const onClickHandler = async (page: number) => {
      console.log(page);
      const term = "yesterday"
      const offset = (page - 1) * 100 + 1
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${term}&offset=${offset}&limit=100&fmt=json`)
      const data = await res.json();

    const new_recording_data: RecordingData[] = data.recordings.filter((rec:RecordingData) => rec).map((item: RecordingData) => ({
      id: item.id,
      title: item.title,
      artist: item["artist-credit"][0].name,
      first_release_date: item["first-release-date"]
    }))

    recording_data.value = new_recording_data;
    totalItems.value = data.count;

    console.log(recording_data.value)
  }

    const currentPage = ref(1);
    const totalItems = ref(0);

    onMounted(async () => {
      await onClickHandler(currentPage.value)
    })
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>曲名</th>
        <th>アーティスト</th>
        <th>リリース日</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="recording in recording_data" :key="recording.id">
        <td>{{ recording.title }}</td>
        <td>{{ recording.artist }}</td>
        <td>{{ recording.first_release_date }}</td>
      </tr>
    </tbody>
  </table>
  <vue-awesome-paginate
    :total-items="totalItems"
    :items-per-page="100"
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
