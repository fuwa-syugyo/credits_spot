<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink, onBeforeRouteUpdate } from "vue-router";
  import router from "../../router";
  import { ArtistCredit, SearchRecordingData } from "../../types/recording/RecordingSearch"

  onBeforeRouteUpdate((to, from, next) => {
    recording_term.value = to.query.term as string || '';
    currentPage.value = 1
    onClickHandler(currentPage.value, recording_term.value).then(() => {
      next();
    });
  });

  const route = useRoute();
  const recording_term = ref(route.query.term as string || '');
  const recording_data = ref<SearchRecordingData[]>([]);

  const selectFilter = ref<Array<string>>([]);
  const artistName = ref();

  const onClickHandler = async (page: number, recording_term: string) => {
    if (!recording_term) {
      recording_term = route.query.term as string || ''
    }

    const offset = (page - 1) * 100
    try {
      const data = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=${offset}&limit=100&fmt=json`).then((res) => res.json());

      const new_recording_data: SearchRecordingData[] = data.recordings.filter((rec:SearchRecordingData) => rec).map((item: SearchRecordingData) => ({
      id: item.id,
      title: item.title,
      "artist-credit": item["artist-credit"].map(credit => ({
        id: credit.artist.id,
        name: credit.artist.name,
        join_phrase: credit.joinphrase,
        all_name: credit.artist.name + (credit.joinphrase ? ' ' + credit.joinphrase : '')
        })),
        first_release_date: item["first-release-date"]
      }))

      recording_data.value = new_recording_data;
      totalItems.value = data.count - 1;
    } catch {
      console.error('Error fetching data:', Error);
    }
  }

  const currentPage = ref(1);
  const totalItems = ref<number>(NaN);

  const applyFilter = () :void  => {
    const getRidOfInstrumentValue = selectFilter.value.includes("getRidOfInstrument")? 'true': 'false';
    const getPartialMatchValue = selectFilter.value.includes("getPartialMatch")? 'true': 'false';

    router.push({
    name: "RecordingSearchFilter",
    query: { term: recording_term.value,
            getRidOfInstrument: getRidOfInstrumentValue,
            getPartialMatch: getPartialMatchValue,
            artistName: artistName.value
            },
    });
  }

  onMounted(() => {
    onClickHandler(currentPage.value, recording_term.value);
  })
</script>

<template>
  <div class="container px-4 my-4 border border-gray-700 py-4 w-1/2">
    <form v-on:submit.prevent="applyFilter">
      <label><input type="checkbox" v-model="selectFilter" value="getRidOfInstrument">インスト音源を除外   </label>
      <label><input type="checkbox" v-model="selectFilter" value="getPartialMatch">部分一致の曲のみ</label>
      <br>
      <label>アーティスト名で絞り込み</label>
      <div class="relative">
        <input v-model="artistName" type="search" id="filter" class=" p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="アーティスト名を入力" />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
          <button type="submit" class="text-white absolute right-3.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-300 dark:hover:bg-green-400 dark:focus:ring-green-800">適用</button>
      </div>
    </form>
  </div>
  <table class="table-auto my-4">
    <thead>
      <tr>
        <th class="px-4 py-2 border max-w-[600px] bg-blue-100">曲名</th>
        <th class="px-4 py-2 border  bg-blue-100">アーティスト</th>
        <th class="px-4 py-2 border w-[130px] bg-blue-100">リリース日</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="recording in recording_data" :key="recording.id">
        <td class="border px-4 py-2 max-w-[600px]">
          <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.id}}">
            {{ recording.title }}
          </RouterLink>
        </td>
        <td class="border px-4 py-2">{{ recording["artist-credit"].map((credit: ArtistCredit) => credit.all_name).join(' ') }}</td>
        <td class="text-center border px-4 py-2 w-[130px]">{{ recording.first_release_date }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="totalItems > 100">
    <vue-awesome-paginate
      :total-items="totalItems"
      :items-per-page="100"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onClickHandler"
    />
  </div>
</template>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
  }

  .paginate-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 60px;
    border-radius: 10px;
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
    color: white;
  }

  .active-page:hover {
    background-color: #2988c8;
  }
</style>
