import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { isEmpty } from "react-redux-firebase";
import { firebaseFunctions, firestoreDB } from "..";
import firebase from 'firebase';

const CartContext = createContext()

export function useCart() {
    return useContext(CartContext)
}

export function CartProvider({ children }) {
    const auth = useSelector(state => state.firebase.auth);
    const functions = firebaseFunctions
    const firestore = firestoreDB

    const initialCart = useMemo(() => {
        return {
            products: {},
            quantity: 0,
            totalPrice: 0
        }
    }, [])

    const [cart, setCart] = useState(initialCart)
    const [firebaseCart, setFirebaseCart] = useState({})
    const [productsInFirebaseCart, setProductsInFirebaseCart] = useState({})

    useEffect(() => {
        if (!isEmpty(auth) && cart.products) {
            var promises = []
            Object.keys(cart.products).forEach((product) => {
                promises.push(functions.httpsCallable('addProductToCart')({ productID: product, quantity: cart.products[product].quantity }))
            })
            Promise.all(promises)
                .then(() => {
                    setCart(initialCart)
                })
        }
    }, [auth, cart, functions, initialCart])

    useEffect(() => {
        var cartUnsubscribe
        var productsUnsubscribe
        if (!isEmpty(auth)) {
            cartUnsubscribe = firestore.collection('carts').doc(auth.uid).onSnapshot(function (doc) {
                setFirebaseCart(doc.data())
            })
            productsUnsubscribe = firestore.collection('carts').doc(auth.uid).collection('products').onSnapshot(function (querySnapshot) {
                var docs = []
                querySnapshot.forEach(doc => {
                    docs.push({ id: doc.id, data: doc.data() })
                })
                setProductsInFirebaseCart(docs)
            })
            return () => { cartUnsubscribe(); productsUnsubscribe(); }
        }
    }, [auth, firestore,])

    const addProductToCart = (productID, price, quantity) => {
        if (isEmpty(auth)) {
            setCart({
                ...cart,
                products: {
                    ...cart.products,
                    [productID]: {
                        price: cart.products && cart.products[productID] ? price * quantity + cart.products[productID].price : price * quantity,
                        quantity: cart.products && cart.products[productID] ? quantity + cart.products[productID].quantity : quantity
                    }
                },
                quantity: cart.quantity + quantity,
                totalPrice: cart.totalPrice + price * quantity
            })
        } else {
            functions.httpsCallable('addProductToCart')({ productID: productID, quantity: quantity })
        }
    }

    const deleteProductFromCart = (productID) => {
        if (isEmpty(auth)) {
            const productsInCart = [...cart.products]
            const index = productsInCart.indexOf(productID);
            if (index > -1) {
                productsInCart.splice(index, 1)
            }
            setCart({
                ...cart,
                quantity: cart.quantity - cart.products[productID].quantity,
                totalPrice: cart.totalPrice - cart.products[productID].price,
                products: productsInCart,
            })
        } else {
            functions.httpsCallable('deleteProductFromCart')({ productID: productID })
        }
    }

    const getCart = () => {
        if (isEmpty(auth)) {
            return cart
        } else {
            return firebaseCart
        }
    }

    const getProductsInCart = () => {
        if (isEmpty(auth)) {
            return Object.keys(cart.products).map((key) => { return { id: key, data: cart.products[key] } })
        } else {
            return productsInFirebaseCart
        }
    }

    const incrementQuantity = (productID) => {
        if (isEmpty(auth)) {
            setCart({
                ...cart,
                products: {
                    ...cart.products,
                    [productID]: {
                        ...cart.products[productID],
                        quantity: cart.products[productID].quantity + 1
                    }
                }
            })
        } else {
            firestore.collection('carts').doc(auth.uid).collection('products').doc(productID)
                .update({ quantity: firebase.firestore.FieldValue.increment(1) })
        }
    }

    const decrementQuantity = (productID) => {
        if (isEmpty(auth)) {
            setCart({
                ...cart,
                products: {
                    ...cart.products,
                    [productID]: {
                        ...cart.products[productID],
                        quantity: cart.products[productID].quantity - 1
                    }
                }
            })
        } else {
            firestore.collection('carts').doc(auth.uid).collection('products').doc(productID)
                .update({ quantity: firebase.firestore.FieldValue.increment(-1) })
        }
    }

    const value = {
        addProductToCart,
        deleteProductFromCart,
        getCart,
        getProductsInCart,
        incrementQuantity,
        decrementQuantity,
    }

    return (
        <>
            <CartContext.Provider value={value}>
                {children}
            </CartContext.Provider>
        </>
    )
}