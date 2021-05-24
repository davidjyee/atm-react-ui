import { DateTime } from 'luxon';

export type UserId = number;
export interface User {
  id: UserId;
  name: string;
}

export type AccessId = number;
export interface AccessInfo {
  id: AccessId;
  userId: UserId;
  accessLevel: number;
}

export type AccountId = number;
export interface Account {
  id: AccountId;
  routing: number;
  type: string;
  name: string;
  balance: number;
}

export type TransactionId = number;
export interface Transaction {
  id: TransactionId;
  origin: AccountId | null;
  destination: AccountId | null;
  initiator: UserId;
  type: string;
  time: DateTime;
  amount: number;
  note: string;
}
