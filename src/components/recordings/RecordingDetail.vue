<script setup lang="ts">
  import { ref, onMounted } from "vue";

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const recording_id = props.id
  const credit_data = ref<RecordingData[]>([]);

  type Staff = {
    id: string;
    type: string;
    name: string;
  }

  type Songwriter = {
    id: string;
    type: string;
    name: string;
    work: object;
  }

  type Player = {
    id: string;
    type: string;
    instrument: string;
    name: string;
  }

  type Engineer = {
    id: string;
    job: string;
    type: string;
    name: string;
  }

  type Credit = {
    artist_credit: {
      artist_credit_id: string;
      artist_credit: string;
    }
    songwriter_credit: Songwriter[];
    staff_credit: Staff[];
    player_credit: Player[];
    engineer_credit: Engineer[];
  }

  type RecordingData = {
      id: string;
      title: string;
      attribute: string;
      release_date: string;
      credit: Credit;
    };

    onMounted(async () => {
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/${recording_id}?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels&fmt=json`)
      const data = await res.json()

      const player: Player[] = data.relations.filter((rec: Player) => rec.type == "instrument" || rec.type == "vocal").map((item: Player) => ({
        id: item.artist.id,
        type: item.type,
        instrument: item.attributes[0],
        name: item.artist.name
      }))

      let songwriter: Songwriter[] = data?.relations.filter((item: Songwriter) => item.work)
      if(songwriter[0]){
      songwriter = songwriter[0]?.work.relations.filter(artists => artists.type  === "composer" || artists.type  === "lyricist").map((item: Songwriter) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))}

      const staff: Staff[] = data.relations.filter((rec: Staff) => rec.type == "arranger" || rec.type == "producer").map((item: Staff) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))

      let engineer: Engineer[] = data.relations.filter((item: Engineer) => item.artist)
        engineer = engineer.filter((artists: Engineer) => artists.artist.disambiguation === "engineer").map((item: Engineer) => ({
          id: item.artist.id,
          job: item.artist.disambiguation,
          type: item.type,
          name: item.artist.name
          }))

        const all_credit_data: RecordingData[] = {
          id: data.id,
          title: data.title,
          release_date: data?.['first-release-date'],
          attribute: data?.relations?.filter((item: RecordingData )=> item)[0]?.attributes,

          credit: {
            artist_credit: { artist_credit_id: data?.['artist-credit'][0].artist.id, artist_credit: data?.['artist-credit'][0].name},
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
          <td>{{ credit_data?.credit.artist_credit.artist_credit }}</td>
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
          <tr v-for="songwriter in credit_data.credit.songwriter_credit">
            <td>{{ songwriter.type }}</td>
            <td>{{ songwriter.name }}</td>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.staff_credit">
          <tr v-for="staff in credit_data.credit.staff_credit">
            <td>{{ staff.type }}</td>
            <td>{{ staff.name }}</td>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.player_credit">
          <tr v-for="player in credit_data.credit.player_credit">
            <td>{{ player.instrument }}</td>
            <td>{{ player.name }}</td>
          </tr>
        </tbody>
        <tbody v-if="credit_data?.credit.engineer_credit">
          <tr v-for="engineer in credit_data.credit.engineer_credit">
            <td>{{ engineer.type }}</td>
            <td>{{ engineer.name }}</td>
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
