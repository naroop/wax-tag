<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Scan" default-href="/scan" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large"> Settings </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list inset>
        <ion-item>
          <ion-input v-model="discogsApiKey" label="Discogs API Key" :maxlength="40" @ion-input="validateDiscogsApiKey" />
        </ion-item>
      </ion-list>
      <p class="px-6 text-xs">
        Retrieve your Discogs API key from your account to load images and authenticate with your collection.
      </p>

      <p class="px-6 text-xs">Your key never leaves your device.</p>

      <p class="px-6 mb-0 text-xs">Don't know how to find it?</p>
      <ol class="mt-2 text-xs">
        <li>Visit <a href="https://discogs.com">https://discogs.com</a> and sign in.</li>
        <li>Open the menu in the top right and select "Settings".</li>
        <li>Select "Developers" from the list of options on the left.</li>
        <li>If you don't already have a token, generate one.</li>
        <li>Copy your token and paste it into the input above.</li>
      </ol>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Preferences } from '@capacitor/preferences';
import {
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonInput,
  toastController
} from '@ionic/vue';
import { onMounted, ref } from 'vue';

const discogsApiKey = ref('');

const validateDiscogsApiKey = async () => {
  if (discogsApiKey.value.length === 40) {
    await Preferences.set({ key: 'discogsApiKey', value: discogsApiKey.value });
    const toast = await toastController.create({ message: 'Set Discogs API Key', duration: 1500 });
    toast.present();
  }
};

onMounted(async () => {
  discogsApiKey.value = (await Preferences.get({ key: 'discogsApiKey' })).value ?? '';
});
</script>
