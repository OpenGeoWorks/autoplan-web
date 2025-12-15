<template>
  <UserHeader />

  <!-- Add top padding so content isn't hidden under the fixed header -->
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back navigation -->
      <div class="mb-4">
        <button
          @click="navigateTo('/dashboard')"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <h1
        class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6"
      >
        Project Details
      </h1>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-6">
        <!-- Project details skeleton -->
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div
            class="h-8 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-4 w-3/4"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2 w-full"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-4 w-2/3"
          ></div>
          <div
            class="h-3 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-1/3"
          ></div>
        </div>

        <!-- Plans skeleton -->
        <div>
          <div
            class="h-6 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-4 w-1/4"
          ></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="n in 4"
              :key="n"
              class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-3"
            >
              <div
                class="h-5 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-3/4"
              ></div>
              <div
                class="h-4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-1/2"
              ></div>
              <div
                class="h-3 bg-gray-200 dark:bg-slate-600 rounded animate-pulse w-2/3"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Project Overview -->
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4"
          >
            <div class="flex-1">
              <h2
                class="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100 capitalize"
              >
                {{ project.name }}
              </h2>
              <div
                class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3"
              >
                <span v-if="project.number"
                  >Project No: {{ project.number }}</span
                >
                <span v-if="project.created_at"
                  >Created: {{ formatDate(project.created_at) }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div v-if="project.status">
                <span
                  :class="getStatusClass(project.status)"
                  class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700"
                >
                  {{ getStatusDisplayName(project.status) }}
                </span>
              </div>
              <!-- Action buttons -->
              <div class="flex items-center gap-2">
                <button
                  @click="editProject"
                  class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit Project"
                >
                  <RiEditLine class="w-4 h-4" />
                </button>
                <button
                  @click="deleteProject"
                  class="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <RiDeleteBinLine class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <p
            v-if="project.description"
            class="text-gray-700 dark:text-gray-300 mb-4"
          >
            {{ project.description }}
          </p>

          <!-- Project Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Client Information -->
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Client
              </h4>
              <div class="text-sm space-y-1">
                <div
                  v-if="
                    project.client?.name ||
                    project.client?.email ||
                    project.client?.phone
                  "
                >
                  <div
                    v-if="project.client.name"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    {{ project.client.name }}
                  </div>
                  <div
                    v-if="project.client.email"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ project.client.email }}
                  </div>
                  <div
                    v-if="project.client.phone"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ project.client.phone }}
                  </div>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">N/A</div>
              </div>
            </div>

            <!-- Surveyor Information -->
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Surveyor
              </h4>
              <div class="text-sm space-y-1">
                <div
                  v-if="project.surveyor?.name || project.surveyor?.license_no"
                >
                  <div
                    v-if="project.surveyor.name"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    {{ project.surveyor.name }}
                  </div>
                  <div
                    v-if="project.surveyor.license_no"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    License: {{ project.surveyor.license_no }}
                  </div>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">N/A</div>
              </div>
            </div>

            <!-- Location Information -->
            <div>
              <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Location
              </h4>
              <div class="text-sm space-y-1">
                <div
                  v-if="
                    project.location?.address ||
                    project.location?.city ||
                    project.location?.state ||
                    project.location?.country
                  "
                >
                  <div
                    v-if="project.location.address"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    {{ project.location.address }}
                  </div>
                  <div
                    v-if="project.location.city || project.location.state"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ getLocationText() }}
                  </div>
                  <div
                    v-if="project.location.country"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ project.location.country }}
                  </div>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">N/A</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-slate-700 mb-6">
          <div class="flex gap-4">
            <button
              @click="activeTab = 'plans'"
              :class="[
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'plans'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
              ]"
            >
              Plans
            </button>
            <button
              @click="activeTab = 'computations'"
              :class="[
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'computations'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
              ]"
            >
              Computations
            </button>
          </div>
        </div>

        <!-- Plans Tab Content -->
        <div v-if="activeTab === 'plans'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Plans
            </h3>
            <button
              v-if="project.id"
              @click="createPlan"
              class="inline-flex items-center gap-2 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Create Plan
            </button>
          </div>
          <div
            v-if="plans.length"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-600"
            >
              <div class="flex items-start justify-between mb-1">
                <div class="font-bold text-lg text-gray-800 dark:text-gray-200">
                  {{ plan.name }}
                </div>
                <div class="flex items-center gap-1">
                  <button
                    @click="editPlan(plan)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Edit Plan"
                  >
                    <RiEditLine class="w-4 h-4" />
                  </button>
                  <button
                    @click="openPlanDelete(plan)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Delete Plan"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                v-if="plan.type"
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                Type: {{ plan.type }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Created: {{ formatDate(plan.created_at) }}
              </div>
              <div>
                <button
                  @click="
                    navigateTo(`/project/${route.params.id}/plan/${plan.id}`)
                  "
                  class="mt-4 inline-block py-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details <RiArrowRightSLine class="inline w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            No plans found.
          </div>
        </div>

        <!-- Computations Tab Content -->
        <div v-if="activeTab === 'computations'">
          <!-- Quick Computations Dropdown -->
          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3
                  class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1"
                >
                  Quick Computations
                </h3>
                <p class="text-xs text-blue-700 dark:text-blue-300 mb-3">
                  Perform traverse computations without creating a plan
                </p>

                <!-- Custom Dropdown -->
                <div class="relative w-full md:w-80" ref="dropdownRef">
                  <button
                    @click="isDropdownOpen = !isDropdownOpen"
                    class="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  >
                    <span class="flex items-center gap-2">
                      <span
                        v-if="!selectedComputationLabel"
                        class="text-gray-500 dark:text-gray-400"
                      >
                        Select computation type...
                      </span>
                      <span v-else class="font-medium">
                        {{ selectedComputationLabel }}
                      </span>
                    </span>
                    <svg
                      class="w-5 h-5 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': isDropdownOpen }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <Transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div
                      v-if="isDropdownOpen"
                      class="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
                    >
                      <button
                        v-for="option in computationOptions"
                        :key="option.value"
                        @click="selectComputation(option)"
                        class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                      >
                        <div class="p-1.5 rounded-lg" :class="option.iconBg">
                          <svg
                            class="w-5 h-5"
                            :class="option.iconColor"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              :d="option.iconPath"
                            ></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <div
                            class="font-medium text-gray-900 dark:text-gray-100"
                          >
                            {{ option.label }}
                          </div>
                          <div
                            class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                          >
                            {{ option.description }}
                          </div>
                        </div>
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Saved Computations List -->
          <div>
            <h3
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Saved Computations
            </h3>
            <div
              v-if="computations.length"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div
                v-for="computation in computations"
                :key="computation.id"
                class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-600"
              >
                <div class="flex items-start justify-between mb-1">
                  <div
                    class="font-bold text-lg text-gray-800 dark:text-gray-200"
                  >
                    {{ computation.name }}
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      @click="openComputationDelete(computation)"
                      class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Delete Computation"
                    >
                      <RiDeleteBinLine class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Created: {{ formatDate(computation.created_at) }}
                </div>
                <div>
                  <button
                    @click="
                      navigateTo(
                        `/project/${route.params.id}/plan/${computation.id}`
                      )
                    "
                    class="mt-4 inline-block py-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details <RiArrowRightSLine class="inline w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              No saved computations found.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Project Modal -->
  <EditProjectModal
    v-model="showEditModal"
    :project="project"
    @updated="onProjectUpdated"
  />

  <!-- Delete Confirmation Modal -->
  <ConfirmModal
    v-model="showDeleteModal"
    title="Delete Project"
    message="Are you sure you want to delete this project? This action cannot be undone."
    @confirmed="confirmDelete"
  />

  <!-- Delete Plan Confirmation Modal -->
  <ConfirmModal
    v-model="showPlanDeleteModal"
    title="Delete Plan"
    message="Are you sure you want to delete this plan? This action cannot be undone."
    @confirmed="confirmDeletePlan"
  />

  <!-- Delete Computation Confirmation Modal -->
  <ConfirmModal
    v-model="showComputationDeleteModal"
    title="Delete Computation"
    message="Are you sure you want to delete this computation? This action cannot be undone."
    @confirmed="confirmDeleteComputation"
  />
</template>

<script lang="ts" setup>
import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiEditLine,
  RiDeleteBinLine,
} from "@remixicon/vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

interface ProjectData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
    image?: string;
    id: string;
  };
  name: string;
  description: string;
  number?: string;
  type: string;
  status?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  client?: {
    name: string;
    email: string;
    phone?: string;
  };
  surveyor?: {
    name: string;
    license_no?: string;
  };
}

interface PlanData {
  id: string | number;
  name: string;
  type?: string;
  status?: string;
  created_at?: string;
}

const toast = useToast();
const route = useRoute();
const project = ref<ProjectData>({ name: "", description: "", type: "" });
const loading = ref(true);
const activeTab = ref<"plans" | "computations">("plans");

// Modal states
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Custom Computation dropdown
const isDropdownOpen = ref(false);
const selectedComputation = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

const computationOptions = [
  {
    value: "forward",
    label: "Forward Computation",
    description: "Calculate coordinates from bearings and distances",
    iconPath: "M13 7l5 5m0 0l-5 5m5-5H6",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "traverse",
    label: "Traverse Computation",
    description: "Close traverses with angular misclosure corrections",
    iconPath:
      "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    value: "differential-leveling",
    label: "Differential Leveling",
    description: "Calculate reduced levels and height differences",
    iconPath: "M3 6h18M3 12h18M3 18h18",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
];

const selectedComputationLabel = computed(() => {
  const option = computationOptions.find(
    (opt) => opt.value === selectedComputation.value
  );
  return option ? option.label : "";
});

const selectComputation = (option: (typeof computationOptions)[0]) => {
  selectedComputation.value = option.value;
  isDropdownOpen.value = false;
  navigateTo(`/project/${route.params.id}/computation/${option.value}`);
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Plans
const plans = ref<PlanData[]>([]);
const showPlanDeleteModal = ref(false);
const planToDelete = ref<PlanData | null>(null);

// Computations
const computations = ref<PlanData[]>([]);
const showComputationDeleteModal = ref(false);
const computationToDelete = ref<PlanData | null>(null);

// Format date function
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Status class function (matching dashboard styles)
const getStatusClass = (status: string) => {
  const raw = (status || "").toLowerCase();
  const statusClasses: Record<string, string> = {
    draft: "text-gray-600 dark:text-gray-400",
    in_progress: "text-yellow-600 dark:text-yellow-400 font-semibold",
    field_work_complete: "text-blue-600 dark:text-blue-400 font-semibold",
    computed: "text-indigo-600 dark:text-indigo-400 font-semibold",
    plan_prepared: "text-green-600 dark:text-green-400 font-semibold",
    completed: "text-emerald-600 dark:text-emerald-400 font-semibold",
  };
  return statusClasses[raw] ?? "text-gray-600 dark:text-gray-400";
};

const getStatusDisplayName = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "Draft",
    in_progress: "In Progress",
    field_work_complete: "Field Work Completed",
    computed: "Computed",
    plan_prepared: "Plan Prepared",
    completed: "Completed",
  };
  return statusMap[status] || status;
};

const getLocationText = () => {
  const city = project.value.location?.city;
  const state = project.value.location?.state;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return "";
};

const editProject = () => {
  showEditModal.value = true;
};

const deleteProject = () => {
  showDeleteModal.value = true;
};

const onProjectUpdated = (updatedProject: ProjectData) => {
  project.value = updatedProject;
  showEditModal.value = false;
};

const confirmDelete = async () => {
  try {
    await axios.delete(`/project/delete/${project.value.id}`);
    toast.add({ title: "Project deleted successfully", color: "success" });
    navigateTo("/dashboard");
  } catch (error) {
    toast.add({ title: "Failed to delete project", color: "error" });
  }
  showDeleteModal.value = false;
};

// Navigate to create plan page with project id as query param
const createPlan = () => {
  if (!project.value.id) return;
  navigateTo(`/project/${project.value.id}/plan/create`);
};

const editPlan = (plan: PlanData) => {
  navigateTo(`/project/${route.params.id}/plan/${plan.id}/edit`);
};

const openPlanDelete = (plan: PlanData) => {
  planToDelete.value = plan;
  showPlanDeleteModal.value = true;
};

const confirmDeletePlan = async () => {
  const id = planToDelete.value?.id;
  if (!id) return;
  try {
    await axios.delete(`/plan/delete/${id}`);
    toast.add({ title: "Plan deleted successfully", color: "success" });
    plans.value = plans.value.filter((p) => p.id !== id);
  } catch (error) {
    toast.add({ title: "Failed to delete plan", color: "error" });
  }
  showPlanDeleteModal.value = false;
  planToDelete.value = null;
};

const openComputationDelete = (computation: PlanData) => {
  computationToDelete.value = computation;
  showComputationDeleteModal.value = true;
};

const confirmDeleteComputation = async () => {
  const id = computationToDelete.value?.id;
  if (!id) return;
  try {
    await axios.delete(`/plan/delete/${id}`);
    toast.add({ title: "Computation deleted successfully", color: "success" });
    computations.value = computations.value.filter((c) => c.id !== id);
  } catch (error) {
    toast.add({ title: "Failed to delete computation", color: "error" });
  }
  showComputationDeleteModal.value = false;
  computationToDelete.value = null;
};

onMounted(async () => {
  const { id } = route.params;
  try {
    const projectRes = await axios.get(`/project/fetch/${id}`);
    project.value = projectRes.data.data;

    try {
      const plansRes = await axios.get(
        `/plan/list/${id}?computation_only=false`
      );
      plans.value = plansRes.data?.data || [];
    } catch (err) {
      plans.value = [];
      toast.add({ title: "Failed to load plans", color: "error" });
    }

    try {
      const computationsRes = await axios.get(
        `/plan/list/${id}?computation_only=true`
      );
      computations.value = computationsRes.data?.data || [];
    } catch (err) {
      computations.value = [];
      toast.add({ title: "Failed to load computations", color: "error" });
    }
  } catch (e) {
    toast.add({
      title: "Failed to load project. Redirecting to projects list.",
      color: "error",
    });
    navigateTo("/dashboard");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
