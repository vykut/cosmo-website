import { Box, Button, ButtonGroup, Container, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ProductsRow from '../HomeComponents/ProductsRow';
import { useParams } from 'react-router-dom';
import { isEmpty, isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { useCart } from '../../contexts/CartContext'
import { firebaseFunctions } from '../..';


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoPalette: {
        color: theme.palette.info.main,
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: 600,
        minHeight: 300,
        maxWidth: 600,
        [theme.breakpoints.down('xs')]: {
            maxHeight: 300,
            maxWidth: 300,
            height: 300,
        },
        width: "auto",
        margin: 'auto',
    },
    quantitySelector: {
        borderRadius: 5,
        border: 1,
        borderColor: theme.palette.info.main,
        borderStyle: 'solid',
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityTypography: {
        color: theme.palette.info.main,
        // maxWidth: 180,
        marginBottom: theme.spacing(1)
    },
    quantityIncrement: {
        borderLeft: 1,
        borderColor: theme.palette.info.main,
        borderStyle: 'solid',
        borderRadius: 0,
        color: theme.palette.info.main,
    },
    quantityDecrement: {
        borderRight: 1,
        borderColor: theme.palette.info.main,
        borderStyle: 'solid',
        borderRadius: 0,
        color: theme.palette.info.main,
    },
    quantityInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.palette.info.main,
        flexGrow: 1,
    },
    favoriteButton: {
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

export default function ProductPage() {
    const classes = useStyles()
    const { productID } = useParams()
    const cart = useCart()
    const functions = firebaseFunctions

    const [state, setState] = useState({ quantity: 1 })
    const [isFavoriteDisabled, setIsFavoriteDisabled] = useState(false)
    const [isBuyDisabled, setIsBuyDisabled] = useState(false)

    const addToFavorite = async () => {
        setIsFavoriteDisabled(true)
        try {
            await functions.httpsCallable('favoriteProduct')({ id: productID })
        } catch (err) {
            console.log(err)
        }
        setIsFavoriteDisabled(false)
    }

    const adjustQuantity = (increment) => {
        if (increment && state.quantity < 20) {
            setState({
                ...state,
                quantity: state.quantity + 1
            })
            return
        }
        if (!increment && state.quantity > 1) {
            setState({
                ...state,
                quantity: state.quantity - 1
            })
            return
        }
    }

    useFirestoreConnect({
        collection: 'products',
        doc: productID
    })

    const product = useSelector((state) => state.firestore.data.products && state.firestore.data.products[productID])

    const addToCart = async () => {
        // to add firebase logic
        if (productID && state.quantity && !isEmpty(product)) {
            setIsBuyDisabled(true)
            try {
                await cart.addProductToCart(productID, product.price, state.quantity)
                setState({
                    ...state,
                    quantity: 1,
                })
            } catch (err) {

            }
            setIsBuyDisabled(false)
        }

        // show snackbar with succes or error
    }

    return (
        <> {isLoaded(product) && !isEmpty(product) &&
            <Container maxWidth='lg' style={{ marginBottom: 24, marginTop: 24 }}>
                <Paper className={classes.paper}>
                    <Grid container direction="column" justify='center' spacing={4}>
                        <Grid container item spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <img src={product.image} alt={product.name} className={classes.image} />
                            </Grid>
                            <Grid container item xs={12} sm={6} direction='column' justify='space-around' alignItems='center' spacing={2}>
                                <Grid item>
                                    {/* {title} */}
                                    <Typography variant='h4' color='primary' align='center'>
                                        <Box fontWeight='fontWeightMedium'>
                                            {product.name}
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {/* price */}
                                    <Typography variant='h4' color='error'>
                                        <Box fontWeight='fontWeightBold'>
                                            Preț: {product.price} RON
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid container item direction='column' alignItems='center' style={{ padding: 8 }} spacing={2}>
                                    {/* quantity selector */}
                                    <Grid item>
                                        <Typography variant='h6' className={classes.infoPalette}>
                                            Cantitate
                                    </Typography>
                                    </Grid>
                                    <Grid item style={{ width: '50%', minWidth: 180, }}>
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
                                                variant='h6'
                                                component='div'
                                            >
                                                {state.quantity}
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
                                    <Grid item >
                                        {/* add to cart */}
                                        <ButtonGroup >
                                            <Button
                                                color='primary'
                                                variant='contained'
                                                size='large'
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={addToCart}
                                                disabled={isBuyDisabled}
                                            >
                                                Adaugă în coș
                                        </Button>

                                            {/* add to favorites */}
                                            <Button
                                                className={classes.favoriteButton}
                                                variant='contained'
                                                size='small'
                                                onClick={addToFavorite}
                                                disabled={isFavoriteDisabled}
                                            >
                                                <FavoriteIcon />
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {/* separator toolbar?*/}
                        </Grid>
                        <Grid container direction='column' item spacing={2}>
                            {/* <Grid item> */}
                            {/* categorie */}
                            {/* Categorie: {product.category} */}
                            {/* </Grid> */}
                            <Grid item>
                                {/* descriere */}
                                Descriere: {product.description}
                            </Grid>
                            <Grid item>
                                {/* id produs */}
                            ID: {productID}
                            </Grid>
                            <Grid item>
                                {/* disclaimer */}
                                <Typography variant='caption'>
                                    Informația afișată poate fi incompletă sau neactualizată. Consultați întotdeauna produsul fizic pentru cele mai exacte informații și avertismente. Pentru mai multe informații contactați vânzătorul sau producătorul.
                            </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <ProductsRow recentProducts />
                            {/* produse similare */}
                        </Grid>
                    </Grid>
                </Paper>
            </Container >
        }
        </>
    )
}
