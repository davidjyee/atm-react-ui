import { DateTime } from 'luxon';

export type UserId = number;
export interface User {
  id: UserId;
  name: string;
}

export type AccessId = number;
export type AccessLevel = number;
export interface AccessInfo {
  id: AccessId;
  userId: UserId;
  accountId: AccountId;
  accessLevel: AccessLevel;
}

export type AccountId = number;
export type RoutingNumber = number;
export interface Account {
  id: AccountId;
  routing: RoutingNumber;
  type: string;
  name: string;
  balance: number;
}

export type TransactionId = number;
export interface Transaction {
  id: TransactionId;
  origin: RoutingNumber | null;
  destination: RoutingNumber | null;
  initiator: UserId;
  type: string;
  time: DateTime;
  amount: number;
  note: string;
}
