<template>
  <ion-list v-show="!isContentLoading">
    <ion-item-group v-for="day in history" :key="day.day">
      <ion-item-divider>
        <ion-label> {{ formatToLongDate(new Date(day.day)) }} </ion-label>
      </ion-item-divider>
      <ion-item
        v-for="entry in day.entries"
        :key="entry.id"
        :button="buttons"
        @click="if (buttons) $emit('item-click', entry.id);"
      >
        <ion-img class="w-20 py-2" :src="entry.expand?.master.imageUrl" />
        <div class="flex items-center justify-between w-[75%] pl-4">
          <ion-label>
            <h3>{{ entry.expand?.master.title }}</h3>
            <p>{{ entry.expand?.master.artist }}</p>
          </ion-label>
          <ion-label>
            <p>{{ formatDate(new Date(entry.created)) }}</p>
          </ion-label>
        </div>
      </ion-item>
    </ion-item-group>
  </ion-list>

  <div v-show="isContentLoading" class="flex justify-center items-center w-full h-[80%]">
    <ion-spinner name="lines-sharp" />
  </div>
</template>

<script setup lang="ts">
import { Collections, HistoryResponse, MastersResponse } from '@/types/pocketbase-types';
import { DaySortedEntry, formatDate, formatToLongDate, groupByDay } from '@/util/dates';
import pb from '@/util/pocketbase';
import { Preferences } from '@capacitor/preferences';
import { IonList, IonItem, IonImg, IonLabel, IonItemGroup, IonItemDivider } from '@ionic/vue';
import { onMounted, ref } from 'vue';

interface HistoryEntry extends HistoryResponse<{ master: MastersResponse }> {}

defineProps<{ buttons?: boolean }>();
defineEmits<{ (e: 'item-click', id: string): void }>();

const isContentLoading = ref(false);

const history = ref<DaySortedEntry<HistoryEntry>[]>();

const refresh = async (reload: boolean = false) => {
  isContentLoading.value = true;
  if (reload) await reloadHistory();
  const storedHistory = JSON.parse((await Preferences.get({ key: 'history' })).value ?? '[]') as HistoryResponse<{
    master: MastersResponse;
  }>[];
  history.value = groupByDay(storedHistory);
  isContentLoading.value = false;
};

defineExpose({ refresh });

const reloadHistory = async () => {
  const fetchedHistory = await pb
    .collection(Collections.History)
    .getFullList<
      HistoryResponse<{ master: MastersResponse }>
    >({ filter: `user = "${pb.authStore.model!.id}"`, expand: 'master', sort: '-created' });

  Preferences.set({ key: 'history', value: JSON.stringify(fetchedHistory) });
};

onMounted(() => {
  refresh();
});
</script>
