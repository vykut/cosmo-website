import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '../../utils/styles'
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { useAuth } from '../../contexts/AuthContext'


export default function SignIn({setAlert, setLoginComponent}) {
    const classes = useStyles();
    const { signIn } = useAuth()

    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)

    const onChangeForField = fieldName => ({ target }) => setForm(state => ({ ...state, [fieldName]: target.value }));

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            await signIn(form)
            setAlert({severity: 'success', message: 'Te-ai conectat cu succes.'})
        } catch (error) {
            setAlert({severity: 'error', message: error.message})
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
                        <Link href="#" variant="body2" color='error' onClick={() => {setLoginComponent('reset-password'); setAlert({})}}>
                            Ai uitat parola?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" variant="body2" color='primary' onClick={() => {setLoginComponent('sign-up'); setAlert({})}}>
                            Nu ai cont? Fă-ți unul acum
                        </Link>
                    </Grid>
                </Grid>
            
        </Container>
    )
}
