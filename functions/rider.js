const functions = require('firebase-functions');

exports.assignOrder = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth && context.auth.token !== 'delivery') {
      return {
        error: 'Numai livratorii autentificati pot accepta comenzi'
      }
    }

    let orderRef = admin.firestore().collection('orders').doc(data.orderID)
    
    return admin.firestore().runTransaction(transaction => {
      let order = transaction.get(orderRef)
      let state = order.get('state')

      if(state === 'pending') {
        transaction.update(orderRef, {
          riderID: context.auth.uid,
          state: 'assigned'
        })
      }
    })
    .then(() => {
      return {
        result: `Comanda cu id-ul ${orderRef.id} a fost atribuita livratorului ${context.auth.uid}`
      }
    })
})

exports.completeOrder = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth && context.auth.token !== 'delivery') {
      return {
        error: 'Numai livratorii autentificati pot finaliza comenzi'
      }
    }

    let orderRef = admin.firestore().collection('orders').doc(data.orderID)

    return admin.firestore().runTransaction(transaction => {
      let order = transaction.get(orderRef)
      let state = order.get('state')

      if(state === 'assigned') {
        transaction.update(orderRef, {
          riderID: context.auth.uid,
          state: 'delivered'
        })
      }
    })
    .then(() => {
      return {
        result: `Comanda cu id-ul ${orderRef.id} a fost livrata de ${context.auth.uid}`
      }
    })
})

