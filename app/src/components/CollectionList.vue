<template>
  <ion-list v-show="!isContentLoading">
    <ion-item
      v-for="album in collection"
      :key="album.id"
      :button="buttons"
      @click="if (buttons) $emit('item-click', album.id);"
    >
      <ion-img class="w-20 py-2" :src="album.expand?.master.imageUrl" />
      <ion-label class="pl-4">
        <h3 class="m-0">{{ album.expand?.master.title }}</h3>
        <p class="m-0">{{ album.expand?.master.artist }}</p>
      </ion-label>
    </ion-item>
  </ion-list>

  <div v-show="isContentLoading" class="flex justify-center items-center w-full h-[80%]">
    <ion-spinner name="lines-sharp" />
  </div>
</template>

<script setup lang="ts">
import { Collections, CollectionsResponse, MastersResponse } from '@/types/pocketbase-types';
import pb from '@/util/pocketbase';
import { Preferences } from '@capacitor/preferences';
import { IonList, IonItem, IonImg, IonLabel } from '@ionic/vue';
import { onMounted, ref } from 'vue';

interface CollectionEntry extends CollectionsResponse<{ master: MastersResponse }> {}

defineProps<{ buttons?: boolean }>();
defineEmits<{ (e: 'item-click', id: string): void }>();

const isContentLoading = ref(false);

const collection = ref<CollectionEntry[]>();

const refresh = async (reload: boolean = false) => {
  isContentLoading.value = true;
  if (reload) await reloadCollection();
  const storedCollection = await Preferences.get({ key: 'collection' });
  collection.value = JSON.parse(storedCollection.value ?? '[]') as CollectionsResponse<{ master: MastersResponse }>[];
  isContentLoading.value = false;
};

defineExpose({ refresh });

const reloadCollection = async () => {
  const fetchedCollection = await pb
    .collection(Collections.Collections)
    .getFullList<
      CollectionsResponse<{ master: MastersResponse }>
    >({ filter: `user = "${pb.authStore.model!.id}"`, expand: 'master', sort: 'master.title' });

  Preferences.set({ key: 'collection', value: JSON.stringify(fetchedCollection) });
};

onMounted(() => {
  refresh();
});
</script>
