<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Collection" default-href="/collection" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large"> Profile </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list inset>
        <ion-item>
          <ion-input v-model="email" label="Email" disabled />
        </ion-item>
        <ion-item>
          <ion-input v-model="username" label="Username" />
        </ion-item>
        <ion-item>
          <ion-input v-model="discogsUsername" label="Discogs Username" />
        </ion-item>
      </ion-list>

      <ion-list inset>
        <ion-item button :detail="false" :disabled="!isUpdateProfileDisabled" @click="handleUpdateProfile">
          <ion-label color="primary">Update Profile</ion-label>
        </ion-item>
        <ion-item button :detail="false" @click="handleSignOut">
          <ion-label color="danger">Sign Out</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
  IonLabel,
  useIonRouter,
  toastController
} from '@ionic/vue';
import pb from '@/util/pocketbase';
import { computed, onMounted, ref } from 'vue';

const email = ref('');

const username = ref('');
const ogUsername = ref('');

const discogsUsername = ref('');
const ogDiscogsUsername = ref('');

const isUpdateProfileDisabled = computed(() => {
  return username.value !== ogUsername.value || discogsUsername.value !== ogDiscogsUsername.value;
});

const ionRouter = useIonRouter();

const handleUpdateProfile = () => {
  pb.collection('users')
    .update(pb.authStore.model!.id, {
      username: username.value,
      discogsUsername: discogsUsername.value
    })
    .then(async () => {
      ogUsername.value = username.value;
      ogDiscogsUsername.value = discogsUsername.value;

      const toast = await toastController.create({
        message: 'Account updated.',
        duration: 1500,
        color: 'success',
        position: 'bottom'
      });

      await toast.present();
    });
};

const handleSignOut = () => {
  pb.authStore.clear();
  ionRouter.replace('/login');
};

onMounted(() => {
  if (pb.authStore.model) {
    email.value = pb.authStore.model.email;
    username.value = pb.authStore.model.username;
    ogUsername.value = username.value;

    discogsUsername.value = pb.authStore.model.discogsUsername;
    ogDiscogsUsername.value = discogsUsername.value;
  } else {
    ionRouter.replace('/login');
  }
});
</script>
