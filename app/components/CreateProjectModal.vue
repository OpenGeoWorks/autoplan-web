<template>
  <div
    v-if="modelValue()"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="onClose"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 z-10 overflow-auto max-h-[90vh]"
    >
      <div
        class="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Create Project
        </h2>
        <button
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          @click="onClose"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="submit" class="p-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-800 dark:text-gray-200"
              >Name</label
            >
            <input
              v-model="localForm.name"
              required
              class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-800 dark:text-gray-200"
              >Number</label
            >
            <input
              v-model="localForm.number"
              class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="md:col-span-2">
            <label class="text-sm font-medium text-gray-800 dark:text-gray-200"
              >Description</label
            >
            <textarea
              v-model="localForm.description"
              rows="3"
              class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            Location
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Address</label
              >
              <input
                v-model="localForm.location.address"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >City</label
              >
              <input
                v-model="localForm.location.city"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >State</label
              >
              <input
                v-model="localForm.location.state"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Country</label
              >
              <input
                v-model="localForm.location.country"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">Client</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Name</label
              >
              <input
                v-model="localForm.client.name"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Email</label
              >
              <input
                v-model="localForm.client.email"
                type="email"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Phone</label
              >
              <input
                v-model="localForm.client.phone"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            Surveyor
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >Name</label
              >
              <input
                v-model="localForm.surveyor.name"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="text-sm text-gray-800 dark:text-gray-200"
                >SURCON Reg. No.</label
              >
              <input
                v-model="localForm.surveyor.license_no"
                class="mt-1 w-full border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div> -->

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
            :disabled="submitting"
            :class="{ 'opacity-50 cursor-not-allowed': submitting }"
            @click="onClose"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded"
            :disabled="submitting"
            :class="{ 'opacity-50 cursor-not-allowed': submitting }"
          >
            <span v-if="submitting">Creating…</span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRefs } from "vue";
import axios from "axios";
import { useRuntimeConfig } from "#imports";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "created"]);

// prefer watching a getter to satisfy TS overloads
const modelValue = () => (props as any).modelValue;
const config = useRuntimeConfig();
const toast = useToast();

const submitting = ref(false);

const defaultForm = () => ({
  name: "",
  description: "",
  number: "",
  location: { address: "", city: "", state: "", country: "" },
  client: { name: "", email: "", phone: "" },
  surveyor: { name: "", license_no: "" },
});

const localForm = ref(defaultForm());

watch(modelValue, (v: boolean) => {
  if (v) {
    localForm.value = defaultForm();
  }
});

function onClose() {
  emit("update:modelValue", false);
}

async function submit() {
  if (!localForm.value.name) {
    toast.add({ title: "Please enter a project name.", color: "error" });
    return;
  }

  submitting.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(localForm.value));
    const res = await axios.post(
      `${config.public.BASE_URL}/project/create`,
      payload
    );
    const created = res.data?.data ?? res.data;
    if (created) {
      toast.add({ title: "Project created.", color: "success" });
      emit("created", created);
    } else {
      toast.add({
        title: "Project created (no data returned).",
        color: "info",
      });
    }
    emit("update:modelValue", false);
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "Failed to create project.";
    toast.add({ title: msg, color: "error" });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped></style>
