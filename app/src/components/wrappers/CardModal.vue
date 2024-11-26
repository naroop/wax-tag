<template>
  <ion-modal ref="modal" :is-open="isOpen" :presenting-element="presentingElement" @did-dismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large"> {{ title }} </ion-title>
        </ion-toolbar>
      </ion-header>

      <slot></slot>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';
import { ref } from 'vue';

defineProps<{ title: string; presentingElement: HTMLElement }>();

const modal = ref({} as InstanceType<typeof IonModal>);

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open, close });
</script>
