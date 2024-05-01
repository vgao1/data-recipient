<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
    <div>
      <h1>Settings for {{ currentUsername }}</h1>
    </div>

  <main class="column">
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

.column{
  background-color: #fcfbe1;
  background-size: cover;
}

.pure-button{
  margin-top: 30px;
  margin-bottom: 10px;
}

.button-error{
  margin-top: 0px;
  margin-bottom: 0px;
}

</style>
