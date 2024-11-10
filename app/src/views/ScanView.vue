<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Scan</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Scan</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-input class="ml-4" label="Discogs API Key" label-placement="floating" v-model="text" helper-text="" />
      <ion-button class="mt-5" expand="block" fill="outline" @click="submit">Submit</ion-button>
      {{ fetched }}
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonButton } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

const text = ref('');
const fetched = ref<string | null>('');

const submit = async () => {
  await Preferences.set({ key: 'discogsKey', value: text.value });
  fetched.value = text.value;
};

onMounted(async () => {
  fetched.value = (await Preferences.get({ key: 'discogsKey' })).value;
});
</script>
