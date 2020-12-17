import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import logoRider from '../../assets/logo-rider.png';
import React from 'react'

const useStyles = makeStyles((theme) => ({
    image: {
        height: 'auto',
        width: 300,
        margin: 'auto',
        display: 'block',
    },
}))

export default function OrderDetails() {
    const classes = useStyles()
    return (
        <>
            <Grid container item direction='column' spacing={2} justify='space-around' alignContent='center' alignItems='center'>
                <Grid item>
                    <Typography component='div'>
                        <Box fontWeight='fontWeightMedium'>
                            Comanda a fost trimisă către magazin. Vei primi o notificare de îndată ce aceasta va fi ridicată de un livrator. De asemenea, poți verifica statusul acesteia în secțiunea comenzi din contul tău.
                        </Box>
                    </Typography>
                </Grid>
                <Grid item>
                    <img src={logoRider} alt="logo-delivery-cosmo-market" className={classes.image} />
                </Grid>
            </Grid>
        </>
    )
}
