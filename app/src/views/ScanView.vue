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

      <ion-button expand="block" @click="readNfc"> Read </ion-button>
    </ion-content>

    <write-nfc-modal ref="modal" :presenting-element="$el" />
  </ion-page>
</template>

<script setup lang="ts">
import WriteNfcModal from '@/components/WriteNfcModal.vue';
import { Collections } from '@/types/pocketbase-types';
import pb from '@/util/pocketbase';
import { NFC } from '@exxili/capacitor-nfc';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref } from 'vue';

const modal = ref({} as InstanceType<typeof WriteNfcModal>);

const readNfc = () => {
  NFC.startScan().catch(console.error);
};

const createHistoryRecord = async (masterId: string) => {
  if (masterId.length != 15) {
    const toast = await toastController.create({
      message: 'Tag data is not compatible.',
      duration: 1500,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
    return;
  }

  pb.collection(Collections.History)
    .create({ user: pb.authStore.model?.id, master: masterId })
    .then(async () => {
      const toast = await toastController.create({
        message: 'Listen recorded.',
        duration: 1500,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    });
};

NFC.addListener('nfcTag', async (data) => {
  createHistoryRecord(data.messages[0].records[0].payload);
});

NFC.addListener('nfcError', console.error);
</script>
