import { Box, Button, ButtonGroup, Container, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import UpdateIcon from '@material-ui/icons/Update';

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


    const dummyUser = {
        email: 'email@email.com',
        firstName: 'ion',
        lastName: 'ionescu',
        phone: '0723134432'
    }

    const [enabled, setEnabled] = useState(false)
    const [userData, setUserData] = useState(dummyUser)


    //fetch userData

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value
        })
    }

    const handleClick = (type) => (e) => {
        switch (type) {
            case 'update':
                return setEnabled(true)
            case 'cancel':
                setUserData(dummyUser)
                return setEnabled(false)
            default:
                return setEnabled(false)
        }
    }

    const updateUserData = (e) => {
        e.preventDefault()
        // call firestore db
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
                            onChange={handleChange}
                            id="lastName"
                            label="Prenume"
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