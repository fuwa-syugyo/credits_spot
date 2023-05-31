<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NotFound from '../NotFound.vue'
import NowLoading from '../NowLoading.vue'
import { RecordInWork } from '../../types/artist/ArtistDetail'
import { ArtistCredit } from '../../types/recording/RecordingSearch'

interface Props {
  id: string
}
const props = defineProps<Props>()
const workId = ref(props.id)
const recordingList = ref<RecordInWork[]>()
const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await fetch(
      `https://musicbrainz.org/ws/2/work/${workId.value}?inc=recording-rels+artist-credits&fmt=json`
    ).then((res) => res.json())

    const recordingInWork: RecordInWork[] = data?.relations
      .filter((x: Array<object>) => x)
      .map((item: RecordInWork) => ({
        id: item.recording.id,
        title: item.recording.title,
        'artist-credit': item.recording['artist-credit'].map(
          (credit: ArtistCredit) => ({
            id: credit.artist.id,
            name: credit.artist.name,
            joinphrase: credit.joinphrase,
            allName:
              credit.artist.name +
              (credit.joinphrase ? ' ' + credit.joinphrase : ''),
          })
        ),
        attributes: item.attributes[0],
      }))
    recordingList.value = recordingInWork
  } catch {
    console.error('Error fetching data:', Error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">
    <NowLoading />
  </div>
  <div v-else-if="recordingList">
    <h1 class="text-2xl my-4 max-w-xl">曲群一覧</h1>
    <table class="table-auto my-4">
      <thead>
        <tr>
          <th class="px-4 py-2 border w-[400px] bg-blue-100">曲名</th>
          <th class="px-4 py-2 border w-[400px] bg-blue-100">アーティスト</th>
          <th class="px-4 py-2 border bg-blue-100">属性</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recording in recordingList" :key="recording.id">
          <td class="px-4 py-2 border max-w-[600px]">
            <RouterLink
              :to="{
                name: 'RecordingDetail',
                params: { id: recording.id },
              }"
            >
              {{ recording.title }}
            </RouterLink>
          </td>
          <td class="px-4 py-2 border">
            {{
              recording['artist-credit']
                .map((credit: ArtistCredit) => credit.allName)
                .join(' ')
            }}
          </td>
          <td class="px-4 py-2 border text-center">
            {{ recording.attributes }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>
