<script setup lang="ts">
  import { ref, onMounted, defineProps } from "vue";
  import { ArtistData, RecordingCredit, SongWriterCredit, RecordInWork, ArtistCredit, ArtistRecording } from "../../types/artist/ArtistDetail"

  interface Props {
    id: string;
  }
  const props = defineProps<Props>();
  const artist_data = ref<ArtistData>();
  const artistRecording = ref<ArtistRecording[]>();

  const currentPage = ref(1);
  const totalItems = ref<number>(NaN);

  onMounted(async () => {
    try {
      const relationshipsRes = await fetch(`https://musicbrainz.org/ws/2/artist/${props.id}?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json`)
      const relationshipsData = await relationshipsRes.json()

      const recording_credit: RecordingCredit[] = relationshipsData.relations.filter((rec: RecordingCredit) => rec["target-type"] === "recording").map((item: RecordingCredit) => ({
        type: item.type === 'instrument' ? item.attributes[0] : item.type,
        recording: {
          id: item.recording.id,
          title: item.recording.title
        }
      }))

      const song_writer_credit: SongWriterCredit[] = relationshipsData.relations.filter((rec: SongWriterCredit) => rec["target-type"] === "work").map((item: SongWriterCredit) => ({
        type: item.type,
        work: {
          id: item.work.id,
          title: item.work.title
        }
      }))

      const all_artist_data: ArtistData = {
        id: relationshipsData.id,
        name: relationshipsData.name,
        credit: {
          song_writer_credit: song_writer_credit,
          recording_credit: recording_credit
        }
      };
      artist_data.value = all_artist_data;
      onClickHandler(1);
    } catch {
      console.error('Error fetching data:', Error);
    }
  })

  const onClickHandler = async (page: number) => {
    const offset = (page - 1) * 100
    try {
      const recordingRes = await fetch(`https://musicbrainz.org/ws/2/recording?artist=${props.id}&offset=${offset}&limit=100&fmt=json`)
      const recordingData = await recordingRes.json()

      const artistRecordingData: ArtistRecording[] = recordingData.recordings.map((item: ArtistRecording) => ({
        id: item.id,
        title: item.title
      }))

      artistRecording.value = artistRecordingData;
      totalItems.value = recordingData["recording-count"];
    } catch {
      console.error('Error fetching data:', Error);
      }
  }

</script>

<template>
  <div v-if="artist_data">
    <table class="table-auto my-2">
      <thead>
        <tr>
          <th class="px-4 py-2 border solid bg-red-100">人物名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="artist_data?.credit">
          <td class="px-4 py-2 border solid">{{ artist_data?.name }}</td>
        </tr>
      </tbody>
    </table>

    <br>
    <div v-if="artist_data && ( artist_data.credit.song_writer_credit.length !== 0 )">
      作詞作曲した楽曲
      <table class="table-auto my-4">
        <thead>
          <tr>
            <th class="px-4 py-2 border solid bg-blue-100">担当</th>
            <th class="px-4 py-2 border solid bg-blue-100">曲名</th>
          </tr>
        </thead>
        <tbody v-if="artist_data?.credit.song_writer_credit">
          <tr v-for="songwriter in artist_data.credit.song_writer_credit" v-bind:key="songwriter.work.id">
            <td class="text-center px-4 py-2 border solid">{{ songwriter.type }}</td>
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'RecordingInWork', params: {id: songwriter.work.id}}">
                {{ songwriter.work.title }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>

    <div v-if="artist_data && ( artist_data.credit.recording_credit.length !== 0 )">
      スタッフとして関わった楽曲
      <table>
        <thead>
          <tr>
            <th class="px-4 py-2 border solid  bg-blue-100">担当</th>
            <th class="px-4 py-2 border solid  bg-blue-100">曲名</th>
          </tr>
        </thead>
        <tbody v-if="artist_data?.credit.recording_credit">
          <tr v-for="recording in artist_data.credit.recording_credit" v-bind:key="recording.recording.id">
            <td class="text-center px-4 py-2 border solid">{{ recording.type }}</td>
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.recording.id}}">
                {{ recording.recording.title }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="artistRecording?.length !== 0">
      <br>
      アーティストとして関わった楽曲
      <table class="table-auto my-4">
        <thead>
          <tr>
            <th class="px-4 py-2 border solid bg-blue-100">曲名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recording in artistRecording" v-bind:key="recording.id">
            <td class="px-4 py-2 border solid">
              <RouterLink v-bind:to="{name: 'RecordingDetail', params: {id: recording.id}}">
                {{ recording.title }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      <div v-if="totalItems > 100">
      <vue-awesome-paginate
        :total-items="totalItems"
        :items-per-page="100"
        :max-pages-shown="5"
        v-model="currentPage"
        :on-click="onClickHandler"
      />
    </div>
  </div>
</template>
