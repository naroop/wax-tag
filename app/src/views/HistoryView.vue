<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>History</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large"> History </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <history-list ref="historyList" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import HistoryList from '@/components/HistoryList.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  RefresherCustomEvent,
  IonRefresherContent
} from '@ionic/vue';
import { ref } from 'vue';

const historyList = ref({} as InstanceType<typeof HistoryList>);

const handleRefresh = async (event: RefresherCustomEvent) => {
  await historyList.value.refresh(true);
  event.target.complete();
};
</script>
