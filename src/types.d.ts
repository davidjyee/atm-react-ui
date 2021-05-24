import { DateTime } from 'luxon';

export type UserId = number;

export interface User {
  id: UserId;
  name: string;
}

export type AccountId = number;

export interface Account {
  id: AccountId;
  type: string;
  name: string;
  owner: UserId;
  accessors: Array<UserId>;
  transactions: Array<TransactionId>;
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
