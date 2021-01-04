import { Button, ButtonGroup, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { firebaseFunctions, firestoreDB } from '../..';
import { isEmpty } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoTextColor: {
        color: theme.palette.info.main
    },
    infoButtonColor: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.info.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.info.main
            }
        }
    },
    errorButtonColor: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.error.main
            }
        }
    },
}))

export default function PersonalData() {
    const classes = useStyles()
    const functions = firebaseFunctions

    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    //fetch userData
    const profile = useSelector(state => state.firebase.profile)

    useEffect(() => {
        if (!isEmpty(profile)) {
            setUserData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
            })
        }
    }, [profile])

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value
        })
    }

    const updateUserData = (e) => {
        e.preventDefault()
        // call firestore db
        setIsLoading(true)
        try {
            functions.httpsCallable('editPersonalData')({ firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone })
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)

    }

    return (
        <Paper className={classes.paper}>
            <form onSubmit={updateUserData}>
                <Grid container direction='column' spacing={2}>
                    <Grid item>
                        <Typography variant='h6' className={classes.infoTextColor}>
                            Date personale
                            </Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            value={userData.email || ''}
                            label="Email"
                            variant="outlined"
                            fullWidth
                            key='Email'
                            id='email'
                            disabled
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            value={userData.firstName || ''}
                            onChange={handleChange}
                            id="firstName"
                            label="Prenume"
                            variant="outlined"
                            fullWidth
                            key='fname'
                            autoComplete='fname'
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            value={userData.lastName || ''}
                            onChange={handleChange}
                            id="lastName"
                            label="Nume"
                            variant="outlined"
                            fullWidth
                            key='lname'
                            autoComplete='lname'
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            value={userData.phone || ''}
                            onChange={handleChange}
                            id="phone"
                            label="Telefon"
                            variant="outlined"
                            key='phone'
                            autoComplete='tel'
                            disabled={isLoading}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            id='save'
                            type='submit'
                            color='primary'
                            variant='contained'
                            disabled={isLoading}
                        >
                            Actualizează datele
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}