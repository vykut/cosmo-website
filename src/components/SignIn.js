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

export default function SignIn() {
    const classes = useStyles();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)

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
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" onChange={(e) => { setRemember(e.target.checked) }} />}
                    label="Ține-mă minte"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Intră în cont
                </Button>
                </form>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2" color='error'>
                            Ai uitat parola?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" variant="body2" color='primary'>
                            Nu ai cont? Fă-ți unul acum
                        </Link>
                    </Grid>
                </Grid>
            
        </Container>
    )
}
