import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '../utils/styles'
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

export default function ResetPassword() {
    const classes = useStyles();

    const [email, setEmail] = useState('')

    return (
        <Container component="main" maxWidth="xs">
            <form className={classes.form} >
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
                    onChange={(e) => { setEmail(e.target.email) }}
                />
            <Typography variant='body2' color='primary' paragraph align='justify'>
                Un link de resetare a parolei va fi trimis la adresa specificată de tine, dacă există un cont în baza noastră de date.
            </Typography>
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    classes={{root: classes.resetPasswordButton}}
                >
                    Resetează parola
                </Button>
            </form>
            <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="#" variant="body2" >
                        Ai deja cont? Conectează-te
                        </Link>
                    </Grid>
                </Grid>
        </Container>
    )
}