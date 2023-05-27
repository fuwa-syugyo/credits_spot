<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink, onBeforeRouteUpdate } from "vue-router";
  import { ArtistData } from "../../types/artist/ArtistSearch"
  import NowLoading from "../NowLoading.vue"
  import NoResults  from "../NoResults.vue"

  onBeforeRouteUpdate((to, from, next) => {
    artist_term.value = to.query.term as string || '';
    currentPage.value = 1
    onClickHandler(currentPage.value, artist_term.value).then(() => {
      next();
    });
  });

  const route = useRoute();
  const artist_term = ref(route.query.term as string || '');
  const artist_data = ref<ArtistData[]>([]);
  const isLoading = ref(false);

  const onClickHandler = async (page: number, artist_term: string) => {
    if (!artist_term) {
      artist_term = route.query.term as string || ''
    }
    try {
      isLoading.value = true;
      const offset = (page - 1) * 100
      const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist_term}&offset=${offset}&limit=100&fmt=json`)
      const data = await res.json();

      const new_artist_data: ArtistData[] = data.artists.filter((rec:ArtistData) => rec).map((item: ArtistData) => ({
        id: item.id,
        name: item.name,
      }))

      artist_data.value = new_artist_data;
      totalItems.value = data.count;
    } catch {
      console.error('Error fetching data:', Error);
    } finally {
      isLoading.value = false;
    }
  }

  const currentPage = ref(1);
  const totalItems = ref(0);

  onMounted(() => {
    onClickHandler(currentPage.value, artist_term.value);
  })
</script>

<template>
  <div v-if="isLoading">
    <NowLoading></NowLoading>
  </div>
  <div v-else-if="artist_data.length !== 0">
    <h1 class="text-2xl my-4 max-w-xl">人物検索結果</h1>
    <p>
      {{ '検索結果 '+ totalItems + ' 件中 ' + ((currentPage - 1) * 100 + 1 ) + ' 〜 ' +  ((currentPage - 1) * 100  + artist_data.length)+ '件'  }}
    </p>
    <table class="table-auto my-4 max-w-xl">
      <thead>
        <tr>
          <th class="px-4 py-2 border  bg-blue-100">人物名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="artist in artist_data" :key="artist.id">
          <td class="border px-4 py-2">
            <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: artist.id}}">
              {{ artist.name }}
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="totalItems > 100">
      <vue-awesome-paginate
        :total-items="totalItems"
        :items-per-page="100"
        :max-pages-shown="3"
        v-model="currentPage"
        :on-click="onClickHandler"
      />
    </div>
  </div>
  <div v-else>
    <NoResults></NoResults>
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
    border: 1px solid #3498db;
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
