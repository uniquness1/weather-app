<template>
  <footer class="bg-slate-900 px-4 w-full py-5">
    <div class="flex flex-col justify-center md:flex-row items-center md:justify-between">
      <p class="text-white text-center md:text-start">
        &copy; {{ currentYear }} Designed & Developed by
        <a class="underline" target="_blank" href="https://adeolaajijola.vercel.app"
          >Adeola Ajijola</a
        >. All Rights Reserved.
      </p>
      <div>
        <span class="text-white text-lg">Connect:</span> &nbsp;
        <a
          class="underline text-white text-lg"
          target="_blank"
          href="https://www.linkedin.com/in/adeola-ajijola/"
          >Linkedin</a
        >.
        <a class="underline text-white text-lg" target="_blank" href="https://github.com/uniquness1"
          >Github</a
        >.
        <a class="underline text-white text-lg" target="_blank" href="https://twitter.com/ade236"
          >Twitter</a
        >.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>
