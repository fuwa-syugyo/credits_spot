<template>
  <div class="my-8 container md:w-[930px]">
    <div class="md:flex my-2 mx-2">
      <div class="mr-auto text-slate-600">© 2023 fuwa-syugyo</div>
      <div class="px-2">
        <RouterLink :to="{ name: 'Caution' }"> ご利用上の注意 </RouterLink>
      </div>
      <div class="px-2">
        <a href="https://github.com/fuwa-syugyo/credit_search">GitHub</a>
      </div>
      <div class="px-2">
        <a href="https://twitter.com/fuwa_syugyo">Twitter</a>
      </div>
    </div>
  </div>
</template>
