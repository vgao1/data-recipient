<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const props = defineProps(["service", "btnText"]);
const emit = defineEmits(["refreshServices"]);
const componentRoot = ref<HTMLElement | null>(null);
const submitConsent = async () => {
  // Create a new Date object to get the current date and time in UTC
  const now = new Date();

  // Get the UTC components
  const year = now.getUTCFullYear();
  const month = pad(now.getUTCMonth() + 1); // Months are zero-based, so we add 1
  const day = pad(now.getUTCDate());
  const hours = pad(now.getUTCHours());
  const minutes = pad(now.getUTCMinutes());
  const seconds = pad(now.getUTCSeconds());

  // Format the UTC time
  const time = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  // Function to pad single-digit numbers with leading zero
  function pad(number: number) {
    return (number < 10 ? "0" : "") + number;
  }

  const consents: Array<Record<string, string>> = [];
  if (componentRoot.value) {
    const checkboxes = componentRoot.value.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      if (input.checked) {
        consents.push({ category: input.name });
      }
    });
  }

  try {
    const description = props.service.purpose;
    const service_id_str = props.service._id;
    const data_provider_str = props.service.data_provider;
    const data_recipient_str = props.service.data_recipient;
    await fetchy("/api/consentrecords", "POST", {
      body: { time, description, service_id_str, data_provider_str, data_recipient_str, consents },
    });
  } catch {
    return;
  }
  emit("refreshServices");
};
</script>
<template>
  <div ref="componentRoot">
    <p><u>Terms & Conditions</u></p>
    <span>Data Recipient will store the following pieces of data for 2 years: </span>
    <form @submit.prevent="submitConsent()">
      <p><b>Required Data</b></p>
      <div v-for="fieldName in props.service.required_data" :key="fieldName">
        <input type="checkbox" :name="fieldName" disabled checked />
        <label :for="fieldName">{{ fieldName }}</label>
      </div>
      <p><b>Optional Data</b></p>
      <div v-for="fieldName in props.service.optional_data" :key="fieldName">
        <input type="checkbox" :name="fieldName" checked />
        <label :for="fieldName">{{ fieldName }}</label>
      </div>
      <div class="btn-container">
        <button type="submit" class="pure-button agree-btn">{{ props.btnText }}</button>
      </div>
    </form>
  </div>
</template>
