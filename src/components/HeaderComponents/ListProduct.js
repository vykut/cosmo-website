import { Box, Button, Drawer, Grid, IconButton, makeStyles, Link, Paper, Typography, withStyles } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Link as RouterLink } from 'react-router-dom/'
import { useCart } from '../../contexts/CartContext';
import { firestoreDB } from '../..';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing()
    },
    infoTextColor: {
        color: theme.palette.info.main,
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: 70,
        maxWidth: 70,
        width: "auto",
        height: 'auto',
    },
    quantitySelector: {
        borderRadius: 5,
        border: 1,
        // borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 180,
        height: 36,
    },
    quantityTypography: {
        // color: theme.palette.text.primary,
        // maxWidth: 180,
        marginBottom: theme.spacing(1)
    },
    quantityIncrement: {
        borderLeft: 1,
        // borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        borderRadius: 0,
        color: theme.palette.text.primary,
        height: 36,
    },
    quantityDecrement: {
        borderRight: 1,
        // borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        borderRadius: 0,
        color: theme.palette.text.primary,
        height: 36,
    },
    quantityInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        // color: theme.palette.text.primary,
        flexGrow: 1,
    },
    removeButton: {
        // margin: theme.spacing(3, 0, 2),
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

export default function ListProduct({ product }) {
    const classes = useStyles()
    const cart = useCart()
    const firestore = firestoreDB

    const [state, setState] = useState(product.data.quantity)
    const [fetchedProduct, setFetchedProduct] = useState({})

    useEffect(() => {
        const unsubscribe = firestore.collection('products').doc(product.id)
            .onSnapshot(function (doc) {
                setFetchedProduct(doc.data())
            })
        return () => unsubscribe()
    }, [firestore, product.id])


    const productURL = useCallback(() => {
        var url = '/categorii'
        if (fetchedProduct.category) {
            url += `/${fetchedProduct.category}`
        }
        if (fetchedProduct.subcategory1) {
            url += `/${fetchedProduct.subcategory1}`
        }
        if (fetchedProduct.subcategory2) {
            url += `/${fetchedProduct.subcategory2}`
        }
        url += `/p/${product.id}`
        return url
    }, [product.id, fetchedProduct])

    const adjustQuantity = (increment) => {
        if (increment && product.data.quantity < 20) {

            return cart.incrementQuantity(product.id)
        }
        if (!increment && product.data.quantity > 1) {
            return cart.decrementQuantity(product.id)
        }
        if (!increment && product.data.quantity === 1) {
            removeProductFromCart()
        }
    }

    const removeProductFromCart = () => {
        // remove item from cart
        cart.deleteProductFromCart(product.id)
    }

    return (
        <Paper className={classes.paper}>
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <Link component={RouterLink} to={productURL} underline='none'>
                        <Grid container>
                            <Grid item xs={3} >
                                <img src={fetchedProduct.image} alt={fetchedProduct.name} className={classes.image} />
                            </Grid>
                            <Grid container item direction='column' xs={9} justify='space-around' alignItems='center'>
                                <Grid item >
                                    <Typography >
                                        {fetchedProduct.name}
                                    </Typography>
                                </Grid>
                                <Grid container item justify='space-around'>
                                    <Grid item>
                                        <Typography color='textPrimary'>
                                            Preț {Math.round((fetchedProduct.price + Number.EPSILON) * 100) / 100} RON
                                            </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography component='div' color='textPrimary'>
                                            <Box fontWeight='fontWeightBold'>
                                                Subtotal {Math.round((product.data.quantity * fetchedProduct.price + Number.EPSILON) * 100) / 100} RON
                                        </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Link>
                </Grid>
                <Grid container item justify='space-between'>
                    <Grid item>
                        {/* quantity selector */}
                        <div className={classes.quantitySelector}>
                            <IconButton
                                className={classes.quantityDecrement}
                                onClick={() => { adjustQuantity(false) }}
                                id='decrement'
                            >
                                <RemoveIcon />
                            </IconButton>
                            <Typography
                                className={classes.quantityInput}
                                align='center'
                                variant='body1'
                                component='div'
                            >
                                <Box fontWeight='fontWeightBold'>
                                    {product.data.quantity}
                                </Box>
                            </Typography>
                            <IconButton
                                className={classes.quantityIncrement}
                                onClick={() => { adjustQuantity(true) }}
                                id='increment'
                            >
                                <AddIcon />
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.removeButton}
                            onClick={removeProductFromCart}
                        >
                            <DeleteForeverIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
