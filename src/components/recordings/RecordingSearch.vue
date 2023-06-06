<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink, onBeforeRouteUpdate } from 'vue-router'
import router from '../../router'
import {
  ArtistCredit,
  SearchRecordingData,
} from '../../types/recording/RecordingSearch'
import NowLoading from '../NowLoading.vue'
import NoResults from '../NoResults.vue'

onBeforeRouteUpdate((to, from, next) => {
  recordingTerm.value = (to.query.term as string) || ''
  currentPage.value = 1
  onClickHandler(currentPage.value, recordingTerm.value).then(() => {
    next()
  })
})

const route = useRoute()
const recordingTerm = ref((route.query.term as string) || '')
const refRecordingData = ref<SearchRecordingData[]>([])

const selectedFilter = ref<Array<string>>([])
const artistName = ref()
const isLoading = ref(false)

const onClickHandler = async (page: number, recordingTerm: string) => {
  if (!recordingTerm) {
    recordingTerm = (route.query.term as string) || ''
  }

  const offset = (page - 1) * 100
  try {
    isLoading.value = true
    const data = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=recording:${recordingTerm}&offset=${offset}&limit=100&fmt=json`
    ).then((res) => res.json())

    const searchRecordingData: SearchRecordingData[] = data.recordings
      .filter((rec: SearchRecordingData) => rec)
      .map((item: SearchRecordingData) => ({
        id: item.id,
        title: item.title,
        'artist-credit': item['artist-credit'].map((credit) => ({
          id: credit.artist.id,
          name: credit.artist.name,
          joinPhrase: credit.joinphrase,
          allName:
            credit.artist.name +
            (credit.joinphrase ? ' ' + credit.joinphrase : ''),
        })),
        firstReleaseDate: item['first-release-date'],
      }))

    refRecordingData.value = searchRecordingData
    totalItems.value = data.count
  } catch {
    console.error('Error fetching data:', Error)
  } finally {
    isLoading.value = false
  }
}

const currentPage = ref(1)
const totalItems = ref<number>(NaN)

const applyFilter = (): void => {
  const excludeInstValue = selectedFilter.value.includes('excludeInst')
    ? 'true'
    : 'false'
  const partialMatchValue = selectedFilter.value.includes('partialMatch')
    ? 'true'
    : 'false'

  router.push({
    name: 'RecordingSearchFilter',
    query: {
      term: recordingTerm.value,
      excludeInst: excludeInstValue,
      partialMatch: partialMatchValue,
      artistName: artistName.value,
    },
  })
}

onMounted(() => {
  onClickHandler(currentPage.value, recordingTerm.value)
})
</script>

<template>
  <div v-if="isLoading">
    <NowLoading />
  </div>
  <div v-else-if="refRecordingData.length !== 0" class="container">
    <h1 class="text-2xl my-4 max-w-xl">楽曲検索結果</h1>
    <div
      class="px-4 my-4 border py-4 md:w-[350px] w-[250px] rounded-md"
    >
      <form @submit.prevent="applyFilter">
        <p class="text-xl mb-2">絞り込み</p>
        <div class="bg-slate-100 flex-col mb-2">
          <label for="inst" class="mr-[10px] flex"
            ><input
              id="inst"
              v-model="selectedFilter"
              type="checkbox"
              value="excludeInst"
            />
            <span class="mx-1">インスト音源以外</span>
          </label>
          <label for="partial" class="flex"
            ><input
              id="partial"
              v-model="selectedFilter"
              type="checkbox"
              value="partialMatch"
            />
            <span class="mx-1">部分一致の曲</span>
          </label>
        </div>
        <label>アーティスト名</label>
        <div class="relative">
          <input
            id="filter"
            v-model="artistName"
            type="search"
            class="p-2 pl-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 my-1"
            placeholder="アーティスト名を入力"
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          />
          <button
            type="submit"
            :disabled="!selectedFilter[0] && !artistName"
            class="text-white right-3.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:mx-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            適用
          </button>
        </div>
      </form>
    </div>
    <p>
      {{
        '検索結果 ' +
        totalItems +
        ' 件中 ' +
        ((currentPage - 1) * 100 + 1) +
        ' 〜 ' +
        ((currentPage - 1) * 100 + refRecordingData.length) +
        '件'
      }}
    </p>
    <table class="table-auto my-4">
      <thead>
        <tr>
          <th class="px-4 py-2 border w-[400px] bg-blue-100">曲名</th>
          <th class="px-4 py-2 border w-[400px] bg-blue-100">アーティスト</th>
          <th
            class="px-4 py-2 border w-[130px] bg-blue-100 hidden md:inline-block"
          >
            リリース日
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="recording in refRecordingData"
          :key="recording.id"
          class="border px-4 py-2"
        >
          <td class="border px-4 py-2 max-w-[600px] break-all">
            <RouterLink
              :to="{
                name: 'RecordingDetail',
                params: { id: recording.id },
              }"
            >
              {{ recording.title }}
            </RouterLink>
          </td>
          <td class="border px-4 py-2 break-all">
            {{
              recording['artist-credit']
                .map((credit: ArtistCredit) => credit.allName)
                .join(' ')
            }}
          </td>
          <td class="text-center px-4 py-2 w-[130px] hidden md:inline-block">
            {{ recording.firstReleaseDate }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="totalItems > 100">
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
    <NoResults />
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
