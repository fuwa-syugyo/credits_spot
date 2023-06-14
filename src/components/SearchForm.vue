<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const term = ref('')
const searchType = ref('曲名')

const search = (): void => {
  const type = searchType.value === '曲名' ? 'Recording' : 'Artist'
  router.push({ name: type + 'Search', query: { term: term.value } })
}
</script>

<template>
  <div class="container my-4">
    <form id="search-form" @submit.prevent="search">
      <label for="recording" class="mr-[30px]"
        ><input id="recording" v-model="searchType" type="radio" value="曲名" />
        <span class="mx-2">曲名</span>
      </label>
      <label for="artist"
        ><input id="artist" v-model="searchType" type="radio" value="人物名" />
        <span class="mx-2">人物名</span>
      </label>
      <div class="relative md:w-3/4">
        <input
          id="search"
          v-model="term"
          type="search"
          class="block w-3/4 md:w-4/5 p-2 pl-8 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          :placeholder="searchType === '曲名' ? '曲名で検索' : '人物名で検索'"
          required
        />
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          class="search-button text-white absolute right-0 md:right-1.5 bottom-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          検索
        </button>
      </div>
    </form>
  </div>
</template>
