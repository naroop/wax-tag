<template>
  <ion-page>
    <ion-content>
      <div class="flex flex-col justify-center h-[80%]">
        <div class="flex justify-center w-full">
          <ion-icon class="text-[64px]" :icon="lockOpenOutline" />
        </div>
        <ion-card>
          <ion-card-content>
            <ion-card-title> Log In </ion-card-title>
            <form>
              <ion-input
                v-model="email"
                label="Email"
                label-placement="stacked"
                type="email"
                inputmode="email"
                helper-text=" "
                placeholder="e@mail.com"
              />
              <ion-input
                v-model="password"
                label="Password"
                label-placement="stacked"
                type="password"
                inputmode="text"
                helper-text=" "
              >
                <ion-input-password-toggle slot="end" />
              </ion-input>
            </form>
            <ion-button class="mt-2 mb-4" expand="block" @click="handleSubmit"> Sign In </ion-button>
            <p class="text-center">Don't have an account? <a @click="router.push('/create-account')">Create one.</a></p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonCard,
  IonContent,
  IonCardContent,
  IonCardTitle,
  IonInput,
  IonButton,
  IonInputPasswordToggle,
  useIonRouter,
  IonIcon
} from '@ionic/vue';
import { lockOpenOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import pb from '@/util/pocketbase';

// Types ------------------------------------------------------------------------------

// Component Info (props/emits) -------------------------------------------------------

// Template Refs ----------------------------------------------------------------------

// Variables --------------------------------------------------------------------------

// Reactive Variables -----------------------------------------------------------------
const router = useIonRouter();
const email = ref('');
const password = ref('');
// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------

// Methods ----------------------------------------------------------------------------
const handleSubmit = async () => {
  await pb.collection('users').authWithPassword(email.value, password.value);

  if (pb.authStore.isValid) {
    router.push('/');
  }
};

// Lifecycle Hooks --------------------------------------------------------------------
onMounted(() => {
  if (pb.authStore.isValid) {
    router.push('/');
  }
});
</script>
