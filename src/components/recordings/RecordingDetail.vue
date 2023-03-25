<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { RecordingData, Artists, Staff, SongWriter, Player, Engineer } from "../../types/recording/RecordingDetail"

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const recording_id = props.id
  const credit_data = ref<RecordingData>();

    onMounted(async () => {
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/${recording_id}?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels&fmt=json`)
      const data = await res.json()

      const artists: Artists[] = data["artist-credit"]

      const player: Player[] = data.relations.filter((rec: Player) => rec.type == "instrument" || rec.type == "vocal").map((item: Player) => ({
        id: item.artist.id,
        type: item.type,
        instrument: item.attributes[0] || item.type,
        name: item.artist.name
      }))

      let songwriter: SongWriter[] = data?.relations.filter((item: SongWriter) => item.work) || [];
      if(songwriter.length && songwriter[0].work){
      songwriter = songwriter[0].work.relations.filter(artists => artists.type  === "composer" || artists.type  === "lyricist").map((item: {artist: {id: string, name: string}, type: string}) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))}

      const staff: Staff[] = data.relations.filter((rec: Staff) => rec.type == "arranger" || rec.type == "producer").map((item: Staff) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))

      const engineer: Engineer[] = data.relations.filter((item: Engineer) => item.job === "engineer").map((item: Engineer) => ({
        id: item.artist.id,
        job: item.artist.disambiguation,
        type: item.type,
        name: item.artist.name,
        artist: item.artist
      }))

        const all_credit_data: RecordingData = {
          id: data.id,
          title: data.title,
          release_date: data?.['first-release-date'],
          attribute: data?.relations?.filter((item: RecordingData )=> item)[0]?.attributes,

          credit: {
            artist_credit: artists,
            songwriter_credit: songwriter,
            staff_credit: staff,
            player_credit: player,
            engineer_credit: engineer,
          }
        };
        credit_data.value = all_credit_data;
        console.log(all_credit_data)

    })
</script>

<template>
  <div v-if="credit_data">
    <table>
      <thead>
        <tr>
          <th>曲名</th>
          <th>アーティスト</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="credit_data?.credit">
          <td>{{ credit_data?.title }}</td>
          <td>
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
    <div v-if="credit_data && credit_data.credit && (credit_data.credit.songwriter_credit.length !== 0 || credit_data.credit.staff_credit.length !== 0  || credit_data.credit.player_credit.length !== 0  || credit_data.credit.engineer_credit.length !== 0 )">
      <table>
        <thead>
          <tr>
            <th>担当</th>
            <th>名前</th>
          </tr>
        </thead>
        <tbody v-if="credit_data?.credit.songwriter_credit">
          <tr v-for="songwriter in credit_data.credit.songwriter_credit" v-bind:key="songwriter.id">
            <td>{{ songwriter.type }}</td>
            <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: songwriter.id}}">
              <td>{{ songwriter.name }}</td>
            </RouterLink>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.staff_credit">
          <tr v-for="staff in credit_data.credit.staff_credit" v-bind:key="staff.id">
            <td>{{ staff.type }}</td>
            <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: staff.id}}">
              <td>{{ staff.name }}</td>
            </RouterLink>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.player_credit">
          <tr v-for="player in credit_data.credit.player_credit" v-bind:key="player.id">
            <td>{{ player.instrument }}</td>
            <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: player.id}}">
              <td>{{ player.name }}</td>
            </RouterLink>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.engineer_credit">
          <tr v-for="engineer in credit_data.credit.engineer_credit" v-bind:key="engineer.id">
            <td>{{ engineer.type }}</td>
            <RouterLink v-bind:to="{name: 'ArtistDetail', params: {id: engineer.id}}">
              <td>{{ engineer.name }}</td>
            </RouterLink>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid black;
  padding: 0.5em;
}
</style>
