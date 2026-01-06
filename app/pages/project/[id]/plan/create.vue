<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <div class="mb-4">
        <button
          @click="navigateTo(`/project/${projectId}`)"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          Back to Project
        </button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Create Plan
      </h1>

      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <StepBasicDetails
          :model-value="basicModel"
          :plan-types="PLAN_TYPES"
          :loading="submitting"
          @update:model-value="
            (val) => Object.assign(planData.basic, val.basic)
          "
          @complete="completeBasic"
          @cancel="cancel"
        >
          <template #left>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Project ID: <span class="font-mono">{{ projectId }}</span>
            </div>
          </template>
        </StepBasicDetails>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RiArrowLeftLine } from "@remixicon/vue";
import StepBasicDetails from "~/components/plan/steps/StepBasicDetails.vue";

definePageMeta({ middleware: ["auth"] });

import { reactive, ref } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { PLAN_TYPES } from "~/types/planTypes";
import axios from "axios";

const route = useRoute();
const toast = useToast();

const projectId = route.params.id as string;
const submitting = ref(false);

const planData = reactive({
  basic: { name: "", type: "" },
});

const basicModel = computed(() => ({ basic: planData.basic }));

function cancel() {
  navigateTo(`/project/${projectId}`);
}

async function completeBasic() {
  if (submitting.value) return;
  if (!planData.basic.name || !planData.basic.type) return;
  try {
    submitting.value = true;
    const payload = {
      name: planData.basic.name,
      type: planData.basic.type,
      project: projectId,
      computation_only: false,
    };
    const res = await axios.post(`/plan/create`, payload);
    const created = res?.data?.data;
    toast.add({ title: "Plan created", color: "success" });
    const planId = created?.id;
    if (planId) {
      navigateTo(`/project/${projectId}/plan/${planId}/edit`);
    } else {
      navigateTo(`/project/${projectId}`);
    }
  } catch (error) {
    toast.add({ title: "Failed to create plan", color: "error" });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped></style>
