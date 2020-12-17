import { Box, Button, Grid, IconButton, makeStyles, Link, Paper, Typography } from '@material-ui/core'
import React, { memo, useCallback, useEffect, useState } from 'react'
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
    const [fetchedProduct, setFetchedProduct] = useState({})
    const [isDeleteDisabled, setIsDeleteDisabled] = useState(false)
    const [isIncrementDisabled, setIsIncrementDisabled] = useState(false)

    useEffect(() => {
        const unsubscribe = firestore.collection('products').doc(product.id)
            .onSnapshot(doc => {
                setFetchedProduct({ id: doc.id, data: doc.data() })
            })
        return () => unsubscribe()
    })

    const productURL = useCallback(() => {
        var url = '/categorii'
        if (fetchedProduct.data) {
            fetchedProduct.data.categories.forEach((category) => {
                url += `/${category}`
            })
            url += `/p/${product.id}`
        }
        return url
    }, [fetchedProduct, product.id])

    const adjustQuantity = async (increment) => {
        if (!increment && product.data.quantity === 1) {
            setIsDeleteDisabled(true)
            await removeProductFromCart()
            setIsDeleteDisabled(false)
            return
        }
        if (increment && product.data.quantity < 20) {
            setIsIncrementDisabled(true)
            await cart.incrementQuantity(product.id)
            setIsIncrementDisabled(false)
            return
        }
        if (!increment && product.data.quantity > 1) {
            setIsIncrementDisabled(true)
            await cart.decrementQuantity(product.id)
            setIsIncrementDisabled(false)
            return
        }
    }

    const removeProductFromCart = async () => {
        // remove item from cart
        setIsDeleteDisabled(true)
        await cart.deleteProductFromCart(product.id)
        setIsDeleteDisabled(false)
    }

    return (
        <>
            {
                fetchedProduct.data && <Paper className={classes.paper}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item>
                            <Link component={RouterLink} to={productURL} underline='none'>
                                <Grid container>
                                    <Grid item xs={3} >
                                        <img src={fetchedProduct.data.image} alt={fetchedProduct.data.name} className={classes.image} />
                                    </Grid>
                                    <Grid container item direction='column' xs={9} justify='space-around' alignItems='center'>
                                        <Grid item >
                                            <Typography >
                                                {fetchedProduct.data.name}
                                            </Typography>
                                        </Grid>
                                        <Grid container item justify='space-around'>
                                            <Grid item>
                                                <Typography color='textPrimary'>
                                                    Preț {Math.round((fetchedProduct.data.price + Number.EPSILON) * 100) / 100} RON
                                            </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography component='div' color='textPrimary'>
                                                    <Box fontWeight='fontWeightBold'>
                                                        Subtotal {Math.round((product.data.price + Number.EPSILON) * 100) / 100} RON
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
                                        disabled={isDeleteDisabled || isIncrementDisabled}
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
                                        disabled={isIncrementDisabled}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={classes.removeButton}
                                    onClick={removeProductFromCart}
                                    disabled={isDeleteDisabled}
                                >
                                    <DeleteForeverIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </>
    )
}

export const MemoizedListProduct = memo(ListProduct)
