import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: FirebaseApp;
  private _firestore: Firestore;
  private _auth: Auth | null = null;
  private _storage: FirebaseStorage | null = null;
  private readonly authEnabled = !environment.firebase.apiKey.startsWith('YOUR_');

  constructor() {
    this.app = initializeApp(environment.firebase);
    this._firestore = getFirestore(this.app);
    if (this.authEnabled) {
      this._auth = getAuth(this.app);
      this._storage = getStorage(this.app);
    }
  }

  get firestore(): Firestore {
    return this._firestore;
  }

  get auth(): Auth {
    if (!this.authEnabled) {
      throw new Error('Firebase Auth is not configured. Add a real API key in src/app/environment/environment.ts.');
    }
    return this._auth as Auth;
  }

  get storage(): FirebaseStorage {
    if (!this.authEnabled) {
      throw new Error('Firebase Storage is not configured. Add a real API key in src/app/environment/environment.ts.');
    }
    return this._storage as FirebaseStorage;
  }
}