const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { CloudTasksClient } = require('@google-cloud/tasks')
var moment = require('moment-timezone');
moment.tz.add("Europe/Bucharest|BMT EET EEST|-1I.o -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1xApI.o 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Axc0 On0 1fA0 1a10 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|19e5",)
moment = moment.tz.setDefault('Europe/Bucharest');

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

export const onSetTimetable =
    functions
        .region('europe-west1')
        .firestore.document('/stores/CosmoMarket')
        .onWrite(async (change, context) => {

            const oldData = change.before.data()
            const newData = change.after.data()

            const { oldOpenHour, oldCloseHour, oldWeekendOpenHour, oldWeekendCloseHour } = oldData
            const { newOpenHour, newCloseHour, newWeekendOpenHour, newWeekendCloseHour } = newData

            //if store is closed explictly by admin // always open // timetable // always closed
            //return

            if (oldOpenHour === newOpenHour && oldCloseHour === newCloseHour)
                return

            const tasksClient = new CloudTasksClient()
            const project = 'cosmo-market'
            const location = 'europe-west1'


            if (oldOpenHour !== newOpenHour) {
                const queue = 'cosmo-timetable-open'
                const queuePath = tasksClient.queuePath(project, location, queue)

                const newOpenHourMoment = moment(newOpenHour, 'HH')
                const now = moment()

                const diff = newOpenHourMoment.diff(now, 'seconds')

                var seconds
                if (diff > 0) {
                    seconds = diff
                } else {
                    newOpenHourMoment.add(1, 'days')
                    seconds = newOpenHourMoment.diff(now, 'seconds')
                }

                const url = `https://${location}-${project}.cloudfunctions.net/openCosmoMarket`
                const payload = { openingDate: newOpenHourMoment.toDate() }

                const task = {
                    httpRequest: {
                        httpMethod: 'POST',
                        url,
                        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                    scheduleTime: {
                        seconds
                    }
                }

                const [response] = await tasksClient.createTask({ parent: queuePath, task })

                const openTask = response.name
                await change.after.ref.update({ openingTimeTaskName: openTask })
            }

            if (oldCloseHour !== newCloseHour) {
                const queue = 'cosmo-timetable-close'
                const queuePath = tasksClient.queuePath(project, location, queue)

                const newCloseHourMoment = moment(newCloseHour, 'HH')
                const now = moment()

                const diff = newCloseHourMoment.diff(now, 'seconds')

                var seconds
                if (diff > 0) {
                    seconds = diff
                } else {
                    newOpenHourMoment.add(1, 'days')
                    seconds = newOpenHourMoment.diff(now, 'seconds')
                }

                const url = `https://${location}-${project}.cloudfunctions.net/closeCosmoMarket`
                const payload = { newCloseHour }
            }







            const task = {
                httpRequest: {
                    httpMethod: 'POST',
                    url,
                    body: Buffer.from(JSON.stringify(payload)).toString('base64'),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                scheduleTime: {
                    seconds: expirationAtSeconds
                }
            }

            const [response] = await tasksClient.createTask({ parent: queuePath, task })

            const expirationTask = response.name
            const update: ExpiringDocumentData = { expirationTask }
            await snapshot.ref.update(update)
        })


export const firestoreTtlCallback = functions.https.onRequest(async (req, res) => {
    const payload = req.body as ExpirationTaskPayload
    try {
        await admin.firestore().doc(payload.docPath).delete()
        res.send(200)
    }
    catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})


export const onUpdatePostCancelExpirationTask =
    functions.firestore.document('/posts/{id}').onUpdate(async change => {
        const before = change.before.data() as ExpiringDocumentData
        const after = change.after.data() as ExpiringDocumentData

        // Did the document lose its expiration?
        const expirationTask = after.expirationTask
        const removedExpiresAt = before.expiresAt && !after.expiresAt
        const removedExpiresIn = before.expiresIn && !after.expiresIn
        if (expirationTask && (removedExpiresAt || removedExpiresIn)) {
            const tasksClient = new CloudTasksClient()
            await tasksClient.deleteTask({ name: expirationTask })
            await change.after.ref.update({
                expirationTask: admin.firestore.FieldValue.delete()
            })
        }
    })