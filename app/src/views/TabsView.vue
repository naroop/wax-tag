<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/scan">
          <ion-icon aria-hidden="true" :icon="discSharp" />
          <ion-label>Scan</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/history">
          <ion-icon aria-hidden="true" :icon="calendar" />
          <ion-label>History</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/collection">
          <ion-icon aria-hidden="true" :icon="albums" />
          <ion-label>Collection</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { discSharp, albums, calendar } from 'ionicons/icons';
</script>
