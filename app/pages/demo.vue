<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto">
        <div
          class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium"
        >
          🎬 Product demos
        </div>
        <h1
          class="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
        >
          See AutoPlan in action
        </h1>
        <p
          class="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          Short walkthroughs of each computation and survey-plan workflow — from
          importing field data to generating submission-ready outputs.
        </p>
      </div>

      <!-- Featured / introduction video -->
      <section class="mt-12 md:mt-16">
        <div
          class="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="aspect-video">
            <iframe
              class="w-full h-full"
              :src="embedUrl(intro.id)"
              :title="intro.title"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div class="p-6">
            <h2
              class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {{ intro.title }}
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ intro.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Feature sections -->
      <section
        v-for="section in sections"
        :key="section.heading"
        class="mt-14 md:mt-20"
      >
        <h2
          class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {{ section.heading }}
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ section.subtitle }}
        </p>

        <div class="mt-8 grid gap-8 md:grid-cols-2">
          <article
            v-for="video in section.items"
            :key="video.id + video.title"
            class="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            <div class="aspect-video bg-gray-100 dark:bg-slate-900">
              <iframe
                class="w-full h-full"
                :src="embedUrl(video.id)"
                :title="video.title"
                frameborder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
            <div class="p-5">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {{ video.title }}
              </h3>
              <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                {{ video.description }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- CTA -->
      <section class="mt-16 md:mt-24 text-center">
        <div
          class="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-8 py-12 shadow-xl"
        >
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Ready to try it yourself?
          </h2>
          <p class="mt-3 text-blue-100">
            Create a project and run your first computation in minutes.
          </p>
          <NuxtLink
            to="/dashboard"
            class="mt-6 inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Get started
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "website",
});

useHead({
  title: "Demo — AutoPlan",
  meta: [
    {
      name: "description",
      content:
        "Watch demo videos of AutoPlan's survey computations and plan generation workflows.",
    },
  ],
});

// Privacy-enhanced YouTube embed
const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}`;

const intro = {
  title: "Introduction to AutoPlan",
  id: "zgSB3-0YNrk",
  description:
    "A quick tour of the platform — projects, data import, computations and generating survey plans.",
};

const sections = [
  {
    heading: "Survey Computations",
    subtitle:
      "Standalone tools for reducing field observations into coordinates and levels.",
    items: [
      {
        title: "Forward Computation",
        id: "Rghuu4Onss0",
        description:
          "Calculate coordinates from bearings and distances, with optional misclosure correction.",
      },
      {
        title: "Traverse Computation",
        id: "-QJXXXkJFGo",
        description:
          "Close a traverse from observed angles and distances and distribute the angular misclosure.",
      },
      {
        title: "Differential Levelling",
        id: "mu2KL9Yeo60",
        description:
          "Reduce levels by height-of-instrument or rise-and-fall, with the arithmetic check and misclosure adjustment.",
      },
    ],
  },
  {
    heading: "Survey Plans",
    subtitle:
      "End-to-end workflows that turn coordinates and elevations into finished plans.",
    items: [
      {
        title: "Cadastral Survey Plan",
        id: "0JHWWzD5hiY",
        description:
          "Import beacons, define parcels and generate a submission-ready cadastral plan.",
      },
      {
        title: "Topographic Survey Plan",
        id: "iZ6lBiDoNGY",
        description:
          "Build a perimeter survey with spot heights and produce contours and a TIN surface.",
      },
      {
        title: "Layout Survey Plan",
        id: "p17h9ccYNOI",
        description:
          "Design a subdivision from a site boundary — auto-generate plots or enter a designed layout.",
      },
      {
        title: "Route Survey Plan",
        id: "xnksJC-E9eM",
        description:
          "Set out a route with elevation data, alignment and a longitudinal profile.",
      },
    ],
  },
];
</script>
