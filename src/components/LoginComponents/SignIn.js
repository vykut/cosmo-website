import { Button, Container, Grid, Link, makeStyles, TextField, useTheme } from '@material-ui/core';
import React, { useState } from 'react'
import { useFirebase } from "react-redux-firebase";
import { useDialog } from '../../contexts/DialogContext';
import { ComponentTypes } from '../../utils/utils';

export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
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
                    onChange={onChangeForField('email')}
                />
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
