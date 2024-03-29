<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import NotFound from '../NotFound.vue'
import NowLoading from '../NowLoading.vue'
import FetchError from '../FetchError.vue'
import {
  ArtistData,
  RecordingCredit,
  SongWriterCredit,
  ArtistRecording,
} from '../../types/artist/ArtistDetail'
import { ArtistCredit } from '../../types/recording/RecordingSearch'

interface Props {
  id: string
}
const props = defineProps<Props>()
const refArtistData = ref<ArtistData>()
const refArtistRecording = ref<ArtistRecording[]>()
const isLoading = ref(false)
const fetchError = ref(false)

const currentPage = ref(1)
const totalItems = ref<number>(NaN)

onMounted(async () => {
  try {
    isLoading.value = true
    const relationshipsData = await fetch(
      `https://musicbrainz.org/ws/2/artist/${props.id}?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json`
    ).then((res) => res.json())

    const recordingCredit: RecordingCredit[] = relationshipsData.relations
      .filter((rec: RecordingCredit) => rec['target-type'] === 'recording')
      .map((item: RecordingCredit) => ({
        type: item.type === 'instrument' ? item.attributes[0] : item.type,
        recording: {
          id: item.recording.id,
          title: item.recording.title,
        },
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
      }))

    const songWriterCredit: SongWriterCredit[] = relationshipsData.relations
      .filter((rec: SongWriterCredit) => rec['target-type'] === 'work')
      .map((item: SongWriterCredit) => ({
        type: item.type,
        work: {
          id: item.work.id,
          title: item.work.title,
        },
      }))

    const artistData: ArtistData = {
      id: relationshipsData.id,
      name: relationshipsData.name,
      credit: {
        song: songWriterCredit,
        recording: recordingCredit,
      },
    }
    refArtistData.value = artistData
    onClickHandler(1)
  } catch {
    console.error('Error fetching data:', Error)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
})

const onClickHandler = async (page: number) => {
  const offset = (page - 1) * 100
  try {
    const recordingData = await fetch(
      `https://musicbrainz.org/ws/2/recording?artist=${props.id}&offset=${offset}&limit=100&fmt=json`
    ).then((res) => res.json())

    const artistRecording: ArtistRecording[] = recordingData.recordings.map(
      (item: ArtistRecording) => ({
        id: item.id,
        title: item.title,
      })
    )

    refArtistRecording.value = artistRecording
    totalItems.value = recordingData['recording-count']
  } catch {
    console.error('Error fetching data:', Error)
    fetchError.value = true
  }
}
</script>

<template>
  <div v-if="isLoading">
    <NowLoading />
  </div>
  <div v-else-if="fetchError">
    <FetchError />
  </div>
  <div v-else-if="refArtistData || refArtistRecording">
    <h1 class="artist-name text-2xl my-4 max-w-xl break-all">
      {{ refArtistData?.name }}
    </h1>

    <div v-if="refArtistData?.credit.song.length !== 0">
      <p
        class="songwriter-caption text-xl my-4 border-l-8 border-indigo-200 pl-2"
      >
        作詞作曲した音源
      </p>
      <table class="songwriter-table table-auto my-4">
        <thead>
          <tr>
            <th
              class="px-4 py-2 border solid bg-blue-100 w-[250px] md:w-[300px]"
            >
              担当
            </th>
            <th
              class="px-4 py-2 border solid bg-blue-100 w-[550px] md:w-[630px]"
            >
              曲名
            </th>
          </tr>
        </thead>
        <tbody v-if="refArtistData?.credit.song">
          <tr
            v-for="songwriter in refArtistData.credit.song"
            :key="songwriter.work.id"
          >
            <td class="text-center px-4 py-2 border solid">
              {{ songwriter.type }}
            </td>
            <td class="px-4 py-2 border solid break-all">
              <RouterLink
                :to="{
                  name: 'RecordingInWork',
                  params: { id: songwriter.work.id },
                }"
              >
                {{ songwriter.work.title }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />

    <div v-if="refArtistData?.credit.recording.length !== 0">
      <p class="staff-caption text-xl my-4 border-l-8 border-indigo-200 pl-2">
        スタッフとして関わった音源
      </p>
      <table class="staff-table table-auto my-4">
        <thead>
          <tr>
            <th
              class="px-4 py-2 border solid bg-blue-100 w-[70px] md:w-[100px]"
            >
              担当
            </th>
            <th
              class="px-4 py-2 border solid bg-blue-100 w-[200px] md:w-[400px]"
            >
              曲名
            </th>
            <th
              class="px-4 py-2 border solid bg-blue-100 w-[200px] md:w-[400px]"
            >
              アーティスト
            </th>
          </tr>
        </thead>
        <tbody v-if="refArtistData?.credit.recording">
          <tr
            v-for="recording in refArtistData.credit.recording"
            :key="recording.recording.id"
          >
            <td class="text-center px-4 py-2 border solid">
              {{ recording.type }}
            </td>
            <td class="px-4 py-2 border solid break-all">
              <RouterLink
                :to="{
                  name: 'RecordingDetail',
                  params: { id: recording.recording.id },
                }"
              >
                {{ recording.recording.title }}
              </RouterLink>
            </td>
            <td class="text-center px-4 py-2 border solid">
              {{
              recording['artist-credit']
                .map((credit: ArtistCredit) => credit.allName)
                .join(' ')
            }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br />
    <div v-if="refArtistRecording?.length !== 0">
      <p class="artist-caption text-xl my-4 border-l-8 border-indigo-200 pl-2">
        アーティストとして関わった音源
      </p>
      <p class="artist-recording-number">
        {{
          totalItems +
          ' 件中 ' +
          ((currentPage - 1) * 100 + 1) +
          ' 〜 ' +
          ((currentPage - 1) * 100 + (refArtistRecording?.length ?? 0)) +
          '件'
        }}
      </p>
      <table class="artist-table table-auto my-4">
        <thead>
          <tr>
            <th class="px-4 py-2 border solid bg-blue-100 w-[400px]">曲名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recording in refArtistRecording" :key="recording.id">
            <td class="px-4 py-2 border solid break-all">
              <RouterLink
                :to="{
                  name: 'RecordingDetail',
                  params: { id: recording.id },
                }"
              >
                {{ recording.title }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalItems > 100" class="pagination">
      <vue-awesome-paginate
        v-model="currentPage"
        :total-items="totalItems"
        :items-per-page="100"
        :max-pages-shown="3"
        :on-click="onClickHandler"
      />
    </div>
  </div>
  <div v-else>
    <NotFound />
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

/* スマートフォン用のスタイル */
@media (max-width: 768px) {
  .pagination-container {
    display: flex;
    column-gap: 5px;
  }

  .paginate-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 35px;
    border-radius: 5px;
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
}
</style>
