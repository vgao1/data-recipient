<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
let loaded = ref(false);
let isDataProvider = ref(false);

onBeforeMount(async () => {
  await checkDataProvider();
  loaded.value = true;
});

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

async function checkDataProvider() {
  try {
    isDataProvider.value = await fetchy(`/api/dataProvider/${currentUsername.value}`, "GET");
    return;
  } catch {
    return;
  }
}

async function processRequest() {
  try {
    await fetchy(`/api/dataProvider`, "POST", {
      body: { username: currentUsername.value },
    });
    return;
  } catch {
    return;
  }
}

async function processResponse() {
  try {
    await fetchy(`/api/dataRecipientAdmin`, "POST");
    return;
  } catch {
    return;
  }
}
</script>

<template>
  <div>
    <h1>Settings for {{ currentUsername }}</h1>
  </div>

  <main class="column">
    <button v-if="isDataProvider" class="pure-button" id="process-request-btn" @click="processRequest">Process Data Requests</button>
    <button v-if="currentUsername === 'admin'" class="pure-button" id="process-response-btn" @click="processResponse">Process Data Responses</button>
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  background-color: #156b12;
  color: white;
  padding: 12px;
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1px;
}

.column {
  background-color: #fcfbe1;
  background-size: cover;
}

.pure-button {
  margin-bottom: 10px;
}

.button-error {
  margin-top: 0px;
  margin-bottom: 0px;
}

#process-request-btn,
#process-response-btn {
  margin-top: 30px;
}
</style>
