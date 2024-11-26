import { Preferences } from '@capacitor/preferences';
import pb from './pocketbase';
import { Collections, CollectionsResponse, MastersResponse } from '@/types/pocketbase-types';

export const reloadCollection = async () => {
  const fetchedCollection = await pb
    .collection(Collections.Collections)
    .getFullList<
      CollectionsResponse<{ master: MastersResponse }>
    >({ filter: `user = "${pb.authStore.model!.id}"`, expand: 'master', sort: 'master.title' });

  Preferences.set({ key: 'collection', value: JSON.stringify(fetchedCollection) });
};
