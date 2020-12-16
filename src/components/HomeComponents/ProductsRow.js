import React, { memo, useCallback, useEffect, useState } from 'react'
import ProductBox from '../ProductBox'
import { makeStyles } from '@material-ui/core/styles'
import { ChevronRight } from '@material-ui/icons'
import { Grid, Link, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { firestoreConnect, isEmpty, populate, useFirestoreConnect, isLoaded, useFirestore } from 'react-redux-firebase'
import { connect, useSelector } from 'react-redux'
import { compose } from 'redux'
import { getFirestore } from 'redux-firestore'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        // padding: theme.spacing(1),
    },
    rowTitleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    rowContainer: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    productsContainer: {
    },
    title: {
        color: theme.palette.info.main
    },
    image: {
        color: theme.palette.info.main
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

export default function ProductsRow({ categoryID }) {
    const classes = useStyles()
    const firestore = useFirestore()

    const [productsIDs, setProductsIDs] = useState({})

    useFirestoreConnect([{
        collection: 'categories',
        doc: categoryID,
        subcollections: [{ collection: 'products' }],
        storeAs: categoryID
    }])

    useFirestoreConnect({
        collection: 'categories',
        doc: categoryID,
    })

    const fetchedCategory = useSelector(
        ({ firestore: { data } }) => data.categories && data.categories[categoryID]
    )

    const fetchedProducts = useSelector(((state) => state.firestore.data[categoryID]))

    const categoryURL = () => {
        var url = '/categorii'
        if (fetchedCategory.parentCategory) {
            url += `/${fetchedCategory.parentCategory}`
        }
        url += `/${categoryID}`
        return url
    }

    return (<>
        { isLoaded(fetchedCategory) && !isEmpty(fetchedCategory) && <Grid
            container
            direction='column'
            justify='space-between'
        >
            <Grid
                container
                justify='space-between'
                direction='row'
            >
                <Grid item >
                    <Typography variant='h5' style={{ marginBottom: 20 }} className={classes.title}>
                        {fetchedCategory.name}
                    </Typography>
                </Grid>
                {/* <div style={{ flexGrow: '5' }}></div> */}
                <Grid item>
                    <Link component={RouterLink} to={categoryURL} underline='none' className={classes.link}>
                        <Typography className={classes.title}>
                            Descoperă produsele
                        </Typography>
                        <ChevronRight fontSize='large' className={classes.image} />
                    </Link>
                </Grid>
            </Grid>
            <Grid container item
                direction="row"
                justify="space-around"
            >
                {isLoaded(fetchedProducts) && !isEmpty(fetchedProducts) && Object.keys(fetchedProducts).map((productID, index) => {
                    return <Grid item key={index}>
                        <ProductBox productID={productID} />
                    </Grid>
                })}
            </Grid>
        </Grid>
        }
    </>
    )
}

export const MemoizedProductsRow = memo(ProductsRow)
