// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// interface data
export interface Recipe {
    id?: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const firestoreService = {
    // get collection ref for all users
    getGlobalRecipeRef() {
        return collection(db, 'recipes');
    },

    // create
    async addRecipeGlobal(recipe: Omit<Recipe, 'id'>) {
        try {
            const recipeRef = this.getGlobalRecipeRef();
            const docRef = await addDoc(recipeRef, {
                ...recipe,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Recipe:', error);
            throw error;
        }
    },

    async getGlobalRecipes(): Promise<Recipe[]> {
        try {
            const recipeRef = this.getGlobalRecipeRef();
            const q = query(recipeRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Recipe));
        } catch (error) {
            console.error('Error Get Recipes:', error);
            throw error;
        }
    },

		// update
    async updateRecipe(id: string, recipe: Partial<Recipe>) {
        try {
            const recipeRef = this.getGlobalRecipeRef();
            const docRef = doc(recipeRef, id);
            await updateDoc(docRef, {
                ...recipe,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Recipe:', error);
            throw error;
        }
    },

		// delete
    async deleteRecipe(id: string) {
        try {
            const recipeRef = this.getGlobalRecipeRef();
            const docRef = doc(recipeRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Recipe:', error);
            throw error;
        }
    },

		// update status
    async updateStatus(id: string, status: boolean) {
        try {
            const recipeRef = this.getGlobalRecipeRef();
            const docRef = doc(recipeRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }

}