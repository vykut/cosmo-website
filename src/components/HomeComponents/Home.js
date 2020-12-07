import { Box, Container, makeStyles } from '@material-ui/core'
import React from 'react'
import ProductBox from '../ProductBox'

export const useStyles = makeStyles((theme) => ({
    home: {
        marginTop: theme.spacing(2),
    },
}))

export default function Home() {
    const classes = useStyles()


    return (
        <Box className={classes.home}>
            {/* left menu component*/}
            <Container maxWidth={false}>
                <ProductBox />
            </Container>
        </Box>
    )
}