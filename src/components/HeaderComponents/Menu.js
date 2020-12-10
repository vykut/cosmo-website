import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
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
        case 1: return '/categorii/alimente'
        case 2: return '/categorii/bauturi'
        case 3: return '/categorii/tigari'
        default: return '/acasa'
    }
}

function pathToIndex(index) {
    switch (index) {
        case '/acasa': return 0
        case '/categorii/alimente': return 1
        case '/categorii/bauturi': return 2
        case '/categorii/tigari': return 3
        default: return -1
    }
}

export default function AppBarMenu() {
    const classes = useStyles();

    const [tab, setTab] = useState(0)
    const history = useHistory()

    useEffect(() => {
        setTab(pathToIndex(history.location.pathname))
    }, [history.location.pathname])

    const handleTabChange = (e, index) => {
        console.log(e, index)
        setTab(index)
        history.push(indexToPath(index))
    }

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
        </div>
    );
}