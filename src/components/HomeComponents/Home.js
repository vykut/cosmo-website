import { Container, makeStyles } from '@material-ui/core'
import React, { useEffect, useState, useCallback } from 'react'
import ProductBox from '../ProductBox'


export const useStyles = makeStyles((theme) => ({
    home: {
        marginTop: theme.spacing(2),
    },
    productsContainer: {
        display: 'flex'
    },
    product: {
        position: 'relative'
    }
}))


export default function Home() {
    const classes = useStyles()

    const settings = {
        dots: true,
        infinite: false,
        // speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        // <Container>
        <ProductBox />
        // </Container>
    )
}