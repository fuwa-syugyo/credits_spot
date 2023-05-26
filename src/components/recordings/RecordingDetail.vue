<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import NotFound from "../NotFound.vue";
  import NowLoading from "../NowLoading.vue"
  import { RecordingData, Artists, Staff, SongWriter, Player } from "../../types/recording/RecordingDetail"

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const recording_id = props.id
  const credit_data = ref<RecordingData>();
  const spotifyLink = ref<string>();
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const secretId = import.meta.env.VITE_CLIENT_SECRET;
  const isLoading = ref(false);

  onMounted(async () => {
    try {
      isLoading.value = true;
      const relationshipsRes = await fetch(`https://musicbrainz.org/ws/2/recording/${recording_id}?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json`)
      const relationshipsData = await relationshipsRes.json()

      const artists: Artists[] = relationshipsData["artist-credit"]

      const player: Player[] = relationshipsData.relations.filter((rec: Player) => rec.type == "instrument" || rec.type == "vocal").map((item: Player) => ({
        id: item.artist.id,
        type: item.type,
        instrument: item.attributes[0] || item.type,
        name: item.artist.name
      }))

      let songwriter: SongWriter[] = relationshipsData?.relations.filter((item: SongWriter) => item.work) || [];
      if(songwriter.length && songwriter[0].work){
        songwriter = songwriter[0].work.relations.filter(artists => artists.type  === "composer" || artists.type  === "lyricist" || artists.type  === "writer").map((item: {artist: {id: string, name: string}, type: string}) => ({
          id: item.artist.id,
          type: item.type,
          name: item.artist.name
      }))}

      const staff: Staff[] = relationshipsData.relations.filter((rec: Staff) => rec.type == "arranger" || rec.type == "producer" || rec.type == "misc" || rec.type == "recording" || rec.type == "mix" || rec.type == "orchestrator").map((item: Staff) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))

      const all_credit_data: RecordingData = {
        id: relationshipsData.id,
        title: relationshipsData.title,
        release_date: relationshipsData?.['first-release-date'],
        attribute: relationshipsData?.relations?.filter((item: RecordingData )=> item)[0]?.attributes,
        isrcs: relationshipsData?.isrcs[0],

        credit: {
          artist_credit: artists,
          songwriter_credit: songwriter,
          staff_credit: staff,
          player_credit: player,
        }
      };
      credit_data.value = all_credit_data;

      const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(clientId + ':' + secretId),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
      };

      fetch('https://accounts.spotify.com/api/token', authOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to authenticate');
          }
          return response.json();
        })
        .then(async data => {
          const token = data.access_token;
          try {
            const spotifyRes = await fetch(`https://api.spotify.com/v1/search?query=isrc%3A${credit_data.value?.isrcs}&type=track&offset=0&limit=20`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const spotifyData = await spotifyRes.json()
            spotifyLink.value = spotifyData.tracks.items[0]?.external_urls.spotify
          } catch (error) {
            console.error(error);
          }
            })
          .catch(error => {
            console.error(error);
          });
    } catch {
      console.error('Error fetching data:', Error);
    } finally {
      isLoading.value = false;
    }
  })
</script>

<template>
  <div v-if="isLoading">
    <NowLoading></NowLoading>
  </div>
  <div v-else-if="credit_data">
    <p class="text-2xl my-4 max-w-xl">{{ credit_data?.title }}</p>
    <table class="table-auto my-2 max-w-xl">
      <thead>
        <tr>
          <th class="px-4 py-2 border solid bg-red-100">アーティスト</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="credit_data?.credit">
          <td class="px-4 py-2 border solid">
            <span v-for="artist in credit_data.credit.artist_credit"
              v-bind:name="artist.artist.name"
              v-bind:joinphrase="artist.joinphrase">
              <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: artist.artist.id}}">
                {{ artist.artist.name }}
              </RouterLink>
                {{ artist.joinphrase }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <br>
    <div v-if="credit_data && credit_data.credit && (credit_data.credit.songwriter_credit.length !== 0 || credit_data.credit.staff_credit.length !== 0  || credit_data.credit.player_credit.length !== 0 )">
      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2 border solid bg-blue-100 max-w-xs">担当</th>
            <th class="px-4 py-2 border solid bg-blue-100 max-w-xs">名前</th>
          </tr>
        </thead>
        <tbody v-if="credit_data?.credit.songwriter_credit">
          <tr v-for="songwriter in credit_data.credit.songwriter_credit" v-bind:key="songwriter.id">
            <td class="text-center px-4 py-2 border solid">{{ songwriter.type }}</td>
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: songwriter.id}}">
                {{ songwriter.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.staff_credit">
          <tr v-for="staff in credit_data.credit.staff_credit" v-bind:key="staff.id">
            <td class="text-center px-4 py-2 border solid">{{ staff.type }}</td>
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: staff.id}}">
                {{ staff.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.player_credit">
          <tr v-for="player in credit_data.credit.player_credit" v-bind:key="player.id">
            <td class="text-center px-4 py-2 border solid">{{ player.instrument }}</td>
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: player.id}}">
                {{ player.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>
    <div style="display: inline-block; vertical-align: middle;">
        <img src="../../../public/Spotify_Logo_CMYK_Green.png" alt="SpotifyIcon" class="spotify__icon" style="height: 25px;">
    </div>
    <div style="display: inline-block; vertical-align: middle;">
      <button :disabled="!spotifyLink" class="bg-blue-400 hover:bg-blue-600 font-bold py-1 px-4  mx-2 border border-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        <a :href="spotifyLink" target="_blank" class="text-white">Play</a>
      </button>
    </div>
  </div>
  <div v-else>
    <NotFound></NotFound>
  </div>
</template>
