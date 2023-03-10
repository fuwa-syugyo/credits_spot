<script setup lang="ts">
  import { ref, onMounted } from "vue";

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
    artist_credit: string;
    songwriter_credit: Songwriter;
    staff_credit: Staff;
    player_credit: Player;
    engineer_credit: Engineer;
  }

  type RecordingData = {
      id: string;
      title: string;
      attribute: string;
      first_release_date: string;
      credit: Credit;
    };

    onMounted(async () => {
      const recording_id = "7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5"
      const res = await fetch(`https://musicbrainz.org/ws/2/recording/${recording_id}?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels&fmt=json`)
      const data = await res.json()

      console.log(data)

      const player: Player[] = data.relations.filter((rec: Player) => rec.type == "instrument" || rec.type == "vocal").map((item: Player) => ({
        id: item.artist.id,
        type: item.type,
        instrument: item.attributes[0],
        name: item.artist.name
      }))
      console.log(player)

      let songwriter: Songwriter[] = data?.relations.filter((item: Songwriter) => item.work)
      if(songwriter[0]){
      songwriter = songwriter[0]?.work.relations.filter(artists => artists.type  === "composer" || artists.type  === "lyricist").map((item: Songwriter) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))}
      console.log(songwriter)

      const staff: Staff[] = data.relations.filter((rec: Staff) => rec.type == "arranger" || rec.type == "producer").map((item: Staff) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name
      }))
      console.log(staff)

      let engineer: Engineer[] = data.relations.filter((item: Engineer) => item.artist)
        engineer = engineer.filter((artists: Engineer) => artists.artist.disambiguation === "engineer").map((item: Engineer) => ({
          id: item.artist.id,
          job: item.artist.disambiguation,
          type: item.type,
          name: item.artist.name
          }))
        console.log(engineer)

        const recording_data: RecordingData[] = {
          id: data.id,
          title: data.title,
          release_date: data?.['first-release-date'],
          attribute: data?.relations?.filter((item: RecordingData )=> item)[0].attributes,

          credit: {
            artist_credit: { artist_credit_id: data?.['artist-credit'][0].artist.id, artist_credit: data?.['artist-credit'][0].name},
            songwriter_credit: songwriter,
            staff_credit: staff,
            player_credit: player,
            engineer_credit: engineer,
          }
        }
        console.log(recording_data)

    })
</script>

<template>
  <table>
    <thead>
      <tr>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>

</template>

<style>
</style>
