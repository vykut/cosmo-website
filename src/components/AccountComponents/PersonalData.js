import { Button, ButtonGroup, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import UpdateIcon from '@material-ui/icons/Update';
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

    const [enabled, setEnabled] = useState(false)
    const [userData, setUserData] = useState({})


    //fetch userData
    const profile = useSelector(state => state.firebase.profile)

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value
        })
    }

    const handleClick = (type) => (e) => {
        switch (type) {
            case 'update':
                updateUserData(e)
                return setEnabled(true)
            case 'cancel':
                setUserData({
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phone: profile.phone,
                })
                return setEnabled(false)
            default:
                return setEnabled(false)
        }
    }

    const updateUserData = (e) => {
        e.preventDefault()
        // call firestore db
        try {
            functions.httpsCallable('editPersonalData')({ firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone })
        } catch (err) {
            console.log(err)
        }
        setEnabled(false)

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
                            value={userData.email}
                            defaultValue={!isEmpty(profile) && profile.email}
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
                            value={userData.firstName}
                            defaultValue={!isEmpty(profile) && profile.firstName}
                            onChange={handleChange}
                            id="firstName"
                            label="Prenume"
                            variant="outlined"
                            fullWidth
                            key='fname'
                            autoComplete='fname'
                            disabled={!enabled}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            value={userData.lastName}
                            defaultValue={!isEmpty(profile) && profile.lastName}
                            onChange={handleChange}
                            id="lastName"
                            label="Nume"
                            variant="outlined"
                            fullWidth
                            key='lname'
                            autoComplete='lname'
                            disabled={!enabled}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            value={userData.phone}
                            defaultValue={!isEmpty(profile) && profile.phone}
                            onChange={handleChange}
                            id="phone"
                            label="Telefon"
                            variant="outlined"
                            key='phone'
                            autoComplete='tel'
                            disabled={!enabled}
                            fullWidth
                        />
                    </Grid>
                    <Grid container item justify='flex-end'>
                        {enabled ?
                            (<>
                                <Grid item>
                                    <ButtonGroup>
                                        <Button onClick={handleClick("cancel")} id='cancel' className={classes.errorButtonColor} variant='contained' startIcon={<CloseIcon />}>
                                            Anulează
                                        </Button>
                                        <Button id='save' type='submit' color='primary' variant='contained' startIcon={<SaveIcon />}>
                                            Salvează
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </>)
                            :
                            (<Grid item>
                                <Button onClick={handleClick("update")} id='update' className={classes.infoButtonColor} variant='contained' startIcon={<UpdateIcon />}>
                                    Actualizează datele
                                </Button>
                            </Grid>)}
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}