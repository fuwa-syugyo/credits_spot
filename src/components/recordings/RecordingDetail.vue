<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotFound from '../NotFound.vue'
import NowLoading from '../NowLoading.vue'
import {
  RecordingData,
  Artists,
  Staff,
  SongWriter,
  Player,
} from '../../types/recording/RecordingDetail'

interface Props {
  id: string
}
const props = defineProps<Props>()
const recordingId = props.id
const creditData = ref<RecordingData>()
const spotifyLink = ref<string>()
const clientId = import.meta.env.VITE_CLIENT_ID
const secretId = import.meta.env.VITE_CLIENT_SECRET
const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const relationshipsRes = await fetch(
      `https://musicbrainz.org/ws/2/recording/${recordingId}?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json`
    )
    const relationshipsData = await relationshipsRes.json()

    const artists: Artists[] = relationshipsData['artist-credit']

    const player: Player[] = relationshipsData.relations
      .filter((rec: Player) => rec.type == 'instrument' || rec.type == 'vocal')
      .map((item: Player) => ({
        id: item.artist.id,
        type: item.type,
        instrument: item.attributes[0] || item.type,
        name: item.artist.name,
      }))

    let songWriter: SongWriter[] =
      relationshipsData?.relations.filter((item: SongWriter) => item.work) || []
    if (songWriter.length && songWriter[0].work) {
      songWriter = songWriter[0].work.relations
        .filter(
          (artists) =>
            artists.type === 'composer' ||
            artists.type === 'lyricist' ||
            artists.type === 'writer'
        )
        .map(
          (item: { artist: { id: string; name: string }; type: string }) => ({
            id: item.artist.id,
            type: item.type,
            name: item.artist.name,
          })
        )
    }

    const staff: Staff[] = relationshipsData.relations
      .filter(
        (rec: Staff) =>
          rec.type == 'arranger' ||
          rec.type == 'producer' ||
          rec.type == 'misc' ||
          rec.type == 'recording' ||
          rec.type == 'mix' ||
          rec.type == 'orchestrator'
      )
      .map((item: Staff) => ({
        id: item.artist.id,
        type: item.type,
        name: item.artist.name,
      }))

    const allCreditData: RecordingData = {
      id: relationshipsData.id,
      title: relationshipsData.title,
      releaseDate: relationshipsData?.['first-release-date'],
      attribute: relationshipsData?.relations?.filter(
        (item: RecordingData) => item
      )[0]?.attributes,
      isrcs: relationshipsData?.isrcs[0],

      credit: {
        artistCredit: artists,
        songWriterCredit: songWriter,
        staffCredit: staff,
        playerCredit: player,
      },
    }
    creditData.value = allCreditData

    const authOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(clientId + ':' + secretId),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    }

    fetch('https://accounts.spotify.com/api/token', authOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to authenticate')
        }
        return response.json()
      })
      .then(async (data) => {
        const token = data.access_token
        try {
          const spotifyRes = await fetch(
            `https://api.spotify.com/v1/search?query=isrc%3A${creditData.value?.isrcs}&type=track&offset=0&limit=20`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          const spotifyData = await spotifyRes.json()
          spotifyLink.value = spotifyData.tracks.items[0]?.external_urls.spotify
        } catch (error) {
          console.error(error)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  } catch {
    console.error('Error fetching data:', Error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">
    <NowLoading />
  </div>
  <div v-else-if="creditData">
    <h1 class="text-2xl my-4 max-w-xl">
      {{ creditData?.title }}
    </h1>
    <table class="table-auto my-2 max-w-xl">
      <thead>
        <tr>
          <th class="px-4 py-2 border solid bg-red-100">
            アーティスト
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="creditData?.credit">
          <td class="px-4 py-2 border solid">
            <span
              v-for="artist in creditData.credit.artistCredit"
              :key="artist.artist.id"
              :name="artist.artist.name"
              :joinphrase="artist.joinphrase"
            >
              <RouterLink
                :to="{
                  name: 'ArtistDetail',
                  params: { id: artist.artist.id },
                }"
              >
                {{ artist.artist.name }}
              </RouterLink>
              {{ artist.joinphrase }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <br>
    <div
      v-if="
        creditData &&
          creditData.credit &&
          (creditData.credit.songWriterCredit.length !== 0 ||
            creditData.credit.staffCredit.length !== 0 ||
            creditData.credit.playerCredit.length !== 0)
      "
    >
      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2 border solid bg-blue-100 max-w-xs">
              担当
            </th>
            <th class="px-4 py-2 border solid bg-blue-100 max-w-xs">
              名前
            </th>
          </tr>
        </thead>
        <tbody v-if="creditData?.credit.songWriterCredit">
          <tr
            v-for="songWriter in creditData.credit.songWriterCredit"
            :key="songWriter.id"
          >
            <td class="text-center px-4 py-2 border solid">
              {{ songWriter.type }}
            </td>
            <td class="px-4 py-2 border solid">
              <RouterLink
                :to="{
                  name: 'ArtistDetail',
                  params: { id: songWriter.id },
                }"
              >
                {{ songWriter.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-if="creditData?.credit.staffCredit">
          <tr
            v-for="staff in creditData.credit.staffCredit"
            :key="staff.id"
          >
            <td class="text-center px-4 py-2 border solid">
              {{ staff.type }}
            </td>
            <td class="px-4 py-2 border solid">
              <RouterLink
                :to="{ name: 'ArtistDetail', params: { id: staff.id } }"
              >
                {{ staff.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-if="creditData?.credit.playerCredit">
          <tr
            v-for="player in creditData.credit.playerCredit"
            :key="player.id"
          >
            <td class="text-center px-4 py-2 border solid">
              {{ player.instrument }}
            </td>
            <td class="px-4 py-2 border solid">
              <RouterLink
                :to="{ name: 'ArtistDetail', params: { id: player.id } }"
              >
                {{ player.name }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>
    <div class="spotify-button">
      <div style="display: inline-block; vertical-align: middle">
        <img
          src="../../../public/Spotify_Logo_CMYK_Green.png"
          alt="Spotify Logo"
          class="spotify Logo"
          style="height: 25px"
        >
      </div>
      <div style="display: inline-block; vertical-align: middle">
        <button
          :disabled="!spotifyLink"
          class="bg-blue-400 hover:bg-blue-600 font-bold py-1 px-4 mx-2 border border-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <a
            :href="spotifyLink"
            target="_blank"
            class="text-white"
          >Play</a>
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>
