<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { RouterLink } from "vue-router";
  import { RecordInWork } from "../../types/artist/ArtistDetail"
  import { ArtistCredit } from "../../types/recording/RecordingSearch"

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const work_id = props.id

  const recording_list = ref<RecordInWork[]>();

  onMounted(async () => {
    const res = await fetch(`https://musicbrainz.org/ws/2/work/${work_id}?inc=recording-rels+artist-credits&fmt=json`)
    const data = await res.json()

    const recording_in_work: RecordInWork[] = data?.relations.filter((x: Array<object>) => x).map((item: RecordInWork) => ({
      id: item.recording.id,
      title: item.recording.title,
      "artist-credit": item.recording["artist-credit"].map((credit: ArtistCredit) => ({
          id: credit.artist.id,
          name: credit.artist.name,
          join_phrase: credit.joinphrase,
          all_name: credit.artist.name + (credit.joinphrase ? ' ' + credit.joinphrase : '')
        })),
      attributes: item.attributes[0],
    }))
    console.log(recording_in_work)
    recording_list.value = recording_in_work;
  })
</script>

<template>
  <table class="table-auto">
    <thead>
      <tr>
        <th>曲名</th>
        <th>アーティスト</th>
        <th>属性</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="recording in recording_list" :key="recording.id">
        <td>
          <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.id}}">
            {{ recording.title }}
          </RouterLink>
        </td>
        <td>{{ recording["artist-credit"].map((credit: ArtistCredit) => credit.all_name).join(' ') }}</td>
        <td>{{ recording.attributes }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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

  table {
  border-collapse: collapse;
  }

  td, th {
    padding: 10px;
    vertical-align: middle;
    border-bottom: 1px solid black;
  }
</style>
