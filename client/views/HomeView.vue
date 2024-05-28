<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ServiceComponent from "../components/Service/ServiceComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let loaded = ref(false);
let allServices = ref<Array<Record<string, string>>>([]);
let service = ref("");
let purpose = ref("");
let logoURL = ref("");
let data_provider = ref("");

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

const requiredFields = ref([{ value: "" }]);
const optionalFields = ref([{ value: "" }]);

const addRequiredField = () => {
  requiredFields.value.push({ value: "" });
};

const removeRequiredField = (index: number) => {
  requiredFields.value.splice(index, 1);
};

const addOptionalField = () => {
  optionalFields.value.push({ value: "" });
};

const removeOptionalField = (index: number) => {
  optionalFields.value.splice(index, 1);
};

async function addService() {
  let required_data: string[] = [];
  let optional_data: string[] = [];

  if (!(requiredFields.value.length == 1 && requiredFields.value[0].value === "")) {
    requiredFields.value.forEach((field) => {
      required_data.push(field.value);
    });
  }
  if (!(optionalFields.value.length == 1 && optionalFields.value[0].value === "")) {
    optionalFields.value.forEach((field) => {
      optional_data.push(field.value);
    });
  }

  try {
    await fetchy(`/api/addService`, "POST", {
      body: { service: service.value, purpose: purpose.value, data_provider: data_provider.value, required_data, optional_data, logoURL: logoURL.value },
    });
    service.value = "";
    purpose.value = "";
    data_provider.value = "";
    required_data = [];
    optional_data = [];
    logoURL.value = "";
    return;
  } catch {
    return;
  }
}

onBeforeMount(async () => {
  await getServices();
  loaded.value = true;
});
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <div v-if="isLoggedIn">
        <h2>Welcome, {{ currentUsername }}!</h2>
        <div v-if="loaded && currentUsername !== 'admin'" class="service-container row">
          <ServiceComponent :allServices="allServices" />
        </div>
        <div v-else-if="loaded">
          <form class="pure-form pure-form-aligned" @submit.prevent="addService">
            <h3>Add a Service</h3>
            <fieldset>
              <div class="pure-control-group">
                <label for="aligned-name">Service Name</label>
                <input v-model.trim="service" type="text" id="aligned-name" required />
              </div>
              <div class="pure-control-group">
                <label for="aligned-provider">Data Provider</label>
                <input type="text" v-model.trim="data_provider" id="aligned-provider" required />
              </div>
              <div class="pure-control-group">
                <label for="aligned-purpose">Purpose</label>
                <input type="text" v-model.trim="purpose" id="aligned-purpose" required />
              </div>
              <div class="pure-control-group">
                <label for="aligned-logo">Logo URL</label>
                <input type="text" v-model.trim="logoURL" id="aligned-logo" required />
              </div>
              <div id="required-fields-input">
                <label>Required Data</label>
                <div v-for="(field, index) in requiredFields" :key="index">
                  <input type="text" v-model="field.value" placeholder="Required Field Name" required />
                  <button type="button" class="plus-button" @click="addRequiredField">+</button>
                  <button v-if="requiredFields.length > 1" type="button" class="minus-button" @click="removeRequiredField(index)">-</button>
                </div>
              </div>
              <div id="optional-fields-input">
                <label>Optional Data</label>
                <div v-for="(field, index) in optionalFields" :key="index">
                  <input type="text" v-model="field.value" placeholder="Optional Field Name" />
                  <button type="button" class="plus-button" @click="addOptionalField">+</button>
                  <button v-if="optionalFields.length > 1" type="button" class="minus-button" @click="removeOptionalField(index)">-</button>
                </div>
              </div>
              <div class="pure-controls">
                <button type="submit" class="pure-button pure-button-primary">Add Service</button>
              </div>
            </fieldset>
          </form>
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
  color: #156b12;
  font-size: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  /* max-width: 60em; */
  background-color: #fcfbe1;
}

div {
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

#required-fields-input,
#optional-fields-input {
  text-align: center;
}
</style>
