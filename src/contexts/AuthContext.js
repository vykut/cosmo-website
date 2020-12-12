import { Dialog, DialogContent, DialogTitle, Grid, IconButton, makeStyles, useTheme } from '@material-ui/core'
import React, { useContext, useState, useEffect } from 'react'
import { auth, functions, editPersonalData } from '../firebase'
import { capitalize } from '../utils/utils'
import CloseIcon from '@material-ui/icons/Close';
import LoginLogic from '../components/LoginComponents/LoginLogic';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        color: theme.palette.error.main
    }
}))


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const classes = useStyles()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [currentUser, setCurrentUser] = useState()
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)

    const toggleDialog = (isOpen) => (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }
        return setLoginDialogOpen(isOpen)
    }

    function signUp(form) {
        return auth.createUserWithEmailAndPassword(form.email, form.password)
            .then((user) => {
                return editPersonalData({ firstName: capitalize(form.firstName), lastName: capitalize(form.lastName), phone: form.phone, email: form.email })
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

    function login() {
        setLoginDialogOpen(true)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUp,
        signIn,
        resetPassword,
        signOut,
        login,
    }

    function LoginDialog() {
        return (
            <Dialog maxWidth='sm' fullWidth fullScreen={fullScreen} open={loginDialogOpen} onClose={toggleDialog(false)}>
                <DialogTitle>
                    <Grid container justify='space-between' alignItems='center'>
                        < Grid item >
                            Conectează-te
                        </Grid >
                        <Grid item>
                            <IconButton onClick={toggleDialog(false)} className={classes.closeButton}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid >
                </DialogTitle >
                <DialogContent>
                    <LoginLogic toggleDialog={setLoginDialogOpen} />
                </DialogContent>
            </Dialog >
        )
    }

    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
                <LoginDialog />
            </AuthContext.Provider>

        </>
    )
}
