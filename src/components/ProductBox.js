import { Badge, Box, Button, IconButton, Paper, Typography } from '@material-ui/core'
import React, { memo, useCallback, useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { fade, makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { isEmpty, isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { firebaseFunctions } from '..';
import { useCart } from '../contexts/CartContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        maxWidth: 200,
    },
    container: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.palette.primary.main,
    },
    quantitySelector: {
        borderRadius: 5,
        border: 1,
        borderColor: theme.palette.info.main,
        borderStyle: 'solid',
        display: 'flex',
        alignContent: 'stretch',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: 30,
    },
    quantityTypography: {
        color: theme.palette.info.main,
        maxWidth: 180,
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
        width: 50,
        color: theme.palette.info.main,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        marginBottom: theme.spacing(3),
        // maxHeight: 100,
        // maxWidth: 100,
        width: 'auto',
        height: 100,
        margin: 'auto',
    },
    favorite: {
        color: theme.palette.error.main,
        "&:hover": {
            backgroundColor: fade(theme.palette.error.main, theme.palette.action.hoverOpacity),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        }
    }
}));

export default function ProductBox({ productID }) {
    const classes = useStyles()
    const functions = firebaseFunctions
    const cart = useCart()

    const [quantity, setQuantity] = useState(1)
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
    const [isBuyDisabled, setIsBuyDisabled] = useState(false)

    const addToFavorite = async () => {
        setIsFavoriteLoading(true)
        try {
            await functions.httpsCallable('favoriteProduct')({ id: productID })
        } catch (err) {
            console.log(err)
        }
        setIsFavoriteLoading(false)
    }

    //fetch product by id
    useFirestoreConnect({
        collection: 'products',
        doc: productID
    })

    const profile = useSelector(state => state.firebase.profile)

    const fetchedProduct = useSelector(
        ({ firestore: { data } }) => data.products && data.products[productID]
    )

    const productURL = useCallback(() => {
        var url = '/categorii'
        fetchedProduct.categories.forEach((category) => {
            url += `/${category}`
        })
        url += `/p/${productID}`
        return url
    }, [productID, fetchedProduct])

    const adjustQuantity = (increment) => {
        if (increment && quantity < 20) {
            setQuantity(quantity + 1)
            return
        }
        if (!increment && quantity > 1) {
            setQuantity(quantity - 1)
            return
        }
    }

    const addToCart = async () => {
        // to add firebase logic
        if (productID && quantity && fetchedProduct && fetchedProduct.price) {

            try {
                setIsBuyDisabled(true)
                await cart.addProductToCart(productID, fetchedProduct.price, quantity)
                setQuantity(1)
            } catch (err) {

            } finally {
                setIsBuyDisabled(false)
            }
        }

        // show snackbar with succes or error
    }

    return (
        <>
            { isLoaded(fetchedProduct) && !isEmpty(fetchedProduct) && <Paper className={classes.paper}>
                <Badge badgeContent={
                    <IconButton className={classes.favorite} onClick={addToFavorite} disabled={isFavoriteLoading}>
                        {!isEmpty(profile) && profile.favoriteProducts && profile.favoriteProducts.includes(productID) ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon color='error' />}
                    </IconButton>
                } >
                    <Link className={classes.container} to={productURL}>
                        <img className={classes.image} src={fetchedProduct.image} alt={fetchedProduct.name} />
                        <Typography color='primary' align='center' style={{ maxWidth: 200, height: 48 }} >
                            {fetchedProduct.name}
                        </Typography>
                    </Link>
                </Badge>
                <div className={classes.paper} style={{ padding: 10 }}>
                    <Typography className={classes.quantityTypography} variant='button'>
                        Cantitate
                        </Typography>
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
                        >
                            {quantity}
                        </Typography>
                        <IconButton
                            className={classes.quantityIncrement}
                            onClick={() => { adjustQuantity(true) }}
                            id='increment'
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                </div>
                <Typography variant='h6' color='error' style={{ marginBottom: 10 }}>
                    <Box fontWeight='fontWeightBold'>
                        {fetchedProduct.price} RON
                    </Box>
                </Typography>
                <Button
                    color='primary'
                    variant='contained'
                    startIcon={<ShoppingCartIcon />}
                    onClick={addToCart}
                    disabled={isBuyDisabled}
                >
                    Adaugă în coș
                    </Button>
            </Paper>}
        </>
    )
}

export const MemoizedProductBox = memo(ProductBox)
