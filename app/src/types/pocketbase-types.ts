/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
  Collections = 'collections',
  History = 'history',
  Masters = 'masters',
  Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type CollectionsRecord = {
  master?: RecordIdString;
  user?: RecordIdString;
};

export type HistoryRecord = {
  field?: RecordIdString;
  user?: RecordIdString;
};

export type MastersRecord = {
  artist?: string;
  discogsId: number;
  imageUrl?: string;
  title?: string;
};

export type UsersRecord = {
  discogsUsername?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type CollectionsResponse<Texpand = unknown> = Required<CollectionsRecord> & BaseSystemFields<Texpand>;
export type HistoryResponse<Texpand = unknown> = Required<HistoryRecord> & BaseSystemFields<Texpand>;
export type MastersResponse<Texpand = unknown> = Required<MastersRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  collections: CollectionsRecord;
  history: HistoryRecord;
  masters: MastersRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  collections: CollectionsResponse;
  history: HistoryResponse;
  masters: MastersResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: 'collections'): RecordService<CollectionsResponse>;
  collection(idOrName: 'history'): RecordService<HistoryResponse>;
  collection(idOrName: 'masters'): RecordService<MastersResponse>;
  collection(idOrName: 'users'): RecordService<UsersResponse>;
};
