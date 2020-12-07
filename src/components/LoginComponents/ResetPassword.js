import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext'
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    resetPasswordButton: {
        margin: theme.spacing(3, 0, 2),
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.error.main
            }
        }
    },
}));



export default function ResetPassword({ setAlert, setLoginComponent }) {
    const classes = useStyles();
    const { resetPassword } = useAuth()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    console.log(classes)

    async function handleSubmit(e) {
        e.preventDefault()
        setAlert({})

        try {
            setLoading(true)
            await resetPassword(email)
            setAlert({ severity: 'success', message: 'Link-ul de resetare a parolei a fost trimis pe email.' })
        } catch (error) {
            setAlert({ severity: 'error', message: error.message })
        }
        setLoading(false)
    }

    return (
        <Container component="main" maxWidth="xs">
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <Typography variant='body2' color='primary' paragraph align='justify'>
                    Un link de resetare a parolei va fi trimis la adresa specificată de tine, dacă există un cont în baza noastră de date.
                </Typography>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.resetPasswordButton}
                    disabled={loading}
                >
                    Resetează parola
                </Button>
            </form>
            <Grid container justify="flex-end">
                <Grid item>
                    <Link href="#" variant="body2" color='primary' onClick={() => { setLoginComponent('sign-in'); setAlert({}) }}>
                        Ai deja cont? Conectează-te
                    </Link>
                </Grid>
            </Grid>
        </Container>
    )
}