import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, type DocumentData } from "firebase/firestore";
import { app } from "./index";

export const db = getFirestore(app);

export function createDoc(collectionName: string, data: DocumentData) {
  return addDoc(collection(db, collectionName), data);
}

export function listDocs(collectionName: string) {
  return getDocs(collection(db, collectionName));
}

export function queryDocs(collectionName: string, field: string, operator: any, value: any) {
  const q = query(collection(db, collectionName), where(field, operator, value));
  return getDocs(q);
}
