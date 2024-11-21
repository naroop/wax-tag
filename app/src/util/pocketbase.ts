import PocketBase, { AsyncAuthStore } from 'pocketbase';
import type { TypedPocketBase } from '@/types/pocketbase-types';
import { Preferences } from '@capacitor/preferences';

const authKey = 'pocketbase_auth';

const preferencesAsyncAuthStore = new AsyncAuthStore({
  save: async (serialized) => await Preferences.set({ key: authKey, value: serialized }),
  clear: async () => await Preferences.remove({ key: authKey })
});

const pb = new PocketBase('https://wax-tag-dev.pockethost.io/', preferencesAsyncAuthStore) as TypedPocketBase;

export const authStoreInit = async () => {
  const serialized = (await Preferences.get({ key: authKey })).value;
  const parsed = JSON.parse(serialized || '{}') || {};
  if (serialized) {
    pb.authStore.save(parsed.token || '', parsed.model || null);
  }
};

export default pb;
