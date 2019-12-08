import * as admin from 'firebase-admin';
import sha256 from 'sha256';

const db = admin.firestore();

const keysCollection = db.collection('keys');

export const CreateKey = async (value: string, days: number) => {
    try {
        const hash = sha256(value);
        await keysCollection.doc(hash.toString()).set({
            valid: true,
            days
        });
        return hash;
    } catch (error) {
        throw error;
    }
}

export const GetKey = async (hash: string) => {
    try {
        const key = await keysCollection.doc(hash).get();
        if(key.exists) return key.data() as {valid: boolean, days: number}
        return false;
    } catch (error) {
        throw error;
    }
}


export const CloseKey = async (hash: string) => {
    try {
        await keysCollection.doc(hash).update({
            valid: false,
        });
    } catch (error) {
        throw error;
    }
}
