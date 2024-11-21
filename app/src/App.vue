<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import pb from './util/pocketbase';
import { onMounted } from 'vue';

const router = useIonRouter();

onMounted(() => {
  if (!pb.authStore.isValid) router.navigate('/login', 'none', 'replace');
});
</script>
