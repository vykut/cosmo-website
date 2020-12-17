import { Box, Drawer, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useReducer } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Cart from './Cart';
import ReviewOrder from './ReviewOrder';
import { isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useDialog } from '../../contexts/DialogContext';
import OrderDetails from './OrderDetails';

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 400,
        [theme.breakpoints.down(500)]: {
            width: '100vw',
        },
    },
    paper: {
        backgroundColor: '#f7ffff',
        width: 'inherit',
    },
    infoTextColor: {
        color: theme.palette.info.main,
    },
    title: {
        marginLeft: theme.spacing(),
    },
    mainContainer: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    backButton: {
        color: theme.palette.error.main
    },
    closeButton: {
        color: theme.palette.error.main
    },
    titleGrid: {
        marginBottom: theme.spacing(2)
    },
}))

const actionTypes = {
    viewCart: 'CART',
    reviewOrder: 'REVIEW',
    placeOrder: 'ORDER',
    back: 'BACK'
}

const titles = {
    cart: 'Coșul tău',
    reviewOrder: 'Detalii comandă',
    orderPlaced: 'Comanda ta'
}

function drawerReducer(state, action) {
    switch (action.type) {
        case actionTypes.cart: {
            return { back: false, showCart: true, showReview: false, showOrder: false, title: titles.cart }
        }
        case actionTypes.reviewOrder: {
            return { back: true, showCart: false, showReview: true, showOrder: false, title: titles.reviewOrder }
        }
        case actionTypes.placeOrder: {
            return { back: true, showCart: false, showReview: false, showOrder: true, title: titles.orderPlaced }
        }
        case actionTypes.back: {
            return { back: false, showCart: true, showReview: false, showOrder: false, title: titles.cart }
        }
        default: {
            console.log(`Unhandled type: ${action.type}`)
        }
    }
}

function useDrawer({ reducer = drawerReducer } = {}) {
    const [{ back, showCart, showReview, showOrder, title }, dispatch] = useReducer(reducer, { back: false, showCart: true, showReview: false, showOrder: false, title: titles.cart })

    const viewCart = () => dispatch({ type: actionTypes.viewCart })
    const reviewOrder = () => dispatch({ type: actionTypes.reviewOrder })
    const placeOrder = () => dispatch({ type: actionTypes.placeOrder })
    const goBack = () => dispatch({ type: actionTypes.back })

    return { back, showCart, showReview, showOrder, title, viewCart, reviewOrder, placeOrder, goBack }

}

export default function CartDrawer(props) {
    const classes = useStyles()
    const auth = useSelector(state => state.firebase.auth)
    const dialog = useDialog()

    const { back, showCart, showReview, showOrder, title, viewCart, reviewOrder, placeOrder, goBack, } = useDrawer({
        reducer(currentState, action) {
            const changes = drawerReducer(currentState, action)
            if (isEmpty(auth)) {
                //trigger login modal
                console.log('User not logged in')
                dialog.showDialog()
                return currentState
            } else {
                return changes
            }
        }
    })

    function TitleGrid() {
        return (
            <Grid container item justify='space-between' alignItems='center' className={classes.titleGrid}>
                {back && <Grid item>
                    <IconButton className={classes.backButton} onClick={goBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>}
                <Grid item>
                    <Typography variant='h5' className={`${classes.infoTextColor} ${classes.title}`}>
                        <Box fontWeight='fontWeightBold'>
                            {title}
                        </Box>
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={props.onClose} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    }

    return (
        <Drawer
            anchor='right'
            open={props.open}
            onClose={props.onClose}
            className={classes.drawer}
            classes={{
                paper: classes.paper
            }}
        >
            <Grid container className={classes.mainContainer}  >
                <TitleGrid />
                {showCart && <Cart reviewOrder={reviewOrder} />}
                {showReview && <ReviewOrder placeOrder={placeOrder} />}
                {showOrder && <OrderDetails />}
            </Grid>
        </Drawer>
    )
}
