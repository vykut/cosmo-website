import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core'
import { useSelector } from 'react-redux';
import { isEmpty, useFirebase } from 'react-redux-firebase';
import { Badge, Button, fade, IconButton, List, ListItem, ListItemSecondaryAction, makeStyles, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { firestoreDB } from '../..';
import { useCart } from '../../contexts/CartContext';

const useStyles = makeStyles(theme => ({
    favorite: {
        color: theme.palette.error.main,
        "&:hover": {
            backgroundColor: fade(theme.palette.error.main, theme.palette.action.hoverOpacity),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        }
    },
    add: {
        color: theme.palette.primary.main,
    },
    button: {
        padding: theme.spacing(1, 3),
        textTransform: 'none',
    },
    label: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    menu: {
        maxHeight: 240,
        maxWidth: 300,
    },
}))

export default function FavoritesMenu() {
    const [state, setState] = useState({
        isFavoriteDisabled: [],
        isAddDisabled: [],
        favoriteProducts: []
    })
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles()
    const firestore = firestoreDB
    const cart = useCart()
    const firebase = useFirebase();


    const profile = useSelector(state => state.firebase.profile)


    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!isEmpty(profile) && profile.favoriteProducts) {
            const productsRef = firestore.collection('products')
            const refs = profile.favoriteProducts.map(id => productsRef.doc(id))
            Promise.all(refs.map(ref => ref.get()))
                .then(docs => {
                    setState({
                        isFavoriteDisabled: Array(docs.length).fill(false),
                        isAddDisabled: Array(docs.length).fill(false),
                        favoriteProducts: docs.map(doc => {
                            return { id: doc.id, data: doc.data() }
                        })
                    })
                })
        }
    }, [firestore, profile])



    const handleClick = (event) => {
        if (state.favoriteProducts && state.favoriteProducts.length)
            setAnchorEl(event.currentTarget);
    };


    const removeFromFavorite = (index) => () => {
        const product = state.favoriteProducts[index]
        const favs = state.isAddDisabled
        favs[index] = true
        setState({
            ...state,
            isFavoriteDisabled: favs
        })
        firestore.collection('users').where('email', '==', profile.email).limit(1).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    firestore.collection('users').doc(doc.id).update({ favoriteProducts: firebase.firestore.FieldValue.arrayRemove(product.id) })
                    favs[index] = false
                    setState({
                        ...state,
                        isFavoriteDisabled: favs
                    })
                })
            })
    }

    const addProductToCart = (index) => async () => {
        const product = state.favoriteProducts[index]
        const adds = state.isAddDisabled
        adds[index] = true
        setState({
            ...state,
            isAddDisabled: adds
        })
        await cart.addProductToCart(product.id, product.data.price, 1)
        adds[index] = false
        setState({
            ...state,
            isAddDisabled: adds
        })
    }

    const productURL = (index) => {
        var url = '/categorii'
        const product = state.favoriteProducts[index]
        product.data.categories.forEach(category => {
            url += `/${category}`
        })
        url += `/p/${product.id}`
        return url
    }

    return (
        <>
            <Button
                disableElevation
                color='inherit'
                size='large'
                className={classes.button}
                onClick={handleClick}
            >
                <Typography variant='body1' className={classes.label}>
                    Favorite
                            </Typography>
                <Badge badgeContent={!isEmpty(profile) && profile.favoriteProducts ? profile.favoriteProducts.length : 0} color="secondary">
                    <FavoriteIcon />
                </Badge>
            </Button>
            <Menu
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: classes.menu }}
            >
                {state.favoriteProducts.map((product, index) => {
                    return <ListItem key={index}>
                        <IconButton edge='start' className={classes.favorite} onClick={removeFromFavorite(index)} disabled={state.isFavoriteDisabled[index]}>
                            <FavoriteIcon color='error' />
                        </IconButton>
                        {/* <ListItemText component={Link} to={productURL(index)}> */}
                        <Link component={RouterLink} to={productURL(index)} color='textPrimary'>
                            <Typography color='textPrimary'>
                                {product.data.name}
                            </Typography>
                        </Link>
                        {/* </ListItemText> */}
                        <ListItemSecondaryAction>
                            <IconButton edge='end' className={classes.add} onClick={addProductToCart(index)} disabled={state.isAddDisabled[index]}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })
                }
            </Menu>
        </>
    );
}