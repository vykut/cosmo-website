import React, { useEffect, useMemo, useState } from 'react'
import { Chip, Grid, makeStyles, Paper } from '@material-ui/core';
import { MemoizedProductBox } from '../ProductBox';
import Pagination from '@material-ui/lab/Pagination';
import CosmoMenu from './Menu';
import FilterMenu from './FilterMenu';
import EuroIcon from '@material-ui/icons/Euro';
import ProductsPageHeader from './ProductsPageHeader';
import { useParams, useRouteMatch } from 'react-router-dom';
import { firestoreDB } from '../..';
import { isEmpty, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

export const useStyles = makeStyles((theme) => ({
    productsGrid: {
        justifyContent: "flex-start",
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        },
    },
}))

export default function ProductsPage({ sortingKey = 0 }) {

    const { category, subcategory1, subcategory2 } = useParams();

    const { url } = useRouteMatch();

    const classes = useStyles()

    const defaultValue = { price: [0, 300] }

    const [pages, setPages] = useState(3)
    const [state, setState] = useState({ sort: sortingKey, numberOfProducts: 24 })
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState(defaultValue)

    const queryParam = useMemo(() => {
        if (subcategory2)
            return subcategory2
        if (subcategory1)
            return subcategory1
        if (category)
            return category
        if (url.includes('toate-categoriile'))
            return 'all'
    }, [category, subcategory1, subcategory2, url])


    // set default value on fetch
    //fetch products
    useFirestoreConnect([{
        collection: 'products'
    }])

    var products = useSelector(
        ({ firestore }) => {
            const products = firestore.data.products
            if (isEmpty(products))
                return []
            return Object.entries(products).filter(x => x[1].name)
                .map(product => { return { id: product[0], data: product[1] } })
        }
    )

    if (queryParam !== 'all')
        products = products.filter(product => product.data.categories.includes(queryParam))

    // useEffect(() => {
    //     var unsubscribe;
    //     var productsRef = firestore.collection('products')
    //     if (queryParam === 'all') {
    //         unsubscribe = productsRef.onSnapshot(querySnapshot => {
    //             var docs = []
    //             querySnapshot.forEach(function (doc) {
    //                 docs.push({ id: doc.id, data: doc.data() })
    //             })
    //             setProducts(docs)
    //         })
    //         return () => unsubscribe()
    //     } else {
    //         unsubscribe = productsRef.where('categories', 'array-contains', queryParam)
    //             .onSnapshot(function (querySnapshot) {
    //                 var docs = []
    //                 querySnapshot.forEach(function (doc) {
    //                     docs.push({ id: doc.id, data: doc.data() })
    //                 })
    //                 setProducts(docs)
    //             })
    //         return () => {
    //             console.log('productspage - unsubscribed')
    //             unsubscribe()
    //         }
    //     }
    // }, [firestore, queryParam])

    const handleChange = (e, value) => {
        setState({
            ...state,
            [`${e.target.name}`]: e.target.value
        })
    }

    const commitFilter = name => (e, value) => {
        // filter products
        if (JSON.stringify(value) === JSON.stringify(defaultValue[name])) {
            setFilter({
                ...filter,
                [name]: defaultValue[name]
            })
        } else {
            setFilter({
                ...filter,
                [name]: value
            })
        }
    }

    const sortedProducts = () => {
        var productsCopy = [...products]
        switch (state.sort) {
            case 0:
                return products
            case 1:
                productsCopy.sort(function (a, b) { return a.data.price > b.data.price ? 1 : -1 })
                break
            case 2:
                productsCopy.sort(function (a, b) { return a.data.price < b.data.price ? 1 : -1 })
                break
            case 3:
                productsCopy.sort(function (a, b) { return a.data.name > b.data.name ? 1 : -1 })
                break
            case 4:
                productsCopy.sort(function (a, b) { return a.data.name < b.data.name ? 1 : -1 })
                break
            default:
                return products
        }
        return productsCopy
    }

    function ProductsPagination() {
        return (
            <Pagination
                page={currentPage}
                count={pages}
                onChange={(e, value) => { setCurrentPage(value) }}
            />
        )
    }

    function FilterChip() {
        return (
            <Paper>
                {filter.price && <Chip
                    icon={<EuroIcon />}
                    label={`${filter.price[0]} < RON < ${filter.price[1]}`}
                    onDelete={() => setFilter({
                        ...filter,
                        price: null
                    })}
                />}
            </Paper>
        )
    }

    return (
        <div style={{ padding: 8 }}>
            <Grid container direction='row' justify='center' >
                <Grid item >
                    <Grid item>
                        {/* <FilterChip /> */}
                    </Grid>
                    <Grid item>
                        <CosmoMenu />
                    </Grid>
                    <Grid item>
                        <FilterMenu defaultValue={defaultValue.price} commitFilter={commitFilter} />
                    </Grid>
                </Grid>
                <Grid item container direction='column' justify='space-between' alignContent='center' alignItems='center' sm>
                    <Grid item style={{ width: '100%' }} >
                        <ProductsPageHeader sort={state.sort} numberOfProducts={state.numberOfProducts} handleChange={handleChange} setSearchQuery={setSearchQuery} />
                    </Grid>
                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        className={classes.productsGrid}
                    >
                        {sortedProducts()
                            .filter((product) => {
                                return product.data.price >= filter.price[0] && product.data.price <= filter.price[1] && product.data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(searchQuery)
                            })
                            .map((product) => {
                                return <Grid item key={product.id}>
                                    <MemoizedProductBox productID={product.id} />
                                </Grid>
                            })}
                    </Grid>
                    <Grid item>
                        <ProductsPagination />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    )
}
