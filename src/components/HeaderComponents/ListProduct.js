import { Box, Button, Drawer, Grid, IconButton, Link, makeStyles, Paper, Typography, withStyles } from '@material-ui/core'
import React, { useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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

    const [state, setState] = useState({ quantity: 1 })

    // fetch product from ID

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
        if (!increment && state.quantity === 1) {
            removeProductFromCart()
        }
    }

    const removeProductFromCart = () => {
        // remove item from cart
    }

    return (
        <Paper className={classes.paper}>
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <Link href={`/categorii/${product.category}/${product.id}`} underline='none'>
                        <Grid container>
                            <Grid item xs={3} >
                                <img src={product.image} alt={product.name} className={classes.image} />
                            </Grid>
                            <Grid container item direction='column' xs={9} justify='space-around' alignItems='center'>
                                <Grid item >
                                    <Typography >
                                        {product.name}
                                    </Typography>
                                </Grid>
                                <Grid container item justify='space-around'>
                                    <Grid item>
                                        <Typography color='textPrimary'>
                                            Preț {product.price} RON
                                            </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography component='div' color='textPrimary'>
                                            <Box fontWeight='fontWeightBold'>
                                                Subtotal {state.quantity * product.price} RON
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
                                    {state.quantity}
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
