import { Injectable, inject } from '@angular/core';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  Firestore,
  Unsubscribe,
  DocumentReference,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Article, ArticleComment } from '../models/article.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private firestore: Firestore;
  private articlesRef;

  constructor() {
    const fb = inject(FirebaseService);
    this.firestore = fb.firestore;
    this.articlesRef = collection(this.firestore, 'articles');
  }

  getAll(): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      const q = query(this.articlesRef, orderBy('createdAt', 'desc'));
      const unsubscribe: Unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Article);
          observer.next(items);
        },
        (error) => observer.error(error)
      );
      return { unsubscribe };
    });
  }

  getById(id: string): Observable<Article> {
    return new Observable<Article>((observer) => {
      const docRef = doc(this.firestore, 'articles', id);
      const unsubscribe: Unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next({ id: snapshot.id, ...snapshot.data() } as Article);
          } else {
            observer.error(new Error('Article not found'));
          }
        },
        (error) => observer.error(error)
      );
      return { unsubscribe };
    });
  }

  async add(article: Article): Promise<void> {
    await addDoc(this.articlesRef, article);
  }

  async update(id: string, data: Partial<Article>): Promise<void> {
    const docRef = doc(this.firestore, 'articles', id);
    await updateDoc(docRef, data);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'articles', id);
    await deleteDoc(docRef);
  }

  getComments(articleId: string): Observable<ArticleComment[]> {
    return new Observable<ArticleComment[]>((observer) => {
      const ref = this.commentsFor(articleId);
      const q = query(ref, orderBy('createdAt', 'asc'));
      const unsubscribe: Unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ArticleComment);
          observer.next(items);
        },
        (error) => observer.error(error)
      );
      return { unsubscribe };
    });
  }

  async addComment(articleId: string, comment: Partial<ArticleComment>): Promise<string> {
    const ref = this.commentsFor(articleId);
    const docRef: DocumentReference = await addDoc(ref, comment);
    return docRef.id;
  }

  deleteComment(articleId: string, commentId: string): Promise<void> {
    const commentRef = doc(this.firestore, `articles/${articleId}/comments`, commentId);
    return deleteDoc(commentRef);
  }

  private commentsFor(articleId: string) {
    return collection(this.firestore, `articles/${articleId}/comments`);
  }
}