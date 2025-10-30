/**
 * Firestore database utilities for CRUD operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryConstraint,
  type DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { FIREBASE_COLLECTIONS } from '@/lib/constants';
import type { BlogPost, Project, PaginatedResponse } from '@/lib/types';

/**
 * Generic function to get a document by ID
 */
export async function getDocumentById<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }

    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw new Error('Failed to get document');
  }
}

/**
 * Generic function to get all documents from a collection
 */
export async function getAllDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
  } catch (error) {
    console.error('Error getting documents:', error);
    throw new Error('Failed to get documents');
  }
}

/**
 * Generic function to create a document
 */
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
}

/**
 * Generic function to update a document
 */
export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
}

/**
 * Generic function to delete a document
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

/**
 * Get published blog posts with pagination
 */
export async function getBlogPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string
): Promise<PaginatedResponse<BlogPost>> {
  try {
    const constraints: QueryConstraint[] = [
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
    ];

    if (category) {
      constraints.push(where('category', '==', category));
    }

    const posts = await getAllDocuments<BlogPost>(
      FIREBASE_COLLECTIONS.posts,
      [...constraints, limit(pageSize * page)]
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: posts.length,
      page,
      limit: pageSize,
      totalPages: Math.ceil(posts.length / pageSize),
    };
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw new Error('Failed to get blog posts');
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllDocuments<BlogPost>(
      FIREBASE_COLLECTIONS.posts,
      [where('slug', '==', slug), limit(1)]
    );

    return posts[0] || null;
  } catch (error) {
    console.error('Error getting blog post:', error);
    throw new Error('Failed to get blog post');
  }
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(count: number = 3): Promise<BlogPost[]> {
  try {
    return await getAllDocuments<BlogPost>(FIREBASE_COLLECTIONS.posts, [
      where('featured', '==', true),
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(count),
    ]);
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw new Error('Failed to get featured posts');
  }
}

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  try {
    return await getAllDocuments<Project>(FIREBASE_COLLECTIONS.projects, [
      orderBy('startDate', 'desc'),
    ]);
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new Error('Failed to get projects');
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(count: number = 6): Promise<Project[]> {
  try {
    return await getAllDocuments<Project>(FIREBASE_COLLECTIONS.projects, [
      where('featured', '==', true),
      orderBy('startDate', 'desc'),
      limit(count),
    ]);
  } catch (error) {
    console.error('Error getting featured projects:', error);
    throw new Error('Failed to get featured projects');
  }
}

/**
 * Search blog posts by title or content
 */
export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation. For production, consider using Algolia or Elasticsearch
    const posts = await getAllDocuments<BlogPost>(FIREBASE_COLLECTIONS.posts, [
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
    ]);

    const searchLower = searchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching blog posts:', error);
    throw new Error('Failed to search blog posts');
  }
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    return await getAllDocuments<BlogPost>(FIREBASE_COLLECTIONS.posts, [
      where('tags', 'array-contains', tag),
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
    ]);
  } catch (error) {
    console.error('Error getting posts by tag:', error);
    throw new Error('Failed to get posts by tag');
  }
}

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Convert Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}
