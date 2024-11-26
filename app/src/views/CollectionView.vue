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
              <ion-icon v-if="!isSyncLoading" size="large" color="primary" :icon="sync" aria-label="Sync" />
              <ion-spinner v-else name="lines-sharp" />
            </ion-button>
            <ion-button @click="profileModal.open()">
              <ion-icon size="large" color="primary" :icon="personOutline" aria-label="Profile" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <collection-list ref="collectionList" />
    </ion-content>

    <profile-modal ref="profileModal" :presenting-element="$el" />
  </ion-page>
</template>

<script setup lang="ts">
import CollectionList from '@/components/CollectionList.vue';
import ProfileModal from '@/components/ProfileModal.vue';
import { Collections, CollectionsResponse, MastersRecord, MastersResponse } from '@/types/pocketbase-types';
import discogsApi from '@/util/discogs';
import pb from '@/util/pocketbase';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  toastController
} from '@ionic/vue';
import axios from 'axios';
import { personOutline, sync } from 'ionicons/icons';
import { ref } from 'vue';

interface DiscogsMasterResponse {
  id: number;
  images: { uri: string }[];
  artists: { name: string }[];
  title: string;
}

const profileModal = ref({} as InstanceType<typeof ProfileModal>);
const collectionList = ref({} as InstanceType<typeof CollectionList>);

const isSyncLoading = ref(false);

const handleSync = async () => {
  const onFunctionEnd = async () => {
    const toast = await toastController.create({
      message: 'Collection synced.',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
    collectionList.value.reload(true);
    isSyncLoading.value = false;
  };

  isSyncLoading.value = true;
  const fetchedCollection = await pb
    .collection(Collections.Collections)
    .getFullList<
      CollectionsResponse<{ master: MastersResponse }>
    >({ filter: `user = "${pb.authStore.model!.id}"`, expand: 'master' });
  const idsInCollection = fetchedCollection.map((m) => m.expand?.master.discogsId);
  console.log("Fetched user's collection. Found " + idsInCollection.length + ' albums.');

  const releasesInDiscogsCollection = await discogsApi.get(
    `/users/${pb.authStore.model!.discogsUsername}/collection/folders/0/releases`
  );
  const idsInDiscogsCollection: number[] = releasesInDiscogsCollection.data.releases.map(
    (r: any) => r.basic_information.master_id
  );
  console.log("Fetched user's collection from Discogs. Found " + idsInDiscogsCollection.length + ' releases inside.');

  const missingIds: number[] = idsInDiscogsCollection.filter((id) => !idsInCollection.includes(id));

  if (!missingIds.length) {
    onFunctionEnd();
    return;
  }

  const masterIdsToAddToCollection: string[] = [];

  const filter = missingIds.map((id) => `discogsId = "${id}"`).join(' || ');
  const missingMastersFoundInMastersTable = await pb.collection('masters').getFullList({ filter });
  const idsFoundInMastersTable = missingMastersFoundInMastersTable.map((m) => m.discogsId);
  masterIdsToAddToCollection.push(...missingMastersFoundInMastersTable.map((m) => m.id));

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

  const fetchMasterPromises = missingIds
    .filter((id) => !idsFoundInMastersTable.includes(id))
    .map((id) => fetchWithRetry(id));
  console.log('Need to fetch ' + fetchMasterPromises.length + ' masters from Discogs.');

  if (fetchMasterPromises.length > 0) {
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
  }

  for (const id of masterIdsToAddToCollection) {
    await pb.collection(Collections.Collections).create({ user: pb.authStore.model!.id, master: id }, { requestKey: null });
  }
  console.log('Finished adding new entries to the collections table.');

  onFunctionEnd();
};
</script>
