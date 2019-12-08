import * as admin from 'firebase-admin';  
const key = require('../../Credentials/firebaseKey.json');

admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: 'https://darwrna.firebaseio.com/'
});