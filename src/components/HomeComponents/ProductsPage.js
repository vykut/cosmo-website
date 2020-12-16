import React, { useEffect, useState } from 'react'
import { Chip, Grid, makeStyles, Paper } from '@material-ui/core';
import ProductBox, { MemoizedProductBox } from '../ProductBox';
import Pagination from '@material-ui/lab/Pagination';
import CosmoMenu from './Menu';
import FilterMenu from './FilterMenu';
import EuroIcon from '@material-ui/icons/Euro';
import ProductsPageHeader from './ProductsPageHeader';
import { useParams, useRouteMatch } from 'react-router-dom';
import { firestoreDB } from '../..';

export const useStyles = makeStyles((theme) => ({
    productsGrid: {
        justifyContent: "flex-start",
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        },
    },
}))

export default function ProductsPage() {

    const { category, subcategory1, subcategory2 } = useParams();
    const { url, path } = useRouteMatch();
    const firestore = firestoreDB

    const classes = useStyles()

    const defaultValue = { price: [0, 300] }

    const [products, setProducts] = useState([])

    const [pages, setPages] = useState(3)
    const [state, setState] = useState({ sort: 0, numberOfProducts: 24 })
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState(defaultValue)



    // set default value on fetch
    //fetch products
    useEffect(() => {

        var unsubscribe;

        if (subcategory2) {
            unsubscribe = firestore.collection('products').where('subcategory2', '==', subcategory2)
                .onSnapshot(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach(function (doc) {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setProducts(docs)
                })
        } else if (subcategory1) {
            unsubscribe = firestore.collection('products').where('subcategory1', '==', subcategory1)
                .onSnapshot(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach(function (doc) {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setProducts(docs)
                })
        } else if (category) {
            unsubscribe = firestore.collection('products').where('category', '==', category)
                .onSnapshot(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach(function (doc) {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setProducts(docs)
                })
        }
        return () => {
            unsubscribe()
        }
    }, [category, firestore, subcategory1, subcategory2])

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
        let productsCopy = products
        switch (state.sort) {
            case 0:
                break
            case 1:
                productsCopy.sort(function (a, b) { return a.data.price > b.data.price })
                break
            case 2:
                productsCopy.sort(function (a, b) { return a.data.price < b.data.price })
                break
            case 3:
                productsCopy.sort(function (a, b) { return a.data.name > b.data.name })
                break
            case 4:
                productsCopy.sort(function (a, b) { return a.data.name < b.data.name })
                break
            default:
        }
        console.log(productsCopy)
        return productsCopy
    }

    function ProductsPagination() {
        return (
            <Pagination
                page={currentPage}
                count={pages}
                onChange={(e, value) => { setCurrentPage(value) }}
            // renderItem={(item) => (
            //     <PaginationItem
            //         component={Link}
            //         to={`${ca}${item.page === 1 ? '' : `?pagina=${item.page}`}`}
            //         {...item}
            //     />
            // )}
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
                            .map((product, index) => {
                                return <Grid item key={index}>
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
