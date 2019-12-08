import * as admin from 'firebase-admin';

const db = admin.firestore();

const userCollection = db.collection('users');

import {IUser} from '../Types/User';

export const CreateUser = async (chatid: number, username: string) => {
    try {
        await userCollection.doc(username).set({
            state: 'FIRST_KEY_PENDING',
            chatid,
            username
        });
    } catch (error) {
        throw error;
    }
}

export const GetUserByUsername = async (username: string) => {
    try {
        const user = await userCollection.doc(username).get();
        if(user.exists){
            return user.data() as IUser;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export const UpdateUserDays = async (user: IUser, days: number) => {
    try {
        await userCollection.doc(user.username).update({
            activeDays: user.activeDays ? user.activeDays + days : days
        });
    } catch (error) {
        throw error;
    }
}

export const UpdateUserState = async (user: IUser) => {
    try {
        await userCollection.doc(user.username).update({
            state: user.state
        });
    } catch (error) {
        throw error;
    }
}

export const UpdateUserApiKey = async (user: IUser) => {
    try {
        await userCollection.doc(user.username).update({
            apiKey: user.apiKey
        });
    } catch (error) {
        throw error;
    }
}

export const UpdateUserApiSecret = async (user: IUser) => {
    try {
        await userCollection.doc(user.username).update({
            apiSecret: user.apiSecret
        });
    } catch (error) {
        throw error;
    }
}