import { FormControl, Grid, makeStyles, MenuItem, Paper, Select, TextField } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
}))

export default function AddressForm({ address, setAddress, addressKey, setAddressKey }) {
    const classes = useStyles()

    const [componentAddressKey, setComponentAddressKey] = useState('')
    const [componentAddress, setComponentAddress] = useState({})

    if (address === undefined || setAddress === undefined) {
        address = componentAddress
        setAddress = setComponentAddress
    }

    if (addressKey === undefined || setAddressKey === undefined) {
        addressKey = componentAddressKey
        setAddressKey = setComponentAddressKey
    }

    const handleSelectChange = (e) => {
        setAddressKey(e.target.value)
        switch (e.target.value) {
            case '':
            case -1:
                return setAddress({
                    apartment: '',
                    block: '',
                    floor: '',
                    intercom: '',
                    label: '',
                    number: '',
                    street: '',
                })
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
        <Grid container direction='column' >
            <Grid item>
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
            {addressKey !== '' &&
                <>
                    <Grid item style={{ paddingTop: 8 }}>
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
                    <Grid container item style={{ paddingTop: 8 }}>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
                            <TextField required value={address.number || ''} onChange={handleAddressChange} id="number" label="Număr" variant="outlined" key='number' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField value={address.block || ''} id="block" onChange={handleAddressChange} label="Bloc" variant="outlined" key='block' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
                            <TextField value={address.floor || ''} id="floor" onChange={handleAddressChange} label="Etaj" variant="outlined" key='floor' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField value={address.apartment || ''} id="apartment" onChange={handleAddressChange} label="Apartament" variant="outlined" key='apartment' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
                            <TextField value={address.intercom || ''} id="intercom" onChange={handleAddressChange} label="Interfon" variant="outlined" key='intercom' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField disabled={addressKey >= 0} value={address.label || ''} onChange={handleAddressChange} required id="label" label="Etichetă" variant="outlined" key='label' fullWidth />
                        </Grid>
                    </Grid>
                </>}
        </Grid>
    )
}
