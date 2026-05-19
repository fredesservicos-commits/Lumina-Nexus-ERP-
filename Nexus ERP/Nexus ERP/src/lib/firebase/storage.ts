import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { app } from "./index";

export const storage = getStorage(app);

export function uploadFile(path: string, file: Blob | Uint8Array | ArrayBuffer) {
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, file);
}

export function getFileUrl(path: string) {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export function listFiles(prefix: string) {
  const storageRef = ref(storage, prefix);
  return listAll(storageRef);
}
