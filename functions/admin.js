const functions = require('firebase-functions');

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
    return grantAdminRole(email)
    .then(() => {
        return {
            result: `Succes. ${email} este administrator.`
        }
    }) 
})

exports.addRider = functions
.region('europe-west1')
.https.onCall(async (data, context) => {
    if (context.auth.token.rider !== true) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'numai administratorii au acces la aceasta functie.'
          );
    }
    const email = data.email
    return grantRiderRole(email)
    .then(() => {
        return {
            result: `Succes. ${email} este livrator.`
        }
    }) 
})

async function grantAdminRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.admin === true) {
        return null
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
        });
}

async function grantRiderRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.rider === true) {
        return null
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        rider: true
        });
}