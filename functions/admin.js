const functions = require('firebase-functions');
const admin = require('firebase-admin');


exports.addAdmin = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        if (context.auth.token.admin !== true) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'numai administratorii au acces la aceasta functie.'
            );
        }
        const email = data.email
        const user = await admin.auth().getUserByEmail(email);
        if (user.customClaims && user.customClaims.admin === true) {
            return null
        }
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    })

exports.addRider = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        if (context.auth.token.admin !== true) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'numai administratorii au acces la aceasta functie.'
            );
        }
        const email = data.email
        const user = await admin.auth().getUserByEmail(email);
        if (user.customClaims && user.customClaims.rider === true) {
            return null
        }
        return admin.auth().setCustomUserClaims(user.uid, {
            rider: true
        });
    })