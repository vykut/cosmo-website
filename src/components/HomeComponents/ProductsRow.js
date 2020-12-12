import React, { memo } from 'react'
import ProductBox from '../ProductBox'
import { makeStyles } from '@material-ui/core/styles'
import { ChevronRight } from '@material-ui/icons'
import { Grid, Link, Typography } from '@material-ui/core'

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

export default function ProductsRow({ category, products }) {
    const classes = useStyles()

    return (
        <Grid
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
                        {category}
                    </Typography>
                </Grid>
                {/* <div style={{ flexGrow: '5' }}></div> */}
                <Grid item>
                    <Link href='#' underline='none' className={classes.link}>
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
                        <ProductBox product={product} key={index} />
                    </Grid>
                })}
            </Grid>
        </Grid>
    )
}

export const MemoizedProductsRow = memo(ProductsRow)
