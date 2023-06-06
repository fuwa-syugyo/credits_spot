<template>
  <div class="my-8 container md:w-[930px]">
    <div class="md:flex my-2">
      <div class="py-2">
        <RouterLink :to="{ name: 'Caution' }"> ご利用上の注意 </RouterLink>
      </div>
      <div class="px-2 py-2">
        <a href="https://github.com/fuwa-syugyo/credits_spot">GitHub</a>
      </div>
      <div class="px-2 py-2">
        <a href="https://twitter.com/fuwa_syugyo">Twitter</a>
      </div>
      <div class="ml-auto text-slate-600 py-2">© 2023 fuwa-syugyo</div>
    </div>
  </div>
</template>
