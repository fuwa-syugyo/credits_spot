<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ArtistCredit,
  SearchRecordingData,
} from '../../types/recording/RecordingSearch'
import NowLoading from '../NowLoading.vue'
import FetchError from '../FetchError.vue'

const route = useRoute()
const recordingTerm = (route.query.term as string) || ''
const excludeInstValue = route.query.excludeInst
const partialMatchValue = route.query.partialMatch
const artistName = (route.query.artistName as string) || ''
const totalItems = ref<number>(0)
let filteredDataLength = 0
let filteredData: SearchRecordingData[] = []
const isLoading = ref(false)
const fetchError = ref(false)

const refRecordingData = ref<SearchRecordingData[]>([])
const refRecordingDataArray = ref<Array<SearchRecordingData[]>>([])

onMounted(async () => {
  try {
    isLoading.value = true
    const firstData = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=recording:${recordingTerm}&offset=0&limit=100&fmt=json`
    ).then((res) => res.json()) //fetchを行う回数を決めるために、検索結果が何件か調べる

    totalItems.value = firstData.count
    const repeat = totalItems.value < 500 ? totalItems.value / 100 : 4

    for (let i = 0; i < repeat + 1; i++) {
      const data = await fetch(
        `https://musicbrainz.org/ws/2/recording/?query=recording:${recordingTerm}&offset=${
          i * 100
        }&limit=100&fmt=json`
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
          'secondary-types':
            item.releases?.[0]['release-group']['secondary-types']?.[0],
        }))

      refRecordingDataArray.value.push(searchRecordingData)
    }
    refRecordingData.value = refRecordingDataArray.value.flat()

    if (excludeInstValue == 'true') {
      excludeInstFilter()
    }

    if (partialMatchValue == 'true') {
      partialMatchFilter()
    }

    if (artistName !== '') {
      artistFilter()
    }
    filteredData = refRecordingData.value
    filteredDataLength = filteredData.length
    onClickHandler(currentPage.value)
  } catch {
    console.error('Error fetching data:', Error)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
})

const onClickHandler = (page: number) => {
  let startIndex = (page - 1) * 100
  let endIndex = startIndex + 100
  const dataPerPage = filteredData.slice(startIndex, endIndex)
  refRecordingData.value = dataPerPage
}

const artistFilter = () => {
  const includeArtistData = refRecordingData.value.filter((data) =>
    data['artist-credit'][0].allName.includes(artistName)
  )
  refRecordingData.value = includeArtistData
}

const excludeInstFilter = () => {
  const cutData = refRecordingData.value.filter(
    (data) =>
      !data.title.toLocaleLowerCase().includes('instrumental') &&
      !data.title.toLocaleLowerCase().includes('(off vocal)') &&
      !data.title.includes('(カラオケ)') &&
      !data.title.includes('(オリジナル・カラオケ)') &&
      !data.title.toLocaleLowerCase().includes('(karaoke)') &&
      !data.title.toLocaleLowerCase().includes('music video') &&
      !data.title.toLocaleLowerCase().includes('tv size')
  )
  refRecordingData.value = cutData
}

const partialMatchFilter = () => {
  const partialMatchData = refRecordingData.value.filter((data) =>
    data.title.toLocaleLowerCase().includes(recordingTerm.toLocaleLowerCase())
  )
  refRecordingData.value = partialMatchData
}

const currentPage = ref(1)
</script>

<template>
  <div v-if="isLoading">
    <NowLoading />
  </div>
  <div v-else-if="fetchError">
    <FetchError />
  </div>
  <div v-else-if="filteredDataLength !== 0">
    <h1 class="text-2xl my-4 max-w-xl">絞り込み結果</h1>
    <p class="filtered-recording-search-number">
      {{
        '検索結果 ' +
        filteredDataLength +
        ' 件中 ' +
        ((currentPage - 1) * 100 + 1) +
        ' 〜 ' +
        ((currentPage - 1) * 100 + refRecordingData.length) +
        '件'
      }}
    </p>
    <table class="filtered-recording-search-table table-auto my-4">
      <thead>
        <tr>
          <th class="px-4 py-2 border w-[390px] md:w-[460px] bg-blue-100">
            曲名
          </th>
          <th class="px-4 py-2 border w-[410px] md:w-[470px] bg-blue-100">
            アーティスト
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="recording in refRecordingData"
          :key="recording.id"
          class="border px-4 py-2"
        >
          <td class="border px-4 py-2 break-all">
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
            <p>
              {{
                recording['artist-credit']
                  .map((credit: ArtistCredit) => credit.allName)
                  .join(' ')
              }}
            </p>
            <p class="release-date my-1 text-xs">
              {{ 'リリース日: ' + recording.firstReleaseDate }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="filteredDataLength > 100" class="pagination">
      <vue-awesome-paginate
        v-model="currentPage"
        :total-items="filteredDataLength"
        :items-per-page="100"
        :max-pages-shown="3"
        :on-click="onClickHandler"
      />
    </div>
  </div>
  <div v-else class="no-filtered-recording">
    <h1 class="text-2xl my-4 max-w-xl">Not Found!</h1>
    <p>条件に該当する音源はありませんでした。</p>
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
