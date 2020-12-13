import { Box, Button, FormControl, Grid, makeStyles, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
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
            await placeOrder()
            // setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
            // toggleDialog(false)
        } catch (error) {
            // setAlert({ severity: 'error', message: error.message })
            console.log('eroare la review order')
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
                                            220 RON
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
                                            10 RON
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
                                            230 RON
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