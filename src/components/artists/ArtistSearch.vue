<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, RouterLink } from "vue-router";

  const route = useRoute();
  const artist_term = route.query.term;

  type ArtistData = {
      id: string;
      name: string;
    };

    const artist_data = ref<ArtistData[]>([]);
    const all_artist_data = ref<Array<ArtistData[]>>([]);

    const onClickHandler = async (page: number) => {
      console.log(page);
      const offset = (page - 1) * 100
      const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist_term}&offset=${offset}&limit=100&fmt=json`)
      const data = await res.json();

    const new_artist_data: ArtistData[] = data.artists.filter((rec:ArtistData) => rec).map((item: ArtistData) => ({
      id: item.id,
      name: item.name,
    }))

    artist_data.value = new_artist_data;
    totalItems.value = data.count - 1;
  }

    const currentPage = ref(1);
    const totalItems = ref(0);

    onMounted(async () => {
      await onClickHandler(currentPage.value);

      if(totalItems.value < 1000){
        for(let i = 1; i <= (totalItems.value / 100) + 1; i++) {
          const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist_term}&offset=${(i-1) * 100 }&limit=100&fmt=json`)
          const data = await res.json();

          const new_artist_data: ArtistData[] = data.artists.filter((rec:ArtistData) => rec).map((item: ArtistData) => ({
            id: item.id,
            name: item.name,
        }))
        all_artist_data.value.push(new_artist_data);
        }
        const flatted_artist_data = all_artist_data.value.flat();
        console.log(flatted_artist_data);
      }
    })
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>人物名</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="artist in artist_data" :key="artist.id">
        <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: artist.id}}">
        <td>{{ artist.name }}</td>
        </RouterLink>
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
</style>
