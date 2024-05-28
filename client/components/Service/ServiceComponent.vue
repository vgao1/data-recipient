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

/*
section {
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  /* gap: 1em; */

p,
span {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  font-size: 18px;
}

h1 {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
}

.row {
  margin: 0 auto;
  /* max-width: 60em; */
  /* background-color: green; */
}

article {
  background-color: white;
  border-radius: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 2em;
  max-width: 22%;
  justify-content: space-between;
  margin: 2em;
  /* padding: 30px; */
  /* padding: 2em; */
  /* color: white; */
}

.services {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 2em;
  background-color: #caedce;
}

.logo-pic {
  max-height: 100px;
  width: auto;
}

.row {
  display: flex;
  margin: 0 auto;
  /* max-width: 60em; */
}

h4 {
  margin-bottom: 0px;
  font-size: 22px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  color: #156b12;
  letter-spacing: 1px;
}

label {
  margin-left: 2%;
}

.agree-btn {
  background-color: #156b12;
  color: #fcfbe1;
  margin-top: 2%;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 20px;
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
