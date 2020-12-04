import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import { useStyles } from '../utils/styles'
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';


export default function SignIn() {
    const classes = useStyles();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState(false)
    const [phone, setPhone] = useState('')


    return (
        <Container component="main" maxWidth="md">
            <form className={classes.form} >
                <Grid container spacing={2}>
                    <Grid item sm container spacing={2} direction='column'>
                        <Grid item>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Prenume"
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
                                autoComplete="phone"
                            />
                        </Grid>
                    </Grid>
                    <Grid item >
                        <Divider className={classes.divider} orientation='vertical' flexItem />
                    </Grid>
                    <Grid item sm container direction='column' spacing={2}>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
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
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeat-password"
                                label="Repetă parola"
                                type="password"
                                id="repeat-password"
                                autoComplete="new-password"
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
                    >
                        Creează cont
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Ai deja cont? Conectează-te
                        </Link>
                        </Grid>
                    </Grid>
                </Container>
            </form>
        </Container>
    );
}