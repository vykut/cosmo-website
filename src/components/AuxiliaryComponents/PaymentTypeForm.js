import { FormControlLabel, Grid, makeStyles, Paper, Radio } from '@material-ui/core'
import React from 'react'


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
}))

export default function PaymentTypeForm({ paymentType, setPaymentType }) {
    const classes = useStyles()

    const handleChange = (e) => {
        setPaymentType(e.target.value)
    }

    return (
        <Paper className={classes.paper}>
            <Grid container direction='column' justify='space-between'>
                <Grid item>
                    <FormControlLabel
                        value="cash"
                        control={<Radio
                            checked={paymentType === 'cash'}
                            onChange={handleChange}
                            color='primary'
                        />}
                        label="Plata cash la livrare"
                        labelPlacement="end"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        value="card"
                        control={<Radio
                            checked={paymentType === 'card'}
                            onChange={handleChange}
                            color='primary'
                        />}
                        label="Plata cu cardul la livrare"
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
