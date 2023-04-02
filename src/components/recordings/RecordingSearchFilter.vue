<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink, onBeforeRouteUpdate } from "vue-router";
  import { ArtistCredit, SearchRecordingData } from "../../types/recording/RecordingSearch"

  const route = useRoute();
  const recording_term = route.query.term;
  const totalItems = ref(0);

  const recording_data = ref<SearchRecordingData[]>([]);
  const all_recording_data = ref<Array<SearchRecordingData[]>>([]);

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


  const onClickHandler = async (page: number) => {
  }

  const artistFilter = (): void => {
    //入力したアーティスト名が、flatted_recording_dataの「artist-credit」のnameに含まれているものの配列を返したい
  }

  const getRidOfInstrumentAndLive = () => {
  const cutData = recording_data.value
    .filter((data) => !data.title.includes("Instrumental") && !data.title.includes("instrumental") && !data.title.includes("(Off Vocal)") && !data.title.includes("Music video") && !data.title.includes("TV Size")&& data["secondary-types"]  !== "Live");
    recording_data.value = cutData
    console.log(recording_data.value)
  }


  const currentPage = ref(1);
  // const totalItems = ref(0);

</script>

<template>
  <div>
    <button v-on:click="getRidOfInstrumentAndLive">インストとライブ音源を除外</button>
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
