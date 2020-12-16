import { Dialog, DialogContent, DialogTitle, Grid, IconButton, makeStyles, useTheme } from '@material-ui/core'
import React, { useContext, useState, useEffect } from 'react'
import { capitalize, timeout } from '../utils/utils'
import LoginLogic from '../components/LoginComponents/LoginLogic';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        color: theme.palette.error.main
    }
}))


const DialogContext = React.createContext()

export function useDialog() {
    return useContext(DialogContext)
}

export function DialogProvider({ children }) {
    const classes = useStyles()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)

    const toggleDialog = (isOpen) => (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }
        return setLoginDialogOpen(isOpen)
    }


    const showDialog = () => {
        setLoginDialogOpen(true)
    }

    const hideDialog = async () => {
        await timeout(500)
        setLoginDialogOpen(false)
    }

    const value = {
        showDialog,
        hideDialog,
    }


    function LoginDialog() {
        return (
            <Dialog maxWidth='sm' fullWidth fullScreen={fullScreen} open={loginDialogOpen} onClose={toggleDialog(false)}>
                <DialogTitle>
                    <Grid container justify='space-between' alignItems='center'>
                        <Grid item>
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
                    <LoginLogic />
                </DialogContent>
            </Dialog >
        )
    }



    return (
        <>
            <DialogContext.Provider value={value}>
                {children}
                {loginDialogOpen && <LoginDialog />}
            </DialogContext.Provider>
        </>
    )
}
