<script setup lang="ts">
  import { ref, onMounted, reactive } from "vue";
  import { useRoute, RouterLink, onBeforeRouteUpdate } from "vue-router";
  import { ArtistCredit, SearchRecordingData } from "../../types/recording/RecordingSearch"

  const route = useRoute();
  const recording_term = route.query.term;
  const getRidOfInstrumentAndLiveValue = route.query.getRidOfInstrumentAndLive;
  const getExactMatchValue = route.query.getExactMatchValue;
  const totalItems = ref(0);

  const recording_data = ref<SearchRecordingData[]>([]);
  const all_recording_data = ref<Array<SearchRecordingData[]>>([]);

  const selectFilter = reactive<string[]>([]);
  const artistName = ref();

  onMounted(async() => {
    const first_res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=0&limit=100&fmt=json`)
    const first_data = await first_res.json();

    totalItems.value = first_data.count - 1;
    const repeat = totalItems.value < 1000 ? totalItems.value / 100  : 9;

    for(let i = 0; i < repeat + 1; i++) {
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=${ i * 100 }&limit=100&fmt=json`)
      const data = await res.json();

      const new_recording_data: SearchRecordingData[] = data.recordings.filter((rec:SearchRecordingData) => rec).map((item: SearchRecordingData) => ({
        id: item.id,
        title: item.title,
        "artist-credit": item["artist-credit"].map(credit => ({
          id: credit.artist.id,
          name: credit.artist.name,
          join_phrase: credit.joinphrase,
          all_name: credit.artist.name + (credit.joinphrase ? ' ' + credit.joinphrase : '')
        })),
        first_release_date: item["first-release-date"],
        "secondary-types": item.releases?.[0]["release-group"]["secondary-types"]?.[0]
      }))

    all_recording_data.value.push(new_recording_data);
    }
    const flatted_recording_data = all_recording_data.value.flat();
    console.log(flatted_recording_data)
    recording_data.value = flatted_recording_data
  });


  const onClickHandler = (page: number) => {
    const initialData = [...recording_data.value];
    let startIndex = (page - 1) * 100;
    let endIndex = startIndex + 99;
    const dataPerPage = initialData.slice(startIndex , endIndex)
    const newData = [...dataPerPage];
    recording_data.value = newData;
  }

  const artistFilter = (): void => {
    //入力したアーティスト名が、flatted_recording_dataの「artist-credit」のnameに含まれているものの配列を返したい
  }

  const getRidOfInstrumentAndLive = () => {
  const cutData = recording_data.value
    .filter((data) => !data.title.includes("Instrumental") && !data.title.includes("instrumental") && !data.title.includes("(Off Vocal)") && !data.title.includes("(off vocal)") && !data.title.includes("Music video") && !data.title.includes("TV Size")&& data["secondary-types"]  !== "Live");
    recording_data.value = cutData
    totalItems.value = cutData.length
  }

  const getExactMatch = () => {
  const ExactMatchData = recording_data.value
    .filter((data) => data.title == recording_term);
    recording_data.value = ExactMatchData
    totalItems.value = ExactMatchData.length
  }

  const applyFilter = () :void  => {
    if(selectFilter.includes("getRidOfInstrumentAndLive")){
      getRidOfInstrumentAndLive
      console.log('inst')
    }
    if(selectFilter.includes("getExactMatch")){
      getExactMatch
      console.log('exact')
    }
  }


  const currentPage = ref(1);

</script>

<template>
    <div class="container px-4 my-4 border border-gray-700 py-4">
      <form v-on:submit.prevent="applyFilter">
        <label><input type="checkbox" v-model="selectFilter" value="getRidOfInstrumentAndLive">インストとライブ音源を除外  </label>
        <label><input type="checkbox" v-model="selectFilter" value="getExactMatch">完全一致の曲のみ</label>
        <br>
        <label>アーティスト名で絞り込み</label>
        <div class="relative">
          <input v-model="artistName" type="search" id="search" class=" p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="アーティスト名を入力" />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
            <button type="submit" class="text-white absolute right-3.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-300 dark:hover:bg-green-400 dark:focus:ring-green-800">適用</button>
          </div>
      </form>
    </div>

  <!-- <div>
    <button v-on:click="getRidOfInstrumentAndLive">インストとライブ音源を除外</button>
  </div>
  <div>
    <button v-on:click="getExactMatch">完全一致の曲のみ</button>
  </div> -->
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
