import React, { useState } from 'react'
import { Chip, Grid, makeStyles, Paper } from '@material-ui/core';
import ProductBox from '../ProductBox';
import Pagination from '@material-ui/lab/Pagination';
import CosmoMenu from './Menu';
import FilterMenu from './FilterMenu';
import EuroIcon from '@material-ui/icons/Euro';
import ProductsPageHeader from './ProductsPageHeader';

export const useStyles = makeStyles((theme) => ({
    productsGrid: {
        justifyContent: "flex-start",
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        },
    },
}))

export default function ProductsPage() {

    const classes = useStyles()

    const product = {
        image: "https://www.auchan.ro/public/images/hac/h0b/h00/bere-blonda-heineken-033l-8856591794206.jpg",
        name: 'Bere blonda sticla 0.33 l Heineken',
        price: 5,
        id: 'bere-heineken',
        category: 'bauturi',
    }

    const [products, setProducts] = useState([product, product, product, product, product, product,
        product, product, product, product, product, product, product, product, product, product,
        product, product, product, product])



    const [pages, setPages] = useState(3)
    const [state, setState] = useState({ sort: 0, numberOfProducts: 24 })
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState({})

    const defaultValue = { price: [10, 323] }

    // set default value on fetch
    //fetch products

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
                [name]: null
            })
        } else {
            setFilter({
                ...filter,
                [name]: value
            })
        }
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
                <Grid item container direction='column' justify='center' alignContent='center' alignItems='center' sm>
                    <Grid item style={{ width: '100%' }} >
                        <ProductsPageHeader sort={state.sort} numberOfProducts={state.numberOfProducts} handleChange={handleChange} />
                    </Grid>
                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        className={classes.productsGrid}
                    >
                        {products.map((product, index) => {
                            return <Grid item key={index}>
                                <ProductBox product={product} key={index} />
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
