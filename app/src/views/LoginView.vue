<template>
  <ion-page>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-card-title> Log In </ion-card-title>
          <form>
            <ion-input v-model="email" label="Email" label-placement="floating" type="email" inputmode="email" placeholder="e@mail.com" />
            <ion-input v-model="password" label="Password" label-placement="floating" type="password" inputmode="text" />
          </form>
          <ion-button class="mt-2" expand="block" fill="outline" @click="handleSubmit" color="success">Submit</ion-button>
          <ion-button class="mt-2" expand="block" fill="outline" @click="handleFetchAuth">Fetch Auth</ion-button>
          <ion-button class="mt-2" expand="block" fill="outline" @click="pb.authStore.clear()" color="danger">Clear Auth</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardTitle, IonInput, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import pb from '@/util/pocketbase';

// Types ------------------------------------------------------------------------------

// Component Info (props/emits) -------------------------------------------------------

// Template Refs ----------------------------------------------------------------------

// Variables --------------------------------------------------------------------------

// Reactive Variables -----------------------------------------------------------------
const email = ref('');
const password = ref('');
// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------

// Methods ----------------------------------------------------------------------------
const handleSubmit = async () => {
  await pb.collection('users').authWithPassword(email.value, password.value);
};

const handleFetchAuth = () => {
  console.log(pb.authStore.token);
  console.log(pb.authStore.isValid);
};
// Lifecycle Hooks --------------------------------------------------------------------
</script>
