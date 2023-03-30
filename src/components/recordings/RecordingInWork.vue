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
  <table class="table-auto my-4">
    <thead>
      <tr>
        <th class="px-4 py-2 border max-w-[600px] bg-blue-100">曲名</th>
        <th class="px-4 py-2 border max-w-[600px] bg-blue-100">アーティスト</th>
        <th class="px-4 py-2 border bg-blue-100">属性</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="recording in recording_list" :key="recording.id">
        <td class="px-4 py-2 border max-w-[600px]">
          <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.id}}">
            {{ recording.title }}
          </RouterLink>
        </td>
        <td class="px-4 py-2 border">{{ recording["artist-credit"].map((credit: ArtistCredit) => credit.all_name).join(' ') }}</td>
        <td class="px-4 py-2 border text-center">{{ recording.attributes }}</td>
      </tr>
    </tbody>
  </table>
</template>
