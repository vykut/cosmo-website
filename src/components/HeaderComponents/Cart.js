import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { MemoizedListProduct } from './ListProduct';
import { useCart } from '../../contexts/CartContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: '#f7ffff',
        width: 400
    },
    infoTextColor: {
        color: theme.palette.info.main,
    },
    title: {
        marginBottom: theme.spacing(3),
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: 100,
        maxWidth: 100,
        width: "auto",
        height: 'auto',
    },
    mainContainer: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    total: {
        padding: theme.spacing()
    },
    backButton: {
        color: theme.palette.error.main
    },
    closeButton: {
        color: theme.palette.error.main
    },
}))
export default function Cart({ reviewOrder }) {
    const classes = useStyles()
    const cart = useCart()

    return (
        <>
            <Grid container item direction='column' spacing={2}>
                {cart.getProductsInCart().map((product, index) => {
                    return <Grid item key={index}>
                        <MemoizedListProduct product={product} />
                    </Grid>
                })}
                <Grid item>
                    <Paper className={classes.total}>
                        <Grid container justify='space-between'>
                            <Grid item >
                                <Typography variant='h6'>
                                    Total produse
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='h6'>
                                    {cart.getCart() && cart.getCart().totalPrice && Math.round((cart.getCart().totalPrice + Number.EPSILON) * 100) / 100} RON
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Button fullWidth color='primary' variant='contained' size='large' onClick={reviewOrder} disabled={!cart.getProductsInCart().length}>
                        Finalizează comanda
                </Button>
                </Grid>
            </Grid>
        </>
    )
}
