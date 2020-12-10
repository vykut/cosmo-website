import React, { useState } from 'react'
import { Button, FormControl, Grid, InputAdornment, InputBase, InputLabel, makeStyles, OutlinedInput, Paper, Select, TextField, withStyles } from '@material-ui/core';
import ProductBox from '../ProductBox';
import { MemoryRouter, Route, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import FilterSelect from '../AuxiliaryComponents/FilterSelect';
import { Menu, MenuItem } from '@material-ui/core'
import CosmoMenu from './Menu';
import SearchIcon from '@material-ui/icons/Search';

export const useStyles = makeStyles((theme) => ({
    iconButton: {
        marginRight: theme.spacing(1),
        padding: theme.spacing(1, 0),
        minWidth: 50,
        marginLeft: -15,
        color: theme.palette.info.main,
    },
    input: {
        color: theme.palette.info.main,
    },
    formControl: {
    },
    outlinedInput: {
        borderColor: `${theme.palette.info.main} !important`,
        color: 'red',
    },
}))

const StyledOutlineInput = withStyles((theme) => ({
    root: {
    },
    notchedOutline: {
        borderColor: `${theme.palette.info.main} !important`,
    }
}))(OutlinedInput);

const StyledSelect = withStyles((theme) => ({
    // root: {
    // borderColor: `${theme.palette.info.main} !important`,
    // },
    // nativeInput: {
    outlined: {
        borderColor: `${theme.palette.info.main} !important`,
    }
    // }
}))(Select);

const StyledSearchIcon = withStyles((theme) => ({
    root: {
        color: theme.palette.info.main
    }
}))(SearchIcon);

export default function ProductsPage(props) {

    const classes = useStyles()

    const product = {
        image: "https://www.auchan.ro/public/images/hac/h0b/h00/bere-blonda-heineken-033l-8856591794206.jpg",
        name: 'Bere blonda sticla 0.33 l Heineken',
        price: 5

    }

    const [products, setProducts] = useState([product, product, product, product, product, product,
        product, product, product, product, product, product, product, product, product, product,
        product, product, product, product])
    const [cols, setCols] = useState(3)
    const [pages, setPages] = useState(3)
    const [state, setState] = useState({ filter: 0, numberOfProducts: 24 })
    const [currentPage, setCurrentPage] = useState(1)

    const { match, history } = props;
    const { params } = match;
    const { categorie } = params;
    //fetch products

    const handleChange = (e, value) => {
        setState({
            ...state,
            [`${e.target.name}`]: e.target.value
        })
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

    function ProductsPageHeader() {
        return (
            <Paper style={{ padding: 8, margin: 8 }}>
                <Grid container direction='row' justify='space-between' alignContent='center' alignItems='center'>
                    <Grid item xs>
                        <StyledOutlineInput
                            className={classes.input}
                            classes={{ root: classes.inputRoot }}
                            placeholder='Caută un produs'
                            variant='outlined'
                            margin='dense'
                            fullWidth
                            startAdornment={
                                <Button className={classes.iconButton} >
                                    <StyledSearchIcon />
                                </Button>
                            } />
                    </Grid>
                    <Grid container xs item justify='flex-end' spacing={2}>
                        <Grid item>
                            <StyledSelect
                                labelId="filter-label"
                                value={state.filter}
                                name='filter'
                                onChange={handleChange}
                                variant='outlined'
                                autoWidth
                                margin='dense'
                                classes={{ outlined: classes.outlinedInput }}
                            >
                                <MenuItem value={0}>După poziție</MenuItem>
                                <MenuItem value={1}>Preț crescător</MenuItem>
                                <MenuItem value={2}>Preț descrescător</MenuItem>
                                <MenuItem value={3}>Alfabetic A-Z</MenuItem>
                                <MenuItem value={4}>Alfabetic Z-A</MenuItem>
                            </StyledSelect>
                        </Grid>
                        <Grid item>
                            <StyledSelect
                                labelId="number-of-products-label"
                                value={state.numberOfProducts}
                                name='numberOfProducts'
                                onChange={handleChange}
                                variant='outlined'
                                margin='dense'
                            >
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={48}>48</MenuItem>
                                <MenuItem value={96}>96</MenuItem>
                            </StyledSelect>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    return (
        <div style={{ padding: 2 }}>
            <Grid container direction='row' justify='center'>
                <Grid item>
                    <CosmoMenu {...props} />
                </Grid>
                <Grid item container direction='column' justify='center' alignContent='center' alignItems='center' xs>
                    <Grid item style={{ width: '100%' }}>
                        <ProductsPageHeader />
                    </Grid>
                    <Grid
                        container
                        item
                        direction="row"
                        justify="center"
                        alignItems="center"
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
        </div>
    )
}
