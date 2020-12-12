import { FormControl, Grid, makeStyles, MenuItem, Paper, Select, TextField } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
}))

export default function AddressForm({ address, setAddress }) {
    const classes = useStyles()

    const [addressKey, setAddressKey] = useState('')

    const handleSelectChange = (e) => {
        setAddressKey(e.target.value)
        switch (e.target.value) {
            case '':
            case -1:
                setAddress({
                    apartment: '',
                    block: '',
                    floor: '',
                    intercom: '',
                    label: '',
                    number: '',
                    street: '',
                })
                break
            default:
                return setAddress(addresses[e.target.value])
        }
    }

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.id]: e.target.value
        })
    }

    //fetch addresses
    const addresses = [
        {
            apartment: '34',
            block: 'B',
            floor: '3',
            intercom: 'floor 3',
            label: 'Acasă',
            number: 17,
            street: 'Sfintii Voievozi',
        },
        {
            apartment: '',
            block: '',
            floor: '9',
            intercom: 'Vodafone',
            label: 'Serviciu',
            number: 2,
            street: 'Calea Dorobantilor',
        },
    ]

    return (
        <Paper className={classes.paper} >
            <Grid container direction='column' spacing={2} >
                <Grid item >
                    {/* <FormControl required fullWidth> */}
                    <Select
                        value={addressKey}
                        onChange={handleSelectChange}
                        displayEmpty
                        variant='outlined'
                        fullWidth
                        required
                        defaultValue='Selectează adresa de livrare'
                    >
                        <MenuItem value={''} disabled>Selectează adresa de livrare</MenuItem>
                        {addresses.map((address, index) => <MenuItem value={index} key={index}>
                            {address.label}
                        </MenuItem>)}
                        <MenuItem value={-1}>Adresă nouă</MenuItem>
                    </Select>
                    {/* </FormControl> */}
                </Grid>
                {addressKey !== '' && <>
                    <Grid item>
                        <TextField
                            required
                            value={address.street || ''}
                            onChange={handleAddressChange}
                            id="street"
                            label="Strada"
                            variant="outlined"
                            fullWidth key='street'
                            autoComplete='street-address'
                        />
                    </Grid>
                    <Grid container item spacing={2}>
                        <Grid item xs={6}>
                            <TextField required value={address.number || ''} onChange={handleAddressChange} id="number" label="Număr" variant="outlined" key='number' />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={address.block || ''} id="block" onChange={handleAddressChange} label="Bloc" variant="outlined" key='block' />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={address.floor || ''} id="floor" onChange={handleAddressChange} label="Etaj" variant="outlined" key='floor' />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={address.apartment || ''} id="apartment" onChange={handleAddressChange} label="Apartament" variant="outlined" key='apartment' />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField value={address.intercom || ''} id="intercom" onChange={handleAddressChange} label="Interfon" variant="outlined" key='intercom' />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField disabled={addressKey >= 0} value={address.label || ''} onChange={handleAddressChange} required id="label" label="Etichetă" variant="outlined" key='label' />
                        </Grid>
                    </Grid>
                </>}
            </Grid>
        </Paper>
    )
}
