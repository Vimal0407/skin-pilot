import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function createUserDocIfMissing(user) {
  if (!user || !user.uid) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || null,
      phone: user.phoneNumber || null,
      name: null,
      height: null,
      weight: null,
      skinType: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}

export async function updateUserProfile(uid, patch) {
  if (!uid) throw new Error('uid required');
  const ref = doc(db, 'users', uid);
  // Overwrite the stored profile with the provided patch while preserving `createdAt` if present.
  const snap = await getDoc(ref);
  const createdAt = snap && snap.exists() ? snap.data().createdAt : serverTimestamp();
  await setDoc(ref, {
    uid,
    ...patch,
    createdAt,
    updatedAt: serverTimestamp()
  });
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
