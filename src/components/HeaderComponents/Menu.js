import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import { Button, Grid, List, ListItem, Menu, MenuItem } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        textTransform: 'initial',
        margin: theme.spacing(0, 2),
        minWidth: 0,
        [theme.breakpoints.up('md')]: {
            minWidth: 0,
        },
    },
    wrapper: {
        fontWeight: 'normal',
        letterSpacing: 0.5,
    },
    tabsStyles: {
        root: {
            marginLeft: theme.spacing(1),
        },
        indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white,
        },
    },
    textColorSecondary: {
        color: theme.palette.primary.contrastText
    },
}));

const StyledTab = withStyles((theme) => ({
    textColorSecondary: {
        color: theme.palette.primary.contrastText,
    },
    root: {
        textTransform: 'none',
    },
}))(Tab);

function indexToPath(index) {
    switch (index) {
        case 0: return '/acasa'
        case 1: return '/categorii/0klQV3KLSaG9uCWZofCL'
        case 2: return '/categorii/LY7gSrR5uwYR4t91EOcA'
        case 3: return '/categorii/KIdyISkEMmATZsnAhYpk'
        default: return '/acasa'
    }
}

function pathToIndex(path) {
    switch (path) {
        case 'acasa': return 0
        case 'alimente': return 1
        case 'bauturi': return 2
        case 'tigari': return 3
        default: return -1
    }
}

export default function AppBarMenu() {
    const classes = useStyles();

    const { url, path } = useRouteMatch()
    const { category } = useParams()
    const history = useHistory()

    const [tab, setTab] = useState(-1)

    useEffect(() => {
        if (url === '/acasa') {
            setTab(0)
        } else if (category) {
            setTab(pathToIndex(category))
        } else {
            setTab(-1)
        }
    }, [url, category])

    history.listen((location) => {
        console.log(location)
        if (location === '/acasa') {
            setTab(0)
        } else if (category) {
            setTab(pathToIndex(category))
        } else {
            setTab(-1)
        }
    })

    const handleTabChange = (e, index) => {
        console.log(e, index)
        history.push(indexToPath(index))
    }

    // const handleClick = (e) => {
    //     history.push(e.target.id)
    // }

    return (
        <div>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                className={classes.tabsStyles}
            >
                <StyledTab label='Acasă' />
                <StyledTab label='Alimente' />
                <StyledTab label='Băuturi' />
                <StyledTab label='Țigări' />
            </Tabs>
            {/* <Button onClick={handleClick} id={'/acasa'} color='secondary' variant='text' style={{ width: 100 }}>
                Acasă
            </Button>
            <Button onClick={handleClick} id='/categorii/0klQV3KLSaG9uCWZofCL' color='secondary' variant='text' style={{ width: 100 }}>
                Alimente
            </Button>
            <Button onClick={handleClick} id='/categorii/LY7gSrR5uwYR4t91EOcA' color='secondary' variant='text' style={{ width: 100 }}>
                Băuturi
            </Button>
            <Button onClick={handleClick} id='/categorii/KIdyISkEMmATZsnAhYpk' color='secondary' variant='text' style={{ width: 100 }}>
                Țigări
            </Button> */}
        </div >
    );
}