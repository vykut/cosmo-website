import { Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { MemoizedProductsRow } from './ProductsRow';
import RoomIcon from '@material-ui/icons/Room';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import StoreIcon from '@material-ui/icons/Store';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { isEmpty, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        margin: theme.spacing(2),
    },
    menuContainer: {
    },
    menuProductsContainer: {
        display: 'flex',

    },
    listItem: {
        // marginTop: theme.spacing(1)
    },
    mainContainer: {
        padding: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(),
        // margin: theme.spacing(),
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.primary.main,
        height: '100%'
    },
    whiteTextColor: {
        color: theme.palette.primary.contrastText
    },
}))

export default function Home() {
    const classes = useStyles()



    function StoreInfo() {
        const cosmoMarketDoc = 'CosmoMarket'
        useFirestoreConnect([{
            collection: 'stores',
            doc: cosmoMarketDoc,
        }])

        const storeData = useSelector(
            ({ firestore }) => firestore.data.stores && firestore.data.stores[cosmoMarketDoc]
        )

        if (isEmpty(storeData))
            return null

        return (
            <Grid container justify='center'>
                <Grid item xs={6} sm={3} style={{ padding: 4 }}>
                    <Paper className={classes.paper}>
                        <Grid container direction='column' justify='center' alignItems='center' alignContent='center' style={{ height: '100%' }}>
                            <Grid item>
                                <RoomIcon fontSize='large' />
                            </Grid>
                            <Grid item>
                                <Typography component='div' variant='h6' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Livrăm până la ușa ta
                                    </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3} style={{ padding: 4 }}>
                    <Paper className={classes.paper}>
                        <Grid container direction='column' justify='center' alignItems='center' alignContent='center' style={{ height: '100%' }}>
                            <Grid item>
                                <PhoneInTalkIcon fontSize='large' />
                            </Grid>
                            <Grid item>
                                <Typography component='div' variant='body1' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Ne poți contacta la
                                    </Typography>
                                <Typography component='div' variant='h6' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    {storeData.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3} style={{ padding: 4 }}>
                    <Paper className={classes.paper}>
                        <Grid container direction='column' justify='center' alignItems='center' alignContent='center' style={{ height: '100%' }}>
                            <Grid item>
                                <StoreIcon fontSize='large' />
                            </Grid>
                            <Grid item>
                                <Typography component='div' variant='body1' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Adresa magazinului
                                    </Typography>
                                <Typography component='div' variant='h6' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    {storeData.address}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3} style={{ padding: 4 }}>
                    <Paper className={classes.paper}>
                        <Grid container direction='column' justify='center' alignItems='center' alignContent='center' style={{ height: '100%' }}>
                            <Grid item>
                                <ScheduleIcon fontSize='large' />
                            </Grid>
                            <Grid item>
                                <Typography component='div' variant='body1' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Orar
                                    </Typography>
                                <Typography component='div' variant='h6' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Lu - Vi: {storeData.weekTimeTable}
                                </Typography>
                                <Typography component='div' variant='h6' color='textPrimary' align='center' className={classes.whiteTextColor}>
                                    Sa - Du: {storeData.weekendTimeTable}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    return (
        <div className={classes.mainContainer}>
            <Grid
                container
                direction='column'
                justify="center"
                spacing={4}
            >
                <Grid item>
                    <StoreInfo />
                </Grid>
                <Grid item>
                    <MemoizedProductsRow recentProducts={true} />
                </Grid>
                <Grid item>
                    <MemoizedProductsRow categoryID='emgqRnkMcrfiM24JI3i6' />
                </Grid>
                {/* <ProductsPage category='{'yolo'}' /> */}
            </Grid >
        </div >
    )
}

