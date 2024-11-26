<template>
  <ion-modal ref="modal" :is-open="isOpen" :presenting-element="presentingElement" @did-dismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">Close</ion-button>
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
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonToolbar,
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
import { Preferences } from '@capacitor/preferences';

defineProps<{ presentingElement: HTMLElement }>();

const modal = ref({} as InstanceType<typeof IonModal>);

const isOpen = ref(false);

const email = ref('');

const username = ref('');
const ogUsername = ref('');

const discogsUsername = ref('');
const ogDiscogsUsername = ref('');
const discogsApiKey = ref('');

const isUpdateProfileDisabled = computed(() => {
  return username.value !== ogUsername.value || discogsUsername.value !== ogDiscogsUsername.value;
});

const ionRouter = useIonRouter();

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open, close });

const validateDiscogsApiKey = async () => {
  if (discogsApiKey.value.length === 40) {
    await Preferences.set({ key: 'discogsApiKey', value: discogsApiKey.value });
    const toast = await toastController.create({ message: 'Set Discogs API Key', duration: 1500 });
    toast.present();
  }
};

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

onMounted(async () => {
  discogsApiKey.value = (await Preferences.get({ key: 'discogsApiKey' })).value ?? '';
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
