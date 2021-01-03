const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.assignOrder = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth && (context.auth.token !== 'delivery' || context.auth.token !== 'admin')) {
      return {
        error: 'Numai livratorii autentificati pot accepta comenzi'
      }
    }

    let orderRef = admin.firestore().collection('orders').doc(data.orderID)

    return admin.firestore().runTransaction(async transaction => {
      let order = await transaction.get(orderRef)
      let state = await order.get('state')

      if (state === 'pending') {
        return transaction.update(orderRef, {
          riderID: context.auth.uid,
          state: 'assigned'
        })
      }
    })
      .then(() => {
        console.log(`Comanda cu id-ul ${orderRef.id} a fost atribuita livratorului ${context.auth.uid}`)
        return {
          result: `Comanda a fost acceptata`
        }
      })
  })

exports.cancelDelivery = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth && (context.auth.token !== 'delivery' || context.auth.token !== 'admin')) {
      return {
        error: 'Numai livratorii autentificati pot anula livrarea'
      }
    }

    let orderRef = admin.firestore().collection('orders').doc(data.orderID)

    return admin.firestore().runTransaction(async transaction => {
      let order = await transaction.get(orderRef)
      let state = await order.get('state')

      if (state === 'assigned') {
        return transaction.update(orderRef, {
          riderID: '',
          state: 'pending'
        })
      }
    })
      .then(() => {
        console.log(`Livrarea comenzii cu id-ul ${orderRef.id} a fost anulata de livratorul ${context.auth.uid}`)
        return {
          result: `Livrarea a fost anulata cu succes`
        }
      })
  })

exports.completeOrder = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth && (context.auth.token !== 'delivery' || context.auth.token !== 'admin')) {
      return {
        error: 'Numai livratorii autentificati pot finaliza comenzi'
      }
    }

    let orderRef = admin.firestore().collection('orders').doc(data.orderID)
    let usersRef = admin.firestore().collection('users')


    return admin.firestore().runTransaction(async transaction => {
      let order = await transaction.get(orderRef)
      let state = order.data().state
      let userID = order.data().userID

      if (state === 'assigned') {
        return transaction.update(orderRef, {
          riderID: context.auth.uid,
          state: 'delivered'
        })
      }
    })
      .then(() => {
        console.log(`Comanda cu id-ul ${orderRef.id} a fost livrata de ${context.auth.uid}`)
        return {
          result: `Comanda a fost livrata.`
        }
      })
  })

exports.getOrders = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth && (context.auth.token !== 'delivery' || context.auth.token !== 'admin')) {
      return {
        error: 'Numai livratorii autentificati pot vedea lista de comenzi'
      }
    }

    let ordersRef = admin.firestore().collection('orders').where('state', '==', data.state)

    switch (data.state) {
      case 'pending':
        ordersRef = ordersRef
        break;
      case 'assigned':
      case 'delivered':
        ordersRef = ordersRef.where('riderID', '==', context.auth.uid)
        break;
    }

    ordersRef = ordersRef.orderBy('createdAt', 'desc')

    let addressRef = admin.firestore().collection('addresses')
    let usersRef = admin.firestore().collection('users')
    let orders = []

    let ordersSnapshot = await ordersRef.get()
    for (const order of ordersSnapshot.docs) {
      let addressDoc = await addressRef.doc(order.data().addressID).get();
      let userDoc = await usersRef.doc(order.data().userID).get();
      orders.push({ id: order.id, data: { ...order.data(), ...addressDoc.data(), ...userDoc.data() } });
    }
    return orders
  })

