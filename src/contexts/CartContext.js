import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { isEmpty, useFirestoreConnect } from "react-redux-firebase";
import { firebaseFunctions, firestoreDB } from "..";

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
    const [firebaseCart, setFirebaseCart] = useState(initialCart)
    const [productsInFirebaseCart, setProductsInFirebaseCart] = useState([])
    const [isFirestoreCart, setIsFirestoreCart] = useState(false)

    const cosmoMarketDoc = 'CosmoMarket'
    useFirestoreConnect([{
        collection: 'stores',
        doc: cosmoMarketDoc,
    }])

    const cosmoMarketStore = useSelector(
        ({ firestore }) => firestore.data.stores && firestore.data.stores[cosmoMarketDoc]
    )

    const shouldUploadCartToFirestore = !isEmpty(auth) && cart.products && !isFirestoreCart && !isFirestoreCart
    useEffect(() => {
        if (shouldUploadCartToFirestore) {
            setIsFirestoreCart(true)
            var promises = []
            Object.keys(cart.products).forEach((product) => {
                promises.push(functions.httpsCallable('addProductToCart')({ productID: product, quantity: cart.products[product].quantity }))
            })
            Promise.all(promises)
                .then(() => {
                    setCart(initialCart)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [cart.products, functions, initialCart, shouldUploadCartToFirestore])

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

    const addProductToCart = async (productID, price, quantity) => {
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
            try {
                await functions.httpsCallable('addProductToCart')({ productID: productID, quantity: quantity })
            } catch (err) {
                console.log(err)
            }
        }
    }

    const deleteProductFromCart = async (productID) => {
        if (isEmpty(auth)) {
            setCart((prevCart) => {
                const newCart = { ...prevCart }
                newCart.quantity = prevCart.quantity - prevCart.products[productID].quantity
                newCart.totalPrice = prevCart.totalPrice - prevCart.products[productID].price
                delete newCart.products[productID]
                return newCart
            })
        } else {
            try {
                await functions.httpsCallable('deleteProductFromCart')({ productID: productID })
            } catch (err) {
                console.log(err)
            }
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

    const incrementQuantity = async (productID) => {
        if (isEmpty(auth)) {
            setCart({
                ...cart,
                quantity: cart.quantity + 1,
                totalPrice: cart.totalPrice + cart.products[productID].price / cart.products[productID].quantity,
                products: {
                    ...cart.products,
                    [productID]: {
                        price: cart.products[productID].price + cart.products[productID].price / cart.products[productID].quantity,
                        quantity: cart.products[productID].quantity + 1
                    }
                }
            })
        } else {
            try {
                await functions.httpsCallable('addProductToCart')({ productID: productID, quantity: 1 })
            } catch (err) {
                console.log(err)
            }
        }
    }

    const decrementQuantity = async (productID) => {
        if (isEmpty(auth)) {
            setCart({
                ...cart,
                quantity: cart.quantity - 1,
                totalPrice: cart.totalPrice - cart.products[productID].price / cart.products[productID].quantity,
                products: {
                    ...cart.products,
                    [productID]: {
                        ...cart.products[productID],
                        price: cart.products[productID].price - cart.products[productID].price / cart.products[productID].quantity,
                        quantity: cart.products[productID].quantity - 1
                    }
                }
            })
        } else {
            try {
                await functions.httpsCallable('addProductToCart')({ productID: productID, quantity: -1 })
            } catch (err) {
                console.log(err)
            }
        }
    }

    const value = {
        //vars
        cosmoMarketStore,

        //functions
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