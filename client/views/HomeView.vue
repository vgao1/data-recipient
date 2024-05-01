<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ServiceComponent from "../components/Service/ServiceComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let loaded = ref(false);
let allServices = ref<Array<Record<string, string>>>([]);
let traceabilityCredentials = ref<Record<string, string>>({});
let mongoSRV = ref("");
let username = ref("");
let password = ref("");

async function getTraceabilityCredential() {
  try {
    const record = await fetchy(`/api/traceabilitycredentials`, "GET");
    traceabilityCredentials.value = record;
    loaded.value = true;
  } catch {
    return;
  }
}

async function getServices() {
  let serviceObjs = [];
  try {
    const services = await fetchy(`/api/services`, "GET");
    for (const service of services) {
      serviceObjs.push(service);
    }
  } catch {
    return;
  }
  allServices.value = serviceObjs;
}

const submitCredentials = async () => {
  try {
    await fetchy("/api/traceabilitycredentials", "POST", {
      body: { db_srv: mongoSRV.value, db_username: username.value, db_password: password.value },
    });
  } catch {
    return;
  }
  await getTraceabilityCredential();
};

onBeforeMount(async () => {
  await getServices();
  if (isLoggedIn.value) {
    await getTraceabilityCredential();
  } else {
    loaded.value = true;
  }
});
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <div v-if="isLoggedIn">
        <h2>Welcome, {{ currentUsername }}!</h2>
        <form v-if="Object.keys(traceabilityCredentials).length == 0" class="pure-form pure-form-aligned" @submit.prevent="submitCredentials">
          <h3>Traceability Database Credentials</h3>
          <fieldset>
            <div class="pure-control-group">
              <label>MongoDB SRV</label>
              <input type="text" v-model.trim="mongoSRV" required />
            </div>
            <div class="pure-control-group">
              <label for="aligned-name">Username</label>
              <input type="text" id="aligned-name" v-model.trim="username" required />
            </div>
            <div class="pure-control-group">
              <label for="aligned-password">Password</label>
              <input type="text" id="aligned-password" v-model.trim="password" required />
            </div>
            <div class="pure-controls">
              <button type="submit" class="pure-button pure-button-primary">Submit</button>
            </div>
          </fieldset>
        </form>
        <div v-else-if="loaded" class="service-container row">
          <ServiceComponent :allServices="allServices" />
        </div>
      </div>
      <h1 v-else-if="loaded">Please login!</h1>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  background-color: #156b12;
  color: white;
  padding: 12px;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1px;
}

h2 {
  text-align: center;
  background-color: #fcfbe1;
  margin-top: 0;
  margin-bottom: 0;
  letter-spacing: 1px;
  color:#156b12;
  font-size: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  /* max-width: 60em; */
  background-color: #fcfbe1;
}

div{
  background-color: #fcfbe1;
  padding: 20px;
}

h3 {
  text-align: center;
}

form {
  max-width: fit-content;
  margin: auto;
  label {
    width: 5em;
  }
  .pure-controls {
    margin: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
