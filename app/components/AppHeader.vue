<template>
  <header
    class="relative z-10 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div class="relative">
            <img
              src="/logo.svg"
              alt="AutoPlan logo"
              class="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <h1
            class="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
          >
            AutoPlan
          </h1>
        </NuxtLink>

        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            :class="[navBase, route.path === '/' ? navActive : navDefault]"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/about"
            :class="[navBase, route.path.startsWith('/about') ? navActive : navDefault]"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/demo"
            :class="[navBase, route.path.startsWith('/demo') ? navActive : navDefault]"
          >
            Demo
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Sign In
          </NuxtLink>
          <ClientOnly>
            <button
              @click="toggleColorMode"
              class="flex p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 hover:scale-105"
              :title="
                colorMode.value === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
            >
              <RiSunFill
                v-if="colorMode.value === 'dark'"
                class="w-5 h-5 text-gray-200"
              />
              <RiMoonFill v-else class="w-5 h-5 text-yellow-500" />
            </button>
            <template #fallback>
              <div
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-9 h-9"
              ></div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { RiSunFill, RiMoonFill } from "@remixicon/vue";
import { useRoute } from "vue-router";

const colorMode = useColorMode();
const route = useRoute();

const navBase = "hidden md:inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200";
const navDefault = "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";
const navActive = "text-gray-900 dark:text-white font-semibold border-b-2 border-blue-500";

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<style scoped></style>
