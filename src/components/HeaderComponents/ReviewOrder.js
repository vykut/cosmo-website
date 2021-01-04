import { Box, Button, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { firebaseFunctions, firestoreDB } from '../..'
import { useCart } from '../../contexts/CartContext'
import AddressForm from '../AuxiliaryComponents/AddressForm'
import PaymentTypeForm from '../AuxiliaryComponents/PaymentTypeForm'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    header: {
        color: theme.palette.info.main,
        marginLeft: theme.spacing(),

    }
}))

export default function ReviewOrder({ placeOrder }) {
    const classes = useStyles()
    const firestore = firestoreDB
    const functions = firebaseFunctions
    const auth = useSelector(state => state.firebase.auth);
    const cart = useCart()

    // save address if it's a new one
    const [address, setAddress] = useState({})
    const [paymentType, setPaymentType] = useState('cash')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)

    //fetch cart
    const validateFormAndPlaceOrder = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            var docRef
            if (address.id) {
                await firestore.collection('addresses').doc(address.id)
                    .update(address.data)
                docRef = { id: address.id }
            } else {
                docRef = await firestore.collection('addresses')
                    .add({ ...address.data, userID: auth.uid })
            }
            await functions.httpsCallable('placeOrder')({ addressID: docRef.id, payment: paymentType, notes: notes })
            placeOrder()
            // setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
        } catch (error) {
            // setAlert({ severity: 'error', message: error.message })
            console.log('eroare la review order', error)
        }
        setLoading(false)
    }

    function Header({ title }) {
        return <Typography variant='body1' component='div' className={classes.header}>
            <Box fontWeight='fontWeightBold'>
                {title}
            </Box>
        </Typography>
    }

    return (
        <Grid item>
            <form onSubmit={validateFormAndPlaceOrder}>
                <Grid container direction='column' justify='center' spacing={2}>
                    <Grid container item direction='column'>
                        <Grid item>
                            <Header title='Informații adresă' />
                        </Grid>
                        <Grid item style={{ width: '100%' }}>
                            <Paper className={classes.paper} >
                                <AddressForm address={address} setAddress={setAddress} />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container item direction='column'>
                        <Grid item>
                            <Header title='Metoda de plată' />
                        </Grid>
                        <Grid item>
                            <PaymentTypeForm paymentType={paymentType} setPaymentType={setPaymentType} />
                        </Grid>
                    </Grid>
                    <Grid container item direction='column'>
                        <Grid item>
                            <Header title='Observații comandă' />
                        </Grid>
                        <Grid item style={{ width: '100%' }}>
                            <Paper className={classes.paper} >
                                <TextField
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Observații"
                                    value={notes}
                                    onChange={(e) => { setNotes(e.target.value) }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Grid container spacing={1}>
                                <Grid container item justify='space-between'>
                                    <Grid item>
                                        <Typography>
                                            Total produse
                                </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {Math.round((cart.getCart().totalPrice + Number.EPSILON) * 100) / 100} RON
                                </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item justify='space-between'>
                                    <Grid item>
                                        <Typography>
                                            Cost livrare
                                </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {cart.deliveryPrice || 10} RON
                                </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item justify='space-between'>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            Total comandă
                                </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            {Math.round((cart.getCart().totalPrice + (cart.deliveryPrice || 10) + Number.EPSILON) * 100) / 100} RON
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Button fullWidth color='primary' variant='contained' size='large' type="submit" disabled={loading}>
                            Plasează comanda
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}