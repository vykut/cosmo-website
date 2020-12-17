import React, { memo, useEffect, useState } from 'react'
import ProductBox, { MemoizedProductBox } from '../ProductBox'
import { makeStyles } from '@material-ui/core/styles'
import { ChevronRight } from '@material-ui/icons'
import { Grid, Link, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { firestoreDB } from '../..'

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

export default function ProductsRow({ categoryID, recentProducts }) {
    const classes = useStyles()
    const firestore = firestoreDB

    const [products, setProducts] = useState([])
    const [category, setCategory] = useState({})

    useEffect(() => {
        if (categoryID) {
            const categoryRef = firestore.collection('categories').doc(categoryID)
            categoryRef.get().then(function (doc) {
                setCategory({ id: doc.id, data: doc.data() })
            })
        }
    }, [categoryID, firestore])

    useEffect(() => {
        if (categoryID) {
            firestore.collection('products').where('categories', 'array-contains', categoryID).limit(5).get()
                .then(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach((doc) => {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setProducts(docs)
                })
        } else if (recentProducts) {
            firestore.collection('products').orderBy('createdAt', 'desc').limit(5).get()
                .then(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach((doc) => {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setProducts(docs)
                })
        }
    }, [categoryID, firestore, recentProducts])

    const categoryURL = () => {
        var url = ''
        if (categoryID && category && category.data) {
            url = '/categorii'
            category.data.parentCategories.forEach((categoryID) => {
                url += `/${categoryID}`
            })
            url += `/${category.id}`
        }
        if (recentProducts) {
            url += '/toate-categoriile'
        }
        return url
    }

    return (<>
        {!!products.length && <Grid
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
                        {categoryID ? category && category.data ? category.data.name : '' : "Produse recente"}
                    </Typography>
                </Grid>
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
                {products.map((product, index) => {
                    return <Grid item key={index}>
                        <MemoizedProductBox productID={product.id} />
                    </Grid>
                })}
            </Grid>
        </Grid>
        }
    </>
    )
}

export const MemoizedProductsRow = memo(ProductsRow)
