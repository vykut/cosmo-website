import { Grid, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'react-redux-firebase'
import { firebaseFunctions, firestoreDB } from '../..'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoTextColor: {
        color: theme.palette.info.main
    }
}))

// var pastOrders = [{
//     products: [{
//         name: 'Bere blondă sticlă 0.33 l Heineken',
//         price: 15,
//         quantity: 3,
//     },
//     {
//         name: 'Bere blondă sticlă 0.33 l Heineken',
//         price: 15,
//         quantity: 3,
//     }
//     ],
//     address: {
//         tag: 'Acasă',
//     },
//     date: new Date(2020, 10, 30),
//     payment: 'card',
//     rider: {
//         name: 'ion'
//     },
//     state: 'livrată',
//     totalPrice: 30,
// },
// {
//     products: [{
//         name: 'Bere blondă sticlă 0.33 l Heineken',
//         price: 150,
//         quantity: 30,
//     },
//     {
//         name: 'Bere blondă sticlă 0.33 l Heineken',
//         price: 150,
//         quantity: 30,
//     }
//     ],
//     address: {
//         tag: 'Serviciu',
//     },
//     date: new Date(2020, 11, 30),
//     payment: 'cash',
//     rider: {
//         name: 'ionel'
//     },
//     state: 'anulată',
//     totalPrice: 300,
// }
// ].sort((a, b) => { return b.date - a.date })


export default function PastOrders() {
    const classes = useStyles()
    const firestore = firestoreDB
    const functions = firebaseFunctions
    const auth = useSelector(state => state.firebase.auth);

    const [orderKey, setOrderKey] = useState(0)
    const [order, setOrder] = useState({})
    const [pastOrders, setPastOrders] = useState([])

    // fetch orders
    useEffect(() => {
        async function fetchPastOrders() {
            try {
                const pastOrders = await functions.httpsCallable('getPastOrders')({ request: 'pls no cors ty' })
                console.log(pastOrders)
                setPastOrders(pastOrders)
                setOrderKey(0)
            } catch (err) {
                console.log(err)
            }
        }
        fetchPastOrders()
    }, [functions])

    const handleSelectChange = (e) => {
        setOrderKey(e.target.value)
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
