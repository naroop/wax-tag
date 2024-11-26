<template>
  <card-modal ref="modal" title="New Tag" :presenting-element="presentingElement">
    <collection-list buttons @item-click="writeIdToTag" />
  </card-modal>
</template>

<script setup lang="ts">
import { NDEFWriteOptions, NFC } from '@exxili/capacitor-nfc';
import CollectionList from './CollectionList.vue';
import CardModal from './wrappers/CardModal.vue';
import { ref } from 'vue';

defineProps<{ presentingElement: HTMLElement }>();

const modal = ref({} as InstanceType<typeof CardModal>);

defineExpose({ open: () => modal.value.open(), close: () => modal.value.close() });

const writeIdToTag = (id: string) => {
  const nfcMessage: NDEFWriteOptions = {
    records: [{ type: 'T', payload: id }]
  };

  NFC.writeNDEF(nfcMessage)
    .then(() => {
      console.log('Written.');
    })
    .catch(() => {
      console.error('Error while writing.');
    });
};
</script>
