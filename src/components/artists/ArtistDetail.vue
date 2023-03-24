<script setup lang="ts">
  import { ref, onMounted, defineProps } from "vue";
  import { ArtistData, RecordingCredit, SongWriterCredit, RecordInWork, ArtistCredit } from "../../types/artist/ArtistDetail"
  // import WorkModal from "./WorkModal.vue";

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const artist_data = ref<ArtistData>();

  const recordingInWork = async (work_id: string) => {
    const res = await fetch(`https://musicbrainz.org/ws/2/work/${work_id}?inc=recording-rels+artist-credits&fmt=json`)
    const data = await res.json();

    let recording_in_work: RecordInWork = data?.relations.filter((x: Array<object>) => x).map((item: RecordInWork) => ({
        id: item.recording.id,
        title: item.recording.title,
        "artist-credit": item.recording["artist-credit"].map((credit: ArtistCredit) => ({
            id: credit.artist.id,
            name: credit.artist.name,
            join_phrase: credit.joinphrase,
            all_name: credit.artist.name + (credit.joinphrase ? ' ' + credit.joinphrase : '')
          })),
        attributes: item.attributes[0],
      }))
      console.log(recording_in_work)
    }

  onMounted(async () => {
    const res = await fetch(`https://musicbrainz.org/ws/2/artist/${props.id}?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json`)
    const data = await res.json()

    const recording_credit: RecordingCredit[] = data.relations.filter((rec: RecordingCredit) => rec["target-type"] === "recording").map((item: RecordingCredit) => ({
      type: item.type,
      recording: {
        id: item.recording.id,
        title: item.recording.title
      }
    }))

    const song_writer_credit: SongWriterCredit[] = data.relations.filter((rec: SongWriterCredit) => rec["target-type"] === "work").map((item: SongWriterCredit) => ({
      type: item.type,
      work: {
        id: item.work.id,
        title: item.work.title
      }
    }))

    const all_artist_data: ArtistData = {
      id: data.id,
      name: data.name,
      credit: {
        song_writer_credit: song_writer_credit,
        recording_credit: recording_credit
      }
    };
    artist_data.value = all_artist_data;
    console.log(all_artist_data)
  }
  )
</script>

<template>
  <div v-if="artist_data">
    <table>
      <thead>
        <tr>
          <th>人物名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="artist_data?.credit">
          <td>{{ artist_data?.name }}</td>
        </tr>
      </tbody>
    </table>

    <br>
    <div v-if="artist_data && ( artist_data.credit.song_writer_credit.length !== 0 )">
      <table>
        <thead>
          <tr>
            <th>担当</th>
            <th>曲名</th>
          </tr>
        </thead>
        <tbody v-if="artist_data?.credit.song_writer_credit">
          <tr v-for="songwriter in artist_data.credit.song_writer_credit" v-bind:key="songwriter.work.id">
            <td>{{ songwriter.type }}</td>
            <td @click="recordingInWork(songwriter.work.id)">{{ songwriter.work.title }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>

    <div v-if="artist_data && ( artist_data.credit.recording_credit.length !== 0 )">
      <table>
        <thead>
          <tr>
            <th>担当</th>
            <th>曲名</th>
          </tr>
        </thead>
        <tbody v-if="artist_data?.credit.recording_credit">
          <tr v-for="recording in artist_data.credit.recording_credit" v-bind:key="recording.recording.id">
            <td>{{ recording.type }}</td>
            <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.recording.id}}">
              <td>{{ recording.recording.title }}</td>
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
