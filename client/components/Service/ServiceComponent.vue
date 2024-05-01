<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import ServiceContent from "./ServiceContent.vue";

const props = defineProps(["allServices"]);
const servicesWithConsent = ref<Array<string>>([]);
let loaded = ref(false);
let editing = ref("");

async function getConsentRecords() {
  let services = [];
  try {
    const records = await fetchy(`/api/consentrecords`, "GET");
    for (const record of records) {
      services.push(record);
    }
    servicesWithConsent.value = services;
  } catch {
    return;
  }
}

function editConsent(service_id_str: string) {
  editing.value = service_id_str;
}

async function updateEditing() {
  editing.value = "";
}

async function revokeConsent(service_id_str: string) {
  await fetchy(`/api/consentrecords/${service_id_str}`, "DELETE", {});
  await getConsentRecords();
}

onBeforeMount(async () => {
  await getConsentRecords();
  loaded.value = true;
});
</script>
<template>
  <div class="row">
    <section class="services" v-if="loaded && props.allServices.length !== 0">
      <article v-for="service in props.allServices" :key="service._id">
        <img class="logo-pic" v-if="service.logoURL !== null" :src="service.logoURL" />
        <h4>{{ service.service }}</h4>
        <span><u>Purpose</u>: {{ service.purpose }}</span>
        <ServiceContent v-if="!servicesWithConsent.includes(service._id)" :service="service" btnText="Agree" @refreshServices="getConsentRecords" />
        <div v-else>
          <ServiceContent v-if="service._id === editing" :service="service" btnText="Update Consent" @refreshServices="updateEditing" />
          <div v-else id="consent-btns-container">
            <button class="pure-button" @click="editConsent(service._id)">Edit Consent</button>
            <button class="pure-button revoke-consent-btn" @click="revokeConsent(service._id)">Revoke Consent</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
<style>
.logo-pic {
  max-width: 100%;
  height: auto;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.services {
  padding: 1em;
  max-width: 400px;
}

.row {
  display: flex;
  margin: 0 auto;
  max-width: 60em;
}

h4 {
  margin-bottom: 0px;
}

label {
  margin-left: 2%;
}

.agree-btn {
  color: white;
  background-color: #2196f3;
  margin-top: 2%;
}

form .btn-container {
  text-align: center;
}

.revoke-consent-btn {
  background-color: red;
  color: white;
}

#consent-btns-container {
  display: flex;
  justify-content: space-between;
}
</style>
