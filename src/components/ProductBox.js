import { Badge, Button, IconButton, Link, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { fade, makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

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
        maxHeight: 100,
        maxWidth: 100,
        width: 'auto',
        height: 'auto',
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

export default function ProductBox({ product }) {
    const classes = useStyles()
    const [isFavorite, setIsFavorite] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const addToFavorite = () => {

        // to add firebase logic

        //then ->
        setIsFavorite(!isFavorite)

    }

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

    const addToCart = () => {
        // to add firebase logic
        // show snackbar with succes
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Badge badgeContent={
                    <IconButton className={classes.favorite} onClick={addToFavorite}>
                        {isFavorite ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon color='error' />}
                    </IconButton>
                } >
                    <Link href='#' className={classes.container}>
                        <img className={classes.image} src="https://www.auchan.ro/public/images/hac/h0b/h00/bere-blonda-heineken-033l-8856591794206.jpg" alt='Bere blonda sticla 0.33 l Heineken' />
                        <Typography color='primary' align='center' style={{ maxWidth: 200 }} >
                            Bere blondă sticlă 0.33 l Heineken
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
                <Button
                    color='primary'
                    variant='contained'
                    startIcon={<ShoppingCartIcon />}
                    onClick={addToCart}
                >
                    Adaugă în coș
                    </Button>
            </Paper>
        </>
    )
}
