import { Breadcrumbs, Grid, Link, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useState, useCallback } from 'react'
import ProductsRow from './ProductsRow'
import CosmoMenu from './Menu';
import StickyBox from "react-sticky-box/dist/esnext";
import ProductsPage from './ProductsPage';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        margin: theme.spacing(2),
    },
    menuContainer: {
    },
    menuProductsContainer: {
        display: 'flex',

    },
    listItem: {
        // marginTop: theme.spacing(1)
    },
    mainContainer: {
        padding: theme.spacing(2)
    },
}))

export default function Home() {
    const classes = useStyles()

    const product = {
        image: "https://www.auchan.ro/public/images/hac/h0b/h00/bere-blonda-heineken-033l-8856591794206.jpg",
        name: 'Bere blonda sticla 0.33 l Heineken',
        price: 5,
        id: 'bere-heineken',
        categorie: 'bauturi',
    }

    return (
        <div className={classes.mainContainer}>
            <Grid
                container
                item
                direction='column'
                justify="center"
                md
                spacing={4}
            >
                <Grid item>
                    <ProductsRow category='Produse recent adăugate în catalogul Cosmo Market' products={[product, product, product, product]} />
                </Grid>
                <Grid item>
                    <ProductsRow category='Mâncare gătită' products={[product, product, product, product]} />
                </Grid>
                {/* <ProductsPage category={'yolo'} /> */}
            </Grid >
        </div >
    )
}