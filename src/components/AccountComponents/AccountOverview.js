import { Box, Button, ButtonGroup, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import PersonalData from './PersonalData'
import AddressForm from '../AuxiliaryComponents/AddressForm';
import { Alert } from '@material-ui/lab';
import PastOrders from './PastOrders';
import { useFirebase } from 'react-redux-firebase';
import { firebaseFunctions } from '../..';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoTextColor: {
        color: theme.palette.info.main
    },
    infoButtonColor: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.info.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.info.main
            }
        }
    },
    errorButtonColor: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.error.main
            }
        }
    },
}))

export default function AccountOverview() {
    const classes = useStyles()
    const firebase = useFirebase()
    const functions = firebaseFunctions

    const [addressKey, setAddressKey] = useState('')
    const [address, setAddress] = useState({})
    const [alert, setAlert] = useState({
        message: '',
        severity: 'error'
    })
    const [isChangingAddress, setIsChangingAddress] = useState(false)

    const handleAddress = async (e) => {
        e.preventDefault()
        setIsChangingAddress(true)
        if (addressKey === -1) {
            try {
                const response = await functions.httpsCallable('addAddress')({ ...address.data })
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                const response = await functions.httpsCallable('editAddress')({ ...address.data, addressID: address.id })
            } catch (err) {
                console.log(err)
            }
        }
        setIsChangingAddress(false)
        setAddressKey('')
        setAddress({})
        setAlert({
            message: 'Adresa a fost salvată',
            severity: 'success'
        })
        // save address in DB
    }

    const handleDelete = async () => {
        try {
            await functions.httpsCallable('deleteAddress')({ addressID: address.id })
            setAddressKey('')
            setAddress({})
            setAlert({
                message: 'Adresa a fost ștearsă',
                severity: 'success'
            })
        } catch (err) {
            console.log(err)
        }
    }

    const logout = () => {
        firebase.logout()
    }

    return (
        <>
            {/* <Container maxWidth='xs' style={{ marginTop: 24 }}> */}
            <Grid container direction='column' style={{ padding: 16 }}>
                <Grid container item justify='space-between'>
                    <Grid item>
                        <Typography variant='h3' component='div' className={classes.infoTextColor}>
                            <Box fontWeight='fontWeightBold'>
                                Contul tău
                        </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={logout} className={classes.errorButtonColor}>
                            Deconectează-te
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item md={4} sm={12} style={{ padding: 8, width: '100%' }}>
                        <PersonalData />
                    </Grid>
                    <Grid item md={4} sm={12} style={{ padding: 8, width: '100%' }}>
                        <Paper className={classes.paper} >
                            {/* adrese */}
                            <form onSubmit={handleAddress}>
                                <Grid container direction='column' spacing={2}>
                                    <Grid item>
                                        <Typography variant='h6' className={classes.infoTextColor}>
                                            Adresele tale de livrare
                                        </Typography>
                                    </Grid>
                                    {alert.message &&
                                        <Grid item>
                                            <Alert variant="filled" severity={alert.severity} className={classes.alert}>
                                                {alert.message}
                                            </Alert>
                                        </Grid>}
                                    <Grid item>
                                        <AddressForm addressKey={addressKey} setAddressKey={setAddressKey} address={address} setAddress={setAddress} />
                                    </Grid>
                                    {addressKey !== '' &&
                                        <Grid container item justify='flex-end'>
                                            <Grid item>
                                                <ButtonGroup>
                                                    {addressKey > -1 &&
                                                        <Button variant='contained' startIcon={<DeleteForeverIcon />} className={classes.errorButtonColor} onClick={handleDelete}>
                                                            Șterge adresa
                                                        </Button>
                                                    }
                                                    <Button color='primary' type='submit' startIcon={<SaveIcon />} variant='contained' disabled={isChangingAddress}>
                                                        Salvează adresa
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>}
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={12} style={{ padding: 8, width: '100%' }}>
                        {/* comenzi anterioare */}
                        <PastOrders />
                    </Grid>
                </Grid>
            </Grid>
            {/* </Container> */}
        </>
    )
}
