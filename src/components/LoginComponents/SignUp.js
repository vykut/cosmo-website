import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useFirebase } from "react-redux-firebase";
import { capitalize, ComponentTypes } from '../../utils/utils';
import { useDialog } from '../../contexts/DialogContext';

export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    divider: {
        background: theme.palette.primary.main
    },
}));


export default function SignUp({ setAlert, setLoginComponent }) {
    const classes = useStyles();
    const firebase = useFirebase();
    const dialog = useDialog();

    const [form, setForm] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



    const onChangeForField = fieldName => ({ target }) => setForm(state => ({ ...state, [fieldName]: target.value }));

    async function handleSubmit(e) {
        e.preventDefault()
        setAlert({})
        setError('')

        if (form.password !== form.repeatPassword) {
            setError('Parolele trebuie să coincidă')
            return
        }
        if (form.password.length < 6) {
            setError('Parola trebuie conțină minim 6 caractere')
            return
        }

        try {
            setLoading(true)
            await firebase.createUser({
                email: form.email.trim().toLoweCase(),
                password: form.password.trim(),
            })
            firebase.auth().languageCode = 'ro'
            await firebase.updateProfile({ firstName: capitalize(form.firstName), lastName: capitalize(form.lastName), phone: form.phone, favoriteProducts: [] })
            setAlert({ severity: 'success', message: 'Contul a fost creat cu succes.' })
            dialog.hideDialog()
        } catch (error) {
            setAlert({ severity: 'error', message: error.message })
        }
        setLoading(false)
    }

    return (

        <Container component="main" maxWidth="md" className={classes.form}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container item xs={12} sm={6} spacing={2} direction='column'>
                        <Grid item>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Prenume"
                                onChange={onChangeForField('firstName')}
                                autoFocus
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Nume"
                                name="phone"
                                autoComplete="lname"
                                onChange={onChangeForField('lastName')}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="phone"
                                label="Telefon"
                                name="phone"
                                autoComplete="tel"
                                onChange={onChangeForField('phone')}
                            />
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Divider className={classes.divider} orientation='vertical' />
                    </Grid>
                    <Grid container item xs={12} sm={6} direction='column' spacing={2}>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                onChange={onChangeForField('email')}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Parolă"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={onChangeForField('password')}
                                error={error !== ''}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeatPassword"
                                label="Repetă parola"
                                type="password"
                                id="repeat-password"
                                autoComplete="new-password"
                                onChange={onChangeForField('repeatPassword')}
                                error={error !== ''}
                                helperText={error}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Container maxWidth='xs'>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        Creează cont
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={() => { setLoginComponent(ComponentTypes.sign_in); setAlert({}) }}>
                                Ai deja cont? Conectează-te
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </form>
        </Container>
    );
}