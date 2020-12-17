import { Grid, MenuItem, Select, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'react-redux-firebase'
import { firestoreDB } from '../..'

export default function AddressForm({ address, setAddress, addressKey, setAddressKey }) {
    const firestore = firestoreDB
    const auth = useSelector(state => state.firebase.auth);


    const [componentAddressKey, setComponentAddressKey] = useState('')
    const [componentAddress, setComponentAddress] = useState({})
    const [addresses, setAddresses] = useState([])

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
                    data: {
                        apartment: '',
                        block: '',
                        floor: '',
                        intercom: '',
                        label: '',
                        number: '',
                        street: '',
                    }
                })
            default:
                return setAddress(addresses[e.target.value])
        }
    }

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            data: {
                ...address.data,
                [e.target.id]: e.target.value
            }
        })
    }

    //fetch addresses
    useEffect(() => {
        if (!isEmpty(auth)) {
            const unsubscribe = firestore.collection('addresses').where('userID', '==', auth.uid)
                .onSnapshot(function (querySnapshot) {
                    var docs = []
                    querySnapshot.forEach((doc) => {
                        docs.push({ id: doc.id, data: doc.data() })
                    })
                    setAddresses(docs)
                })
            return () => unsubscribe()
        }
    }, [auth, firestore])

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
                        {address.data.label}
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
                            value={address.data.street || ''}
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
                            <TextField required value={address.data.number || ''} onChange={handleAddressChange} id="number" label="Număr" variant="outlined" key='number' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField value={address.data.block || ''} id="block" onChange={handleAddressChange} label="Bloc" variant="outlined" key='block' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
                            <TextField value={address.data.floor || ''} id="floor" onChange={handleAddressChange} label="Etaj" variant="outlined" key='floor' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField value={address.data.apartment || ''} id="apartment" onChange={handleAddressChange} label="Apartament" variant="outlined" key='apartment' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
                            <TextField value={address.data.intercom || ''} id="intercom" onChange={handleAddressChange} label="Interfon" variant="outlined" key='intercom' fullWidth />
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8 }}>
                            <TextField disabled={addressKey >= 0} value={address.data.label || ''} onChange={handleAddressChange} required id="label" label="Etichetă" variant="outlined" key='label' fullWidth />
                        </Grid>
                    </Grid>
                </>}
        </Grid>
    )
}
