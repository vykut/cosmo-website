import { Breadcrumbs, Grid, Link, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useState, useCallback } from 'react'
import CosmoMenu from './Menu';
import ProductsPage from './ProductsPage';
import { firebaseConnect, firestoreReducer, isEmpty, isLoaded, populate, useFirestoreConnect } from 'react-redux-firebase';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import ProductsRow from './ProductsRow';

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

    useFirestoreConnect([{
        collection: 'categories',
        doc: '0klQV3KLSaG9uCWZofCL',
        subcollections: [{ collection: 'categories' }],
        storeAs: '0klQV3KLSaG9uCWZofCL-products'
    }])

    const products = useSelector((state) => state.firestore.data)
    console.log(products, 'home')

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
                    <ProductsRow categoryID='dOWcOfCSyXGPAwcRJIjD' />
                </Grid>
                <Grid item>
                    <ProductsRow categoryID='Dtde6UJzR1aVIWiP3EX6' />
                </Grid>
                {/* <ProductsPage category='{'yolo'}' /> */}
            </Grid >
        </div >
    )
}

