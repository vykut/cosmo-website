import { AppBar, Grid, Toolbar, Link, Button } from '@material-ui/core'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'



export default function Footer() {
    return (
        <AppBar position='sticky'>
            <Toolbar variant='dense'>
                <Grid container justify='space-around'>
                    <Grid item>
                        <Button variant='text' style={{ textTransform: 'none', color: 'white' }} component={RouterLink} to='/termeni-si-conditii'>
                            Termeni și condiții
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant='text' style={{ textTransform: 'none', color: 'white' }} component={RouterLink} to='/politica-cookie'>
                            Politică cookie
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant='text' style={{ textTransform: 'none', color: 'white' }} component={RouterLink} to='/gdpr'>
                            GDPR
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant='text' style={{ textTransform: 'none', color: 'white' }} component={RouterLink} to='/despre-noi'>
                            Despre noi
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
