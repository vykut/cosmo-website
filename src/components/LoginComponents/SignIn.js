import { Button, Container, Grid, Link, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { useFirebase } from "react-redux-firebase";
import { useDialog } from '../../contexts/DialogContext';
import { ComponentTypes } from '../../utils/utils';
import GoogleButton from 'react-google-button'

export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(),
    },
    submit: {
        margin: theme.spacing(3, 0, 3),
    },
}));


export default function SignIn({ setAlert, setLoginComponent }) {
    const classes = useStyles();
    const firebase = useFirebase();
    const dialog = useDialog()

    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)

    const onChangeForField = fieldName => ({ target }) => setForm(state => ({ ...state, [fieldName]: target.value }));

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            await firebase.login({
                email: form.email.trim(),
                password: form.password.trim()
            })
            setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
            dialog.hideDialog()
        } catch (error) {
            setAlert({ severity: 'error', message: error.message })
        }
        setLoading(false)
    }

    async function handleGoogleSignIn() {
        firebase.login({
            provider: 'google',
            type: 'popup',
        })
            .then(resp => {
                console.log(resp)
                setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
                dialog.hideDialog()
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container direction='column' justify='space-between' alignItems='center'>
                    <Grid item style={{ width: '100%' }}>
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
                            onChange={onChangeForField('email')}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Parolă"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={onChangeForField('password')}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            Intră în cont
                </Button>
                    </Grid>
                    <Grid item>
                        <GoogleButton
                            onClick={handleGoogleSignIn}
                            style={{ marginBottom: 16 }}
                        />
                    </Grid>
                </Grid>
            </form>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2" color='error' onClick={() => { setLoginComponent(ComponentTypes.reset_password); setAlert({}) }}>
                        Ai uitat parola?
                        </Link>
                </Grid>
                <Grid item>
                    <Link href="#" variant="body2" color='primary' onClick={() => { setLoginComponent(ComponentTypes.sign_up); setAlert({}) }}>
                        Nu ai cont? Fă-ți unul acum
                        </Link>
                </Grid>
            </Grid>

        </Container>
    )
}
