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

      <div>
        <ion-button @click="writeNfc" expand="block">Write</ion-button>
        {{ message }}
        <ion-button @click="readNfc" expand="block">Read</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { NFC, NDEFWriteOptions, NFCError } from '@exxili/capacitor-nfc';
import { ref } from 'vue';

const nfcMessage: NDEFWriteOptions = {
  records: [
    {
      type: 'T', // Text record type
      payload: 'Sgt Peppers Lonely Hearts Club Band'
    }
  ]
};

const message = ref('');

const readNfc = () => {
  NFC.startScan().catch((error) => {
    message.value = error;
  });
};

const writeNfc = () => {
  NFC.writeNDEF(nfcMessage)
    .then(() => {
      message.value = 'Write initiated';
    })
    .catch((error) => {
      message.value = 'Error writing to NFC tag:' + error;
    });
};

NFC.addListener('nfcTag', (data) => {
  message.value = data.messages[0].records[0].payload;
});

NFC.addListener('nfcError', (error: NFCError) => {
  message.value = 'something bad';
});
</script>
