<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300"
  >
    <!-- Hero Section -->
    <main class="relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-indigo-600/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/10 to-pink-600/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl"
        ></div>
      </div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32"
      >
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Left Column -->
          <div class="space-y-8 text-center lg:text-left">
            <div class="space-y-6">
              <div
                class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium"
              >
                ✨ Modern geomatics platform
              </div>

              <h1
                class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span
                  class="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
                >
                  AutoPlan
                </span>
                <br />
                <span
                  class="text-gray-700 dark:text-gray-300 text-3xl md:text-4xl lg:text-5xl"
                >
                  Cadastral & engineering automation
                </span>
              </h1>

              <p
                class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                A web-based geospatial platform that accelerates cadastral and
                engineering surveys. Import coordinates or spreadsheet files
                (CSV / XLSX), run automated computations, transform coordinate
                systems, and export submission-ready PDFs, DXF drawings, and
                coordinate tables.
              </p>
            </div>

            <div
              class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <NuxtLink
                to="/dashboard"
                class="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                Get started
                <Icon
                  name="heroicons:arrow-right-20-solid"
                  class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                />
              </NuxtLink>

              <NuxtLink
                to="/demo"
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              >
                <Icon name="heroicons:play-20-solid" class="mr-2 w-5 h-5" />
                Watch demo
              </NuxtLink>
            </div>
          </div>

          <!-- Right Column -->
          <div class="relative">
            <div
              class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-3xl transition-all duration-500"
            >
              <!-- Mock browser header -->
              <div
                class="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600"
              >
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div class="flex-1 mx-4">
                  <div
                    class="bg-white dark:bg-slate-600 rounded px-3 py-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    autoplan.app/dashboard
                  </div>
                </div>
              </div>

              <!-- Screenshot -->
              <div class="aspect-[16/10] overflow-hidden">
                <img
                  src="@/assets/img/screenshot.png"
                  alt="AutoPlan dashboard screenshot"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <!-- Floating elements -->
              <div
                class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"
              ></div>
              <div
                class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full opacity-15 blur-xl group-hover:opacity-25 transition-opacity duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section
      class="py-16 md:py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8 md:gap-12">
          <div
            class="group text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2"
          >
            <div
              class="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="heroicons:bolt" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Reduce manual work
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Fewer drafting errors, faster delivery
            </p>
          </div>

          <div
            class="group text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2"
          >
            <div
              class="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="heroicons:globe-alt-20-solid"
                class="w-6 h-6 text-white"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Supports File Upload
            </h3>
            <p class="text-gray-600 dark:text-gray-400">CSV . XLSX . TXT</p>
          </div>

          <div
            class="group text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2"
          >
            <div
              class="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="heroicons:shield-check-20-solid"
                class="w-6 h-6 text-white"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Secure
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Encrypted storage & role access
            </p>
          </div>
        </div>

        <!-- Feature list -->
        <div class="mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1"
            >
              <Icon
                name="heroicons:check-20-solid"
                class="w-4 h-4 text-white"
              />
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              Automated boundary detection & area computation
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1"
            >
              <Icon
                name="heroicons:check-20-solid"
                class="w-4 h-4 text-white"
              />
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              Coordinate transforms and projection support
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1"
            >
              <Icon
                name="heroicons:check-20-solid"
                class="w-4 h-4 text-white"
              />
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              Export-ready PDF, DXF and printable reports
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1"
            >
              <Icon
                name="heroicons:check-20-solid"
                class="w-4 h-4 text-white"
              />
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              Designed for cadastral workflows in contexts like Nigeria
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 md:py-24 bg-gray-50 dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            How it works
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started with AutoPlan in three simple steps
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 md:gap-12">
          <div class="group relative text-center">
            <!-- Step connector line -->
            <div
              class="hidden md:block absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform translate-x-1/2 -translate-y-1/2 opacity-30"
            ></div>

            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold rounded-full mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                1
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Add coordinates
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Paste or enter parcel coordinates to begin your survey project.
              </p>
            </div>
          </div>

          <div class="group relative text-center">
            <!-- Step connector line -->
            <div
              class="hidden md:block absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform translate-x-1/2 -translate-y-1/2 opacity-30"
            ></div>

            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-full mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                2
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Draw & edit
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Use powerful drawing tools to annotate and refine parcel
                boundaries.
              </p>
            </div>
          </div>

          <div class="group relative text-center">
            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-full mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                3
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Compute & export
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Run automated checks, generate reports, and export
                submission-ready files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-24 bg-white dark:bg-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Trusted by practitioners
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            See what professionals are saying about AutoPlan
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 md:gap-12">
          <div
            class="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 md:p-8 border border-blue-200 dark:border-slate-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-start space-x-1 mb-4">
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
            </div>
            <blockquote
              class="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
            >
              "AutoPlan cut our drafting time in half and the exports are
              submission-ready. The automated calculations give us confidence in
              our work."
            </blockquote>
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-semibold">N</span>
              </div>
              <div>
                <cite
                  class="text-gray-900 dark:text-gray-100 font-semibold not-italic"
                  >N. Engineer</cite
                >
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Civil Engineer
                </p>
              </div>
            </div>
          </div>

          <div
            class="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 md:p-8 border border-purple-200 dark:border-slate-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-start space-x-1 mb-4">
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
              <Icon
                name="heroicons:star-20-solid"
                class="w-5 h-5 text-yellow-400"
              />
            </div>
            <blockquote
              class="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
            >
              "The computation accuracy gives us confidence when submitting
              plans. It's become an essential tool in our workflow."
            </blockquote>
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-semibold">L</span>
              </div>
              <div>
                <cite
                  class="text-gray-900 dark:text-gray-100 font-semibold not-italic"
                  >L. Surveyor</cite
                >
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Licensed Surveyor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "website",
});

useHead({
  title: "AutoPlan - Modern Cadastral & Engineering Plan Automation",
  meta: [
    {
      name: "description",
      content:
        "AutoPlan is a web-based geospatial platform for cadastral and engineering surveys. Import coordinates, compute areas and bearings, transform coordinate systems, and export submission-ready plans.",
    },
    {
      property: "og:title",
      content: "AutoPlan - Modern Cadastral & Engineering Plan Automation",
    },
    {
      property: "og:description",
      content:
        "Speed up cadastral and engineering surveys with automated boundary detection, area computation, and export-ready PDF reports.",
    },
  ],
});
</script>

<style scoped>
/* All styles are now handled by Tailwind CSS classes */
</style>
