import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { isEmpty, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

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


export default function AppBarMenu() {
    const classes = useStyles();
    const history = useHistory()

    var tab = -1

    const mainCategoriesStoreAs = 'mainCategories'
    useFirestoreConnect(() => [
        {
            collection: 'categories',
            where: [['mainCategory', '==', true], ['enabled', '==', true]],
            storeAs: mainCategoriesStoreAs
        } // or `todos/${props.todoId}`
    ])
    const categories = useSelector(
        ({ firestore }) => {
            const categories = firestore.data[mainCategoriesStoreAs]
            if (isEmpty(categories))
                return null
            return Object.entries(categories).filter(x => x[1])
                .map(category => { return { id: category[0], data: category[1] } })
        }
    )

    const handleTabChange = (e, value) => {
        if (value === 0)
            return history.push('/acasa')
        history.push(`/categorii/${value}`)
    }

    return (
        <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            className={classes.tabsStyles}
        >
            <StyledTab label='Acasă' value={0} />
            {categories?.map(category => <StyledTab label={category.data.name} value={category.id} key={category.id} />)}
        </Tabs>
    );
}