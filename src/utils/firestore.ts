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
export interface Toys {
    id?: string;
    nama: string;
    cerita: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const firestoreService = {
    // get collection ref for all users
    getGlobalToysRef() {
        return collection(db, 'toyss');
    },

    // create
    async addToysGlobal(toys: Omit<Toys, 'id'>) {
        try {
            const toysRef = this.getGlobalToysRef();
            const docRef = await addDoc(toysRef, {
                ...toys,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Toys:', error);
            throw error;
        }
    },

    async getGlobalToyss(): Promise<Toys[]> {
        try {
            const toysRef = this.getGlobalToysRef();
            const q = query(toysRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Toys));
        } catch (error) {
            console.error('Error Get Toyss:', error);
            throw error;
        }
    },

		// update
    async updateToys(id: string, toys: Partial<Toys>) {
        try {
            const toysRef = this.getGlobalToysRef();
            const docRef = doc(toysRef, id);
            await updateDoc(docRef, {
                ...toys,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Toys:', error);
            throw error;
        }
    },

		// delete
    async deleteToys(id: string) {
        try {
            const toysRef = this.getGlobalToysRef();
            const docRef = doc(toysRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Toys:', error);
            throw error;
        }
    },

		// update status
    async updateStatus(id: string, status: boolean) {
        try {
            const toysRef = this.getGlobalToysRef();
            const docRef = doc(toysRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }

}