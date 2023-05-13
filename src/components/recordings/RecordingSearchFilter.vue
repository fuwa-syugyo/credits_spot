<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink } from "vue-router";
  import { ArtistCredit, SearchRecordingData } from "../../types/recording/RecordingSearch"
  import NowLoading from "../NowLoading.vue"

  const route = useRoute();
  let recording_term = route.query.term as string || '';
  const getRidOfInstrumentValue = route.query.getRidOfInstrument;
  const getPartialMatchValue = route.query.getPartialMatch;
  const artistName = route.query.artistName as string || '';
  const totalItems = ref<number>(0);
  let filteredDataLength: number = 0;
  let filteredData: SearchRecordingData[] = [];
  const isLoading = ref(false);

  const recording_data = ref<SearchRecordingData[]>([]);
  const all_recording_data = ref<Array<SearchRecordingData[]>>([]);

  onMounted(async() => { 
    try {
      isLoading.value = true;
      const first_res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=recording:${recording_term}&offset=0&limit=100&fmt=json`)
      const first_data = await first_res.json();

      totalItems.value = first_data.count - 1;
      const repeat = totalItems.value < 500 ? totalItems.value / 100  : 4;

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
    recording_data.value = all_recording_data.value.flat();

    if(getRidOfInstrumentValue == "true"){
      getRidOfInstrument()
    }

    if(getPartialMatchValue == "true"){
      getPartialMatch()
    }

    if(artistName !== ""){
      artistFilter()
    }
    filteredData = recording_data.value;
    filteredDataLength = filteredData.length;
    } catch {
      console.error('Error fetching data:', Error);
    } finally {
      isLoading.value = false;
    }
  });

  const onClickHandler = (page: number) => {
    let startIndex = (page - 1) * 100;
    let endIndex = startIndex + 99;
    const dataPerPage = filteredData.slice(startIndex , endIndex)
    recording_data.value = dataPerPage;
  }

  const artistFilter = () => {
    const includeArtistData = recording_data.value
    .filter((data) => data["artist-credit"][0].all_name.includes(artistName));
    recording_data.value = includeArtistData
  }

  const getRidOfInstrument = () => {
  const cutData = recording_data.value
    .filter((data) => !data.title.toLocaleLowerCase().includes("instrumental") && !data.title.toLocaleLowerCase().includes("(off vocal)") && !data.title.includes("(カラオケ)") && !data.title.includes("(オリジナル・カラオケ)")  &&  !data.title.toLocaleLowerCase().includes("(karaoke)") && !data.title.toLocaleLowerCase().includes("music video")  && !data.title.toLocaleLowerCase().includes("tv size"));
    recording_data.value = cutData
  }

  const getPartialMatch = () => {
  const partialMatchData = recording_data.value
    .filter((data) => data.title.toLocaleLowerCase().includes(recording_term.toLocaleLowerCase()));
    recording_data.value = partialMatchData
  }

  const currentPage = ref(1);
</script>

<template>
  <div v-if="isLoading">
    <NowLoading></NowLoading>
  </div>
  <div v-else-if="filteredDataLength !== 0">
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
    <div v-if="filteredDataLength > 100">
      <vue-awesome-paginate
        :total-items="filteredDataLength"
        :items-per-page="100"
        :max-pages-shown="5"
        v-model="currentPage"
        :on-click="onClickHandler"
      />
    </div>
  </div>
  <div v-else>
    <p>条件に該当する楽曲はありませんでした。</p>
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
