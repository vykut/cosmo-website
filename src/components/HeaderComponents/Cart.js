import { Box, Button, Drawer, Grid, IconButton, makeStyles, Paper, Typography, withStyles } from '@material-ui/core'
import React, { useState } from 'react'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ListProduct from './ListProduct';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    drawer: {

    },
    paper: {
        backgroundColor: '#f7ffff',
        width: 400,

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


    //fetch cart

    const product = {
        image: "https://vistapointe.net/images/heineken-lager-wallpaper-3.jpg",
        name: 'Bere blondă sticlă 0.33 l Heineken',
        price: 5,
        id: 'bere-heineken',
        category: 'bauturi',
    }

    const products = [product, product, product, product, product, product,]


    return (
        <>
            <Grid container item direction='column' spacing={2}>
                {products.map((product, index) => {
                    return <Grid item key={index}>
                        <ListProduct product={product} />
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
                                    220 RON
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Button fullWidth color='primary' variant='contained' size='large' onClick={reviewOrder}>
                        Finalizează comanda
                </Button>
                </Grid>
            </Grid>
        </>
    )
}
