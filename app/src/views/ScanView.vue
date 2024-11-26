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
          <ion-title size="large"> Scan </ion-title>
          <ion-buttons slot="end" class="mt-1 mr-2">
            <ion-button @click="modal.open">
              <ion-icon size="large" color="primary" :icon="add" aria-label="New Tag" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div>
        <ion-button expand="block" @click="readNfc"> Read </ion-button>
        {{ message }}
      </div>
    </ion-content>

    <write-nfc-modal ref="modal" :presenting-element="$el" />
  </ion-page>
</template>

<script setup lang="ts">
import WriteNfcModal from '@/components/WriteNfcModal.vue';
import { NFC } from '@exxili/capacitor-nfc';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref } from 'vue';

const modal = ref({} as InstanceType<typeof WriteNfcModal>);

const message = ref('');

const readNfc = () => {
  NFC.startScan().catch((error) => {
    message.value = error;
  });
};

NFC.addListener('nfcTag', (data) => {
  message.value = data.messages[0].records[0].payload;
});

NFC.addListener('nfcError', () => {
  message.value = 'something bad';
});
</script>
