import React from 'react'
import ProductBox from '../ProductBox'
import { makeStyles } from '@material-ui/core/styles'
import { ChevronRight } from '@material-ui/icons'
import { Link, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1),
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
        <div className={classes.container}>
            <div className={classes.rowTitleContainer}>
                <Typography variant='h5' style={{ marginBottom: 20 }} className={classes.title}>
                    {category}
                </Typography>
                <Link href='#' underline='none' className={classes.link}>

                    <Typography className={classes.title}>
                        Descoperă produsele
                    </Typography>
                    <ChevronRight fontSize='large' className={classes.image} />
                </Link>
            </div>
            <div className={classes.rowContainer}>
                <ProductBox product={products[0]} />
                <ProductBox product={products[1]} />
                <ProductBox product={products[2]} />
                <ProductBox product={products[3]} />
            </div>
        </div>
    )
}
