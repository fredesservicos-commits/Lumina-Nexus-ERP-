import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type WhereFilterOp,
} from "firebase/firestore";
import { app } from "./index";

export const db = getFirestore(app);

export function createDoc(collectionName: string, data: DocumentData) {
  return addDoc(collection(db, collectionName), data);
}

export function listDocs(collectionName: string) {
  return getDocs(collection(db, collectionName));
}

export function queryDocs(
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: unknown,
) {
  const q = query(collection(db, collectionName), where(field, operator, value));
  return getDocs(q);
}
