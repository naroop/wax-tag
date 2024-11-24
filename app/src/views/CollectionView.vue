<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Collection</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large"> Collection </ion-title>
          <ion-buttons slot="end" class="mt-1 mr-2">
            <ion-button @click="handleSync">
              <ion-icon size="large" color="primary" :icon="sync" aria-label="Sync" />
            </ion-button>
            <ion-button @click="ionRouter.push('/profile')">
              <ion-icon size="large" color="primary" :icon="personOutline" aria-label="Profile" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Collections, CollectionsResponse, MastersRecord, MastersResponse } from '@/types/pocketbase-types';
import discogsApi from '@/util/discogs';
import pb from '@/util/pocketbase';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonRouter,
  IonButtons,
  IonButton,
  IonIcon,
  toastController
} from '@ionic/vue';
import axios from 'axios';
import { personOutline, sync } from 'ionicons/icons';

interface DiscogsMasterResponse {
  id: number;
  images: { uri: string }[];
  artists: { name: string }[];
  title: string;
}

const ionRouter = useIonRouter();

const handleSync = async () => {
  const storedCollection = await pb
    .collection(Collections.Collections)
    .getFullList<
      CollectionsResponse<{ master: MastersResponse }>
    >({ filter: `user = "${pb.authStore.model!.id}"`, expand: 'master' });
  console.log("Fetched user's collection. Found " + storedCollection.length + ' albums.');

  const storedDiscogsMasterIdsForUser = storedCollection.map((m) => m.expand?.master.discogsId);

  const releases = await discogsApi.get(`/users/${pb.authStore.model!.discogsUsername}/collection/folders/0/releases`);
  console.log("Fetched user's collection from Discogs. Found " + releases.data.releases.length + ' releases inside.');

  const discogsMasterIdsToFetch: number[] = releases.data.releases
    .filter((r: any) => !storedDiscogsMasterIdsForUser.some((masterId) => masterId === r.basic_information.master_id))
    .map((r: any) => r.basic_information.master_id);

  const masterIdsToAddToCollection: string[] = [];

  const filter = discogsMasterIdsToFetch.map((id) => `discogsId = "${id}"`).join(' || ');
  const storedMasters = await pb.collection('masters').getFullList({ filter });
  masterIdsToAddToCollection.push(...storedMasters.map((m) => m.id));

  const mastersRecordsToCreate: MastersRecord[] = [];

  const fetchWithRetry = async (id: number, delay = 8000): Promise<MastersRecord | null> => {
    try {
      const fetchedMaster = await discogsApi.get<DiscogsMasterResponse>(`/masters/${id}`);
      return {
        title: fetchedMaster.data.title,
        artist: fetchedMaster.data.artists.map((artist) => artist.name.replace(/\s*\(\d+\)$/, '')).join(', '),
        imageUrl: fetchedMaster.data.images[0].uri,
        discogsId: fetchedMaster.data.id
      } as MastersRecord;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          console.warn(`Network error for master id ${id}: ${error.message}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(id, delay < 20000 ? delay * 2 : 20000);
        } else if (error.response?.status === 429) {
          console.warn(`Rate limit hit for master id ${id}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(id, delay < 20000 ? delay * 2 : 20000);
        }
        console.error(`Axios error for master id ${id}:`, error.message);
      } else {
        console.error(`Unknown error for master id ${id}:`, error.message || error);
      }
      return null;
    }
  };

  const fetchMasterPromises = discogsMasterIdsToFetch
    .filter((id) => !storedMasters.some((storedMaster) => storedMaster.discogsId === id))
    .map((id) => fetchWithRetry(id));
  console.log('Need to fetch ' + fetchMasterPromises.length + ' masters from Discogs.');

  console.log('Fetching...');
  const fetchMasterResults = await Promise.all(fetchMasterPromises);
  console.log('Done.');

  mastersRecordsToCreate.push(...fetchMasterResults.filter((result): result is MastersRecord => result !== null));
  const createMastersResults: any[] = [];
  for (const master of mastersRecordsToCreate) {
    const result = await pb.collection(Collections.Masters).create(master, { requestKey: null });
    createMastersResults.push(result);
  }
  console.log('Finished creating new masters on our servers.');

  masterIdsToAddToCollection.push(...createMastersResults.map((result) => result.id));

  for (const id of masterIdsToAddToCollection) {
    await pb.collection(Collections.Collections).create({ user: pb.authStore.model!.id, master: id }, { requestKey: null });
  }
  console.log('Finished adding new entries to the collections table.');

  const toast = await toastController.create({
    message: 'Collection synced.',
    duration: 1500,
    color: 'success',
    position: 'bottom'
  });

  await toast.present();
};
</script>
