import logo from '../../assets/logo-app-bar-cosmo-market.svg';
import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Button, useScrollTrigger } from '@material-ui/core';
// import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles((theme) => ({
    searchBottom: {
        display: 'none',
        [theme.breakpoints.down('650')]: {
            display: 'block',
        },
    },
    searchInline: {
        display: 'none',
        [theme.breakpoints.up('650')]: {
            display: 'block',

        },
        flexGrow: 1,
        borderRadius: 8,
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
    },
    search: {
        display: 'flex',
        borderRadius: 'inherit',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    searchIcon: {
        marginRight: theme.spacing(1),
        padding: theme.spacing(1, 0),
        minWidth: 50,
    },
    inputRoot: {
        color: 'inherit',
        flexGrow: 1,
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        flexGrow: 1,
        transition: theme.transitions.create('width'),
    },
    buttonGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: 40,
        margin: theme.spacing()
    },
    logoButton: {
        '&:hover': {
            backgroundColor: 'inherit',
        },
    },
    button: {
        padding: theme.spacing(1, 3),
        textTransform: 'none',
    },
    label: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    grow: {
        flexGrow: 1,
    },
    toolbar: {
        display: 'flex',
        alignContent: 'space-around',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down(400)]: {
            justifyContent: 'center',
        },
        padding: theme.spacing(),
    },
    hideOnScroll: {
        display: 'none',
        [theme.breakpoints.down(400)]: {
            display: 'block',
        },
    },
    hideAppBar: {
        display: 'none',
        [theme.breakpoints.down(400)]: {
            display: 'inline',
        },
    },
    showAppBar: {
        display: 'inline',
        [theme.breakpoints.down(400)]: {
            display: 'none',
        },
    }
}));



export default function Header() {
    const classes = useStyles();
    // const trigger = useScrollTrigger()

    const renderSearch = (
        <div className={classes.search}>
            <Button className={classes.searchIcon} color='secondary'>
                <SearchIcon />
            </Button>
            <InputBase
                placeholder="Caută un produs"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
            />
        </div>
    )

    const appBar = (
        <AppBar position="sticky" >
            <Toolbar className={classes.toolbar}>
                <Button
                    className={classes.logoButton}
                    disableFocusRipple
                    disableRipple
                >
                    <img src={logo} alt='logo' className={classes.logo} />
                </Button>
                <div className={classes.searchInline}>
                    {renderSearch}
                </div>
                <div className={classes.buttonGroup}>
                    <Button
                        disableElevation
                        color='inherit'
                        size='large'
                        className={classes.button}
                    >
                        <Typography variant='body1' className={classes.label}>
                            Salut, Victor
                            </Typography>
                        <AccountCircle />
                    </Button>
                    <Button
                        disableElevation
                        color='inherit'
                        size='large'
                        className={classes.button}
                    >
                        <Typography variant='body1' className={classes.label}>
                            Favorite
                            </Typography>
                        <Badge badgeContent={4} color="secondary">
                            <FavoriteIcon />
                        </Badge>
                    </Button>
                    <Button
                        disableElevation
                        color='inherit'
                        size='large'
                        className={classes.button}
                    >
                        <Typography variant='body1' className={classes.label}>
                            Coș
                            </Typography>
                        <Badge badgeContent={4} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </Button>
                </div>
            </Toolbar>
            <div className={classes.searchBottom}>
                {renderSearch}
            </div>
        </AppBar>
    );

    // const showHeader = (
    //     <>
    //         {/* <div className={classes.hideAppBar}>
    //             <Slide appear={false} direction="down" in={!trigger} >
    //                 {appBar}
    //             </Slide>
    //         </div>
    //         <div className={classes.showAppBar}>
    //             {appBar}
    //         </div> */}
    //     </>
    // );

    return (
        <>
            {/* <HideOnScroll {...props} className={classes.hideOnScroll}> */}
            {/* {showHeader} */}
            {appBar}
            {/* </HideOnScroll> */}
        </>
    );
}


