const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.riderFunctions = require('./rider');
exports.adminFunctions = require('./admin');
exports.storageFunctions = require('./storage');

//helper functions


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

    if (data.address && data.number && data.label) {
      return addressRef.set({
        apartment: data.apartment,
        block: data.block,
        floor: data.floor,
        intercom: data.intercom,
        label: data.label,
        number: data.number,
        street: data.street
      })
        .then(() => {
          console.log(`S-a modificat adresa ${data.addressID}`)
          return {
            result: `S-a modificat adresa cu succes`
          }
        })
    } else {
      return { error: 'adresa, numarul si eticheta trebuie completate' }
    }
  })

// http callable function to edit addresses
exports.addAddress = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati pot salva adrese de livrare'
      }
    }

    let addressRef = admin.firestore().collection('addresses')
    if (data.address && data.number && data.label) {
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
        .then(() => {
          console.log(`Utilizatorul ${context.auth.uid} si-a adaugat o noua adresa ${data.addressID}`)
          return {
            result: `A fost adaugata o noua adresa`
          }
        })
    } else {
      return {
        error: 'Adresa, numarul si eticheta trebuie completate'
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
          createdAt: admin.firestore.Timestamp.now(),
          payment: data.payment,
          state: 'pending',
          userID: context.auth.uid
        })
        let productsInOrderRef = newOrderRef.collection('products')

        products.forEach(productData => {
          transaction.set(productsInOrderRef.doc(productData.id), {
            quantity: productData.get('quantity')
          });
          // delete products from cart
          transaction.delete(productsInCartRef.doc(productData.id))
        })

        console.log(`Comanda ${newOrderRef.id} a fost creata cu success pentru utilizatorul ${context.auth.uid}. Cosul a fost golit.`)
        return {
          result: `Comanda a fost creata cu succes. Cosul a fost golit.`
        }
      })
        .then((result) => {
          return result
        })
    } else {
      return {
        error: 'Cosul este gol'
      }
    }
  });

// http callable function (repeating an order)
// move products from past order to cart and calculate total
exports.orderAgain = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      return {
        error: 'Numai utilizatorii autentificati pot repeta comenzi'
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

        console.log(`S-a adaugat produsul ${data.id} in lista de favorite a userului ${context.auth.uid}`)
        return {
          result: `Produsul a fost adaugat in lista de favorite`
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
        error: `Numai utilizatorii autentificati pot adauga produse din cos`
      }
    }

    let cartRef = admin.firestore().collection('carts').doc(context.auth.uid)
    let productInCartRef = cartRef.collection('products').doc(data.productID)


    return productInCartRef.set({
      quantity: data.quantity
    }, { merge: true })
      .then(() => {
        console.log(`Produsul ${data.productID} a fost adaugat in cosul userului ${context.auth.uid}.`)
        return {
          result: `Produsul a fost adaugat in cos cu succes`
        }
      })
  })

//http callable function delete product from cart
exports.deleteProductFromCart = functions
  .region('europe-west1')
  .https.onCall((data, context) => {
    if (!context.auth) {
      return {
        error: `Numai utilizatorii autentificati pot sterge produse din cos`
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
      totalPrice: 0
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

// db trigger function for updating the cart total price and individual product total price
exports.cartProductTotal = functions
  .region('europe-west1')
  .firestore.document('carts/{cartID}/products/{productID}')
  .onWrite(async (change, context) => {
    let productRef = admin.firestore().collection('products').doc(context.params.productID)
    let orderRef = admin.firestore().collection('carts').doc(context.params.cartID)

    let cartProduct = change.after.exists ? change.after.data() : null;
    let oldPrice = change.before.exists ? change.before.data().price : 0
    let oldQuantity = change.before.exists ? change.before.data().quantity : -1
    let newQuantity = change.after.exists ? change.after.data().quantity : -1

    if (oldQuantity !== newQuantity) {
      return admin.firestore().runTransaction(async transaction => {
        // if product exists calculate product total and overall total
        if (cartProduct) {
          let product = await transaction.get(productRef)
          let price = product.get('price')
          let newPrice = price * cartProduct.quantity
          transaction.set(change.after.ref, {
            price: admin.firestore.FieldValue.increment(newPrice - oldPrice)
          }, { merge: true })
          transaction.set(orderRef, {
            totalPrice: admin.firestore.FieldValue.increment(newPrice - oldPrice)
          }, { merge: true })
          // if product has been deleted subtract old price from overall total
        } else {
          transaction.update(orderRef, {
            totalPrice: admin.firestore.FieldValue.increment(-oldPrice)
          })
        }
      })
        .then(() => {
          console.log(`S-a actualizat totalul pentru cosul utilizatorului ${context.params.orderID}.`)
          return {
            result: `Totalul cosului a fost actualizat cu succes.`
          }
        })
    }
  })

// db trigger function for updating the order total price and individual product total price
exports.orderProductTotal = functions
  .region('europe-west1')
  .firestore.document('orders/{orderID}/products/{productID}')
  .onWrite(async (change, context) => {
    let productRef = admin.firestore().collection('products').doc(context.params.productID)
    let orderRef = admin.firestore().collection('orders').doc(context.params.orderID)

    let orderProduct = change.after.exists ? change.after.data() : null;
    let oldPrice = change.before.exists ? change.before.data().price : 0
    let oldQuantity = change.before.exists ? change.before.data().quantity : -1
    let newQuantity = change.after.exists ? change.after.data().quantity : -1

    if (oldQuantity !== newQuantity) {
      return admin.firestore().runTransaction(async transaction => {
        // if product exists calculate product total and overall total
        if (orderProduct) {
          let product = await transaction.get(productRef)
          let price = product.get('price')
          let newPrice = price * orderProduct.quantity
          transaction.set(change.after.ref, {
            price: admin.firestore.FieldValue.increment(newPrice - oldPrice)
          }, { merge: true })
          transaction.set(orderRef, {
            totalPrice: admin.firestore.FieldValue.increment(newPrice - oldPrice)
          }, { merge: true })
          // if product has been deleted subtract old price from overall total
        } else {
          transaction.update(orderRef, {
            totalPrice: admin.firestore.FieldValue.increment(-oldPrice)
          })
        }
      })
        .then(() => {
          console.log(`S-a actualizat totalul pentru comanda ${context.params.orderID}.`)
          return {
            result: `Totalul comenzii a fost actualizat cu succes.`
          }
        })
    }
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
