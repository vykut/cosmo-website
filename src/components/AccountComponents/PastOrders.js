import { Grid, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { firebaseFunctions } from '../..'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoTextColor: {
        color: theme.palette.info.main
    }
}))


export default function PastOrders() {
    const classes = useStyles()
    const functions = firebaseFunctions

    const [orderKey, setOrderKey] = useState(0)
    const [order, setOrder] = useState({})
    const [pastOrders, setPastOrders] = useState([])

    // fetch orders
    useEffect(() => {
        async function fetchPastOrders() {
            try {
                const pastOrders = await functions.httpsCallable('getPastOrders')({ request: 'pls no cors ty' })
                console.log(pastOrders)
                setPastOrders(pastOrders.data)
                setOrderKey(0)
            } catch (err) {
                console.log(err)
            }
        }
        fetchPastOrders()
    }, [functions])

    const handleSelectChange = (e) => {
        setOrderKey(e.target.value ? e.target.value : 0)
        setOrder(pastOrders[e.target.value])
    }

    return (
        <Paper className={classes.paper}>
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <Typography className={classes.infoTextColor} variant='h6'>
                        Comenzile tale
                    </Typography>
                </Grid>
                <Grid item >
                    {/* <FormControl required fullWidth> */}
                    <Select
                        value={orderKey}
                        onChange={handleSelectChange}
                        displayEmpty
                        variant='outlined'
                        fullWidth
                    >
                        {pastOrders.map((order, index) => <MenuItem value={index} key={index}>
                            {order.createdAt.toLocaleDateString('ro-RO')}
                        </MenuItem>)}
                    </Select>
                </Grid>
                {!!pastOrders.length && <Grid container item direction='column' spacing={1}>
                    <Grid container item justify='space-between'>
                        <Grid item>
                            <Typography>
                                Stare: {order.state}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                {order.rider && `Livrată de: ${order.rider.name}`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item justify='space-between'>
                        <Grid item>
                            <Typography>
                                Adresă: {order.address.label}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Plată: {order.payment}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item >
                        <TableContainer>
                            <Table size='small' >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produs</TableCell>
                                        <TableCell align='right'>Cantitate</TableCell>
                                        <TableCell align='right'>Preț</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.products.map((product, index) => {
                                        return <TableRow key={index}>
                                            <TableCell component='th' scope='row'>
                                                {product.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {product.quantity}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {product.price}
                                            </TableCell>
                                        </TableRow>
                                    })}

                                </TableBody>
                                <TableHead>
                                    <TableRow>
                                        <TableCell >
                                            Total
                                        </TableCell>
                                        <TableCell align='right' colSpan={2}>
                                            {order.totalPrice} RON
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>

                    </Grid>
                </Grid>}
            </Grid>
        </Paper>
    )
}
