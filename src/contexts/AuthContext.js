import React, {useContext, useState, useEffect} from 'react'
import {auth, functions, editPersonalData} from '../firebase'
import {capitalize} from '../utils/utils'


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()

    function signUp(form) {
        return auth.createUserWithEmailAndPassword(form.email, form.password)
        .then((user) => {
            return editPersonalData({firstName: capitalize(form.firstName), lastName: capitalize(form.lastName), phone: form.phone, email: form.email})
        })
    }

    function signIn(form) {
        return auth.signInWithEmailAndPassword(form.email, form.password)
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function signOut() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])

    const value  = {
        currentUser,
        signUp: signUp,
        signIn: signIn,
        resetPassword: resetPassword,
        signOut: signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
