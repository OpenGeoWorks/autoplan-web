<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="isOpen = false"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 z-10 overflow-auto max-h-[90vh]"
    >
      <div
        class="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Edit Embellishment Details
        </h2>
        <button
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          @click="isOpen = false"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSave" class="p-4 space-y-4">
        <!-- Project's Information -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Project's Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="text-sm font-medium text-gray-800 dark:text-gray-200"
                >File / Template Name</label
              >
              <input
                v-model="localData.name"
                type="text"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto Plan"
              />
            </div>
            <div>
              <label
                class="text-sm font-medium text-gray-800 dark:text-gray-200"
                >Personnel Name</label
              >
              <input
                v-model="localData.personel_name"
                type="text"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-gray-800 dark:text-gray-200"
                >Surveyor / Supervisor</label
              >
              <input
                v-model="localData.surveyor_name"
                type="text"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Surveyor Alabi"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
            :disabled="saving"
            :class="{ 'opacity-50 cursor-not-allowed': saving }"
            @click="isOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            :disabled="saving"
            :class="{ 'opacity-50 cursor-not-allowed': saving }"
          >
            <span v-if="saving">Saving…</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import axios from "axios";

interface EmbellishmentData {
  name: string;
  personel_name: string;
  surveyor_name: string;
}

const props = defineProps<{
  modelValue: boolean;
  embellishment: any;
  planId: string;
  allPlanData: any; // All other plan data to pass through
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const saving = ref(false);
const toast = useToast();

const localData = reactive<EmbellishmentData>({
  name: "",
  personel_name: "",
  surveyor_name: "",
});

// Watch for changes to embellishment prop
watch(
  () => props.embellishment,
  (newVal) => {
    if (newVal) {
      localData.name = newVal.name || "";
      localData.personel_name = newVal.personel_name || "";
      localData.surveyor_name = newVal.surveyor_name || "";
    }
  },
  { immediate: true, deep: true }
);

async function handleSave() {
  if (saving.value) return;

  try {
    saving.value = true;

    // Merge the edited fields with all existing plan data
    const payload = {
      ...props.allPlanData,
      name: localData.name,
      personel_name: localData.personel_name,
      surveyor_name: localData.surveyor_name,
    };

    await axios.put(`/plan/edit/${props.planId}`, payload);

    emit("saved");
    isOpen.value = false;
  } catch (error: any) {
    console.error("Failed to update embellishment:", error);
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update embellishment.";
    toast.add({
      title: msg,
      color: "error",
    });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped></style>
