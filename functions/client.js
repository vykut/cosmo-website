const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.riderFunctions = require('./rider');
exports.adminFunctions = require('./admin');
exports.storageFunctions = require('./storage');

//helper functions
//admin.firestore.FieldValue.serverTimestamp() - pentru a salva data crearii

// http callable function to edit personal data
exports.editPersonalData = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati isi pot edita datele personale'
      }
    }

    if (data.firstName && data.lastName && data.phone) {
      return admin.firestore().collection('users').doc(context.auth.uid).set({
        ...data
      }, { merge: true })
        .then(() => {
          console.log(`S-au modificat datele personale ale userului ${context.auth.uid} cu succes`)
          return {
            result: `S-au modificat datele personale cu succes`
          }
        })
    } else {
      return { error: "Informatii eronate" }
    }
  })

// http callable function to edit addresses
exports.editAddress = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati isi pot modifica adresele`
      }
    }

    let addressRef = admin.firestore().collection('addresses').doc(data.addressID)

    if (data.street && data.number && data.label) {
      return addressRef.set({
        apartment: data.apartment,
        block: data.block,
        floor: data.floor,
        intercom: data.intercom,
        label: data.label,
        number: data.number,
        street: data.street
      }, { merge: true })
        .then(() => {
          console.log(`S-a modificat adresa ${data.addressID}`)
          return {
            result: `S-a modificat adresa cu succes`
          }
        })
    } else {
      return { error: 'strada, numarul si eticheta trebuie completate', data: data }
    }
  })

// http callable function to edit addresses
exports.addAddress = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati pot salva adrese de livrare.'
      }
    }

    let addressRef = admin.firestore().collection('addresses')
    if (data.street && data.number && data.label) {
      return addressRef.add({
        apartment: data.apartment,
        block: data.block,
        floor: data.floor,
        intercom: data.intercom,
        label: data.label,
        number: data.number,
        street: data.street,
        userID: context.auth.uid
      })
        .then((docRef) => {
          console.log(`Utilizatorul ${context.auth.uid} si-a adaugat o noua adresa ${docRef.id}.`)
          return {
            result: `A fost adaugata o noua adresa.`
          }
        })
    } else {
      return {
        error: 'Adresa, numarul si eticheta trebuie completate.'
      }
    }

  })

// http callable function to delete addresses
exports.deleteAddress = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii logati isi pot sterge adresa`
      }
    }

    return admin.firestore().collection('addresses').doc(data.addressID).delete()
      .then(() => {
        console.log(`Utilizatorul ${context.auth.uid} si-a sters adresa ${data.addressID}`)
        return {
          result: `Adresa a fost stearsa cu succes`
        }
      })
  })

// http callable function (placing an order)
exports.placeOrder = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii logati pot plasa comenzi`
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productsInCartRef = cartRef.collection('products')
    let cartProducts = await productsInCartRef.get()
    if (!cartProducts.empty) {
      return admin.firestore().runTransaction(async transaction => {

        //move products from cart to order
        let products = []

        cartProducts.forEach(product => {
          let productData = transaction.get(product.ref)
          products.push(productData)
        })

        products = await Promise.all(products)

        let newOrderRef = admin.firestore().collection('orders').doc()
        transaction.set(newOrderRef, {
          addressID: data.addressID,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          payment: data.payment,
          state: 'pending',
          notes: data.notes,
          userID: context.auth.uid
        })
        let productsInOrderRef = newOrderRef.collection('products')

        products.forEach(productData => {
          transaction.set(productsInOrderRef.doc(productData.id), {
            quantity: productData.get('quantity'),
            price: productData.get('price'),
          });
          // delete products from cart
          transaction.delete(productsInCartRef.doc(productData.id))
        })

        console.log(`Comanda ${newOrderRef.id} a fost creata cu success pentru utilizatorul ${context.auth.uid}. Cosul a fost golit.`)
        return {
          result: `Comanda a fost creata cu succes. Cosul a fost golit.`
        }
      })
    } else {
      return {
        error: 'Cosul este gol'
      }
    }
  });

exports.getPastOrders = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati isi pot vedea comenzile anterioare.'
      }
    }

    let riderQuery = admin.firestore().collection('riders')
    let addressRef = admin.firestore().collection('addresses')
    let productsRef = admin.firestore().collection('products')
    let ordersRef = admin.firestore().collection('orders')
    let ordersQuery = ordersRef.where('userID', '==', context.auth.uid).orderBy('createdAt', 'desc')
    var pastOrders = []
    return admin.firestore().runTransaction(async transaction => {
      let orders = await transaction.get(ordersQuery)
      orders.forEach(async doc => {
        let productsInOrderQuery = await transaction.get(ordersRef.doc(doc.id).collection('products'))
        const productsInOrder = []
        productsInOrderQuery.forEach(async doc => {
          let productQuery = await transaction.get(productsRef.doc(doc.id))
          productsInOrder.push({ id: doc.id, name: productQuery.data().name, price: doc.data().price, quantity: doc.data().quantity })
        })
        let addressQuery = await transaction.get(addressRef.doc(doc.data().addressID))
        var riderName = ''
        if (doc.data().riderID) {
          let riderDoc = await transaction.get(riderQuery.doc(doc.data().riderID))
          riderName = riderDoc.data().name
        }
        pastOrders.push({ id: doc.id, products: productsInOrder, address: { label: addressQuery.data().label }, date: doc.data().createdAt, payment: doc.data().payment, rider: { name: riderName }, state: doc.data().state, totalPrice: doc.data().totalPrice })
      })
      return pastOrders
    })
  })

// http callable function (repeating an order)
// move products from past order to cart and calculate total
exports.orderAgain = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati pot repeta comenzi.'
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productsInCartRef = cartRef.collection('products')
    let orderRef = admin.firestore().collection('orders').doc(data.orderID)
    let productsInOrderRef = orderRef.collection('products')

    return admin.firestore().runTransaction(async transaction => {
      let orderProducts = await productsInOrderRef.get()

      //copy products from order to cart
      let products = []

      orderProducts.forEach(product => {
        let productData = transaction.get(product.ref)
        products.push(productData)
      })

      products = await Promise.all(products)

      products.forEach(productData => {
        // check if product is already in cart - merge:true and increment
        transaction.set(productsInCartRef.doc(productData.id), {
          quantity: admin.firestore.FieldValue.increment(productData.get('quantity'))
        }, { merge: true });
      })
    })
  })

// http callable function (canceling an order) - only if order is not yet assigned to rider
exports.cancelOrder = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati pot anula comenzi`
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productsInCartRef = cartRef.collection('products')
    let orderRef = admin.firestore().collection('orders').doc(data.orderID)
    let productsInOrderRef = orderRef.collection('products')

    return admin.firestore().runTransaction(async transaction => {
      let order = await transaction.get(orderRef)

      // order is not assigned to rider
      if (order.get('state') === 'pending') {

        let orderProducts = await productsInOrderRef.get()

        //copy products from order to cart
        let products = []

        orderProducts.forEach(product => {
          let productData = transaction.get(product.ref)
          products.push(productData)
        })

        products = await Promise.all(products)

        transaction.update(orderRef, {
          state: 'canceled'
        })

        products.forEach(productData => {
          transaction.set(productsInCartRef.doc(productData.id), {
            quantity: productData.get('quantity')
          });
        })
      } else {
        console.log(`Comanda cu id-ul ${data.orderID} nu mai poate fi anulata`)
        return {
          error: `Comanda nu mai poate fi anulata`
        }
      }
    })
      .then((error) => {
        if (error && error.error) {
          return error.error
        } else {
          console.log(`S-a anulat comanda cu id-ul ${data.orderID}`)
          return {
            result: `Comanda a fost anulata cu succes.`
          }
        }
      })
  })

// http callable function (adding a product to favorites)
exports.favoriteProduct = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati pot adauga produse in lista de produse favorite`
      }
    }
    let currentUserRef = admin.firestore().collection('users').doc(context.auth.uid)

    return admin.firestore().runTransaction(async transaction => {
      let currentUserData = await transaction.get(currentUserRef)
      let favoriteProducts = currentUserData.get('favoriteProducts')

      if (favoriteProducts.includes(data.id)) {
        transaction.update(currentUserRef, {
          favoriteProducts: admin.firestore.FieldValue.arrayRemove(data.id)
        })
        console.log(`S-a sters produsul ${data.id} din lista de favorite a userului ${context.auth.uid}`)
        return {
          result: `Produsul a fost sters din lista de favorite`
        }
      } else {
        transaction.update(currentUserRef, {
          favoriteProducts: admin.firestore.FieldValue.arrayUnion(data.id)
        })

        console.log(`S-a adaugat produsul ${data.id} in lista de favorite a userului ${context.auth.uid}.`)
        return {
          result: `Produsul a fost adaugat in lista de favorite.`
        }
      }
    })
  });

//http callable function add product to cart
exports.addProductToCart = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati pot adauga produse in cos.`
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productInCartRef = cartRef.collection('products').doc(data.productID)


    return admin.firestore().runTransaction(async transaction => {
      const docSnapshot = await transaction.get(admin.firestore().collection('products').doc(data.productID))
      const price = docSnapshot.data().price
      return productInCartRef.set({
        quantity: admin.firestore.FieldValue.increment(data.quantity),
        price: admin.firestore.FieldValue.increment(price * data.quantity)
      }, { merge: true })
    })
  })

//http callable function delete product from cart
exports.deleteProductFromCart = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati pot sterge produse din cos.`
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productInCartRef = cartRef.collection('products').doc(data.productID)

    return productInCartRef.delete()
      .then(() => {
        console.log(`A fost sters produsul ${data.productID} din cosul utilizatorului ${context.auth.uid}`)
        return {
          result: `Produsul a fost sters din cos cu succes.`
        }
      })
  })

//db trigger function when new user is created
exports.createCart = functions
  .region('europe-west1')
  .firestore.document('users/{userID}')
  .onCreate((snap, context) => {
    return admin.firestore().collection('carts').doc(snap.id).set({
      totalPrice: 0,
      quantity: 0,
    })
      .then(() => {
        console.log(`A fost creat cosul utilizatorului ${context.params.userID}.`)
        return {
          result: `Cosul a fost creat cu succes.`
        }
      })
  });

//db trigger function when user is deleted
exports.deleteCart = functions
  .region('europe-west1')
  .firestore.document('users/{userID}')
  .onDelete((snap, context) => {
    return admin.firestore().collection('carts').doc(context.params.userID).delete()
      .then(() => {
        console.log(`A fost sters cosul utilizatorului ${context.params.userID}`)
        return {
          result: "Cosul a fost sters cu succes."
        }
      })
  });

//db trigger function when quantity is zero in cart - should be handled in front end as well
exports.cartQuantityZeroWrite = functions
  .region('europe-west1')
  .firestore.document('carts/{cartID}/products/{productID}')
  .onWrite((change, context) => {
    if (change.after.exists && change.after.data().quantity <= 0) {
      return change.after.ref.delete()
        .then(() => {
          console.log(`A fost sters produsul ${context.params.productID} din cosul ${context.params.cartID}.`)
          return {
            result: `Produsul a fost sters din cos cu succes.`
          }
        })
    }
    return null
  });

//db trigger functions when quantity is zero in order - should be handled in front end as well
exports.orderQuantityZeroWrite = functions
  .region('europe-west1')
  .firestore.document('orders/{orderID}/products/{productID}')
  .onWrite((change, context) => {
    if (change.after.exists && change.after.data().quantity <= 0) {
      return change.after.ref.delete()
        .then(() => {
          console.log(`A fost sters produsul ${context.params.productID} din comanda ${context.params.orderID}.`)
          return {
            result: `Produsul a fost sters din comanda cu succes.`
          }
        })
    }
    return null
  });

exports.updateCartTotalPriceAndQuantity = functions
  .region('europe-west1')
  .firestore.document('carts/{cartID}/products/{productID}')
  .onWrite(async (change, context) => {
    let cartRef = admin.firestore().collection('carts').doc(context.params.cartID)
    let productsInCartRef = cartRef.collection('products')

    let totalPrice = 0
    let quantity = 0
    return admin.firestore().runTransaction(async transaction => {
      let productsInCartData = await transaction.get(productsInCartRef)
      productsInCartData.forEach(doc => {
        totalPrice += doc.data().price
        quantity += doc.data().quantity
      })
      return transaction.set(cartRef, {
        totalPrice: totalPrice,
        quantity: quantity,
      }, { merge: true })
    })
  })

exports.updateOrderTotalPriceAndQuantity = functions
  .region('europe-west1')
  .firestore.document('orders/{orderID}/products/{productID}')
  .onWrite(async (change, context) => {
    let orderRef = admin.firestore().collection('orders').doc(context.params.orderID)
    let productsInOrderRef = orderRef.collection('products')

    let totalPrice = 0
    let quantity = 0
    return admin.firestore().runTransaction(async transaction => {
      let productsInCartData = await transaction.get(productsInOrderRef)
      productsInCartData.forEach(doc => {
        totalPrice += doc.data().price
        quantity += doc.data().quantity
      })
      return transaction.set(orderRef, {
        totalPrice: totalPrice,
        quantity: quantity,
      }, { merge: true })
    })

  })

exports.deleteAccount = functions
  .region('europe-west1')
  .auth.user()
  .onDelete(user => {
    return admin.firestore().collection('users').doc(user.uid).delete()
      .then(() => {
        console.log(`Userul ${user.uid} a fost sters cu succes`)
        return {
          result: `Userul a fost sters cu succes`
        }
      })
  })