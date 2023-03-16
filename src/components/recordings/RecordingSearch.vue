<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink } from "vue-router";
  import { SearchRecordingData } from "../../types/RecordingSearch"

  const route = useRoute();
  const recording_term = route.query.term;

    const recording_data = ref<SearchRecordingData[]>([]);
    const all_recording_data = ref<Array<SearchRecordingData[]>>([]);

    const onClickHandler = async (page: number) => {
      console.log(page);
      const offset = (page - 1) * 100
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=${offset}&limit=100&fmt=json`)
      const data = await res.json();

    const new_recording_data: SearchRecordingData[] = data.recordings.filter((rec:SearchRecordingData) => rec).map((item: SearchRecordingData) => ({
      id: item.id,
      title: item.title,
      artist: {
        id:item["artist-credit"][0].id,
        name: item["artist-credit"][0].name,
      },
      first_release_date: item["first-release-date"]
    }))

    recording_data.value = new_recording_data;
    totalItems.value = data.count - 1;
  }

    const currentPage = ref(1);
    const totalItems = ref(0);

    onMounted(async () => {
      await onClickHandler(currentPage.value);

      if(totalItems.value < 1000){
        for(let i = 1; i <= (totalItems.value / 100) + 1; i++) {
          const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=${(i-1) * 100 }&limit=100&fmt=json`)
          const data = await res.json();

          const new_recording_data: SearchRecordingData[] = data.recordings.filter((rec:SearchRecordingData) => rec).map((item: SearchRecordingData) => ({
            id: item.id,
            title: item.title,
            artist: {
              id:item["artist-credit"][0].id,
              name: item["artist-credit"][0].name,
            },
            first_release_date: item["first-release-date"]
        }))
        all_recording_data.value.push(new_recording_data);
        }
        const flatted_recording_data = all_recording_data.value.flat();
        console.log(flatted_recording_data);
      }
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
        <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.id}}">
        <td>{{ recording.title }}</td>
        </RouterLink>
        <td>{{ recording.artist.name }}</td>
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
