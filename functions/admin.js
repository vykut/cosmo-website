const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.addAdmin = functions
    .region('europe-west1')
    .https.onCall(async (data, context) => {
        if (!context.auth.token.admin) {
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
        if (!context.auth.token.admin) {
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

exports.scheduleWeekendTimetable = functions
    .region('europe-west1')
    .pubsub
    .schedule(`0 * * * 6,0`)
    .timeZone('Europe/Bucharest')
    .onRun(async ctx => {
        function convertTZ(date, tzString) {
            return new Date(date.toLocaleString("en-US", { timeZone: tzString }));
        }

        const convertedDate = convertTZ(new Date(), "Europe/Bucharest")
        const currentHour = convertedDate.getHours(); // 17

        const storeRef = admin.firestore().collection('stores').doc('CosmoMarket')
        return admin.firestore().runTransaction(async transaction => {
            const store = await transaction.get(storeRef)
            const storeData = store.data()

            if (storeData.isDisabled)
                return

            if (storeData.weekendOpenHour == currentHour) {
                return transaction.update(storeRef, { isOpen: true })
            }

            if (storeData.weekendCloseHour == currentHour) {
                return transaction.update(storeRef, { isOpen: false })
            }
            return
        })
    })

exports.scheduleWeekTimetable = functions
    .region('europe-west1')
    .pubsub
    .schedule(`0 * * * 1-5`)
    .timeZone('Europe/Bucharest')
    .onRun(async ctx => {
        function convertTZ(date, tzString) {
            return new Date(date.toLocaleString("en-US", { timeZone: tzString }));
        }

        const convertedDate = convertTZ(new Date(), "Europe/Bucharest")
        const currentHour = convertedDate.getHours(); // 17

        const storeRef = admin.firestore().collection('stores').doc('CosmoMarket')
        return admin.firestore().runTransaction(async transaction => {
            const store = await transaction.get(storeRef)
            const storeData = store.data()

            if (storeData.isDisabled)
                return

            if (storeData.openHour == currentHour) {
                return transaction.update(storeRef, { isOpen: true })
            }

            if (storeData.closeHour == currentHour) {
                return transaction.update(storeRef, { isOpen: false })
            }

            return
        })
    })