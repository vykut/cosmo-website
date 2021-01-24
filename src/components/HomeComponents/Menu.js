import { Box, Collapse, List, ListItem, ListItemIcon, Paper, Typography } from '@material-ui/core'
import { ChevronLeft, ExpandLess, ExpandMore } from '@material-ui/icons'
import React, { useEffect, useMemo } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from "react-router-dom";
import { firestoreDB } from '../..';
import { isEmpty, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

export const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    menu: {
        color: theme.palette.info.main
    },
    listItem: {
        color: theme.palette.info.main
    },
    priceSelector: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: 'inherit',
    },
    paper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
        margin: theme.spacing(1),
        width: 250
    },
    menuTitle: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}))

const StyledListItem = withStyles((theme) => ({
    root: {
        color: theme.palette.error.main
    }
}))(ListItem);

const InfoListItem = withStyles((theme) => ({
    root: {
        color: theme.palette.info.main
    }
}))(ListItem)

export default function CosmoMenu() {
    const classes = useStyles();
    const history = useHistory()
    const { url } = useRouteMatch();
    const { category, subcategory1, subcategory2 } = useParams()
    const [collapseFilter, setCollapseFilter] = useState(true)
    var title = ''
    var items = []

    const queryParam = useMemo(() => {
        if (subcategory2)
            return subcategory2
        if (subcategory1)
            return subcategory1
        if (category)
            return category
        if (url.includes('toate-categoriile'))
            return 'all'
        return ''
    }, [category, subcategory1, subcategory2, url])

    useFirestoreConnect([{
        collection: 'categories',
        where: [['enabled', '==', true]]
    }])

    const categories = useSelector(
        ({ firestore }) => {
            const categories = firestore.data.categories
            if (isEmpty(categories))
                return []
            return Object.entries(categories).filter(x => x[1])
                .map(category => { return { id: category[0], data: category[1] } })
        }
    )

    //fetch categories

    if (isEmpty(categories))
        return null

    if (queryParam === 'all') {
        title = 'Toate categoriile'
        const mainCategories = categories?.filter(category => category.data.mainCategory)
        items = mainCategories || []
    } else {
        const category = categories.find(category => category.id === queryParam)
        if (category) {
            const childrenCategories = category.data.childrenCategories
                ?.map(categoryID => categories.find(({ id }) => id === categoryID))
                .filter(x => x)
            items = childrenCategories || []
            title = category.data.name
        }
    }

    const categoryURL = (category) => () => {
        var url = '/categorii'
        category.data.parentCategories.forEach((parent) => {
            url += `/${parent}`
        })
        url += `/${category.id}`
        return url
    }

    function BackButton() {
        return (
            <StyledListItem button onClick={() => history.goBack()} >
                <ListItemIcon>
                    <ChevronLeft />
                </ListItemIcon>
                <Typography variant='body1' color='error'>
                    Înapoi
                </Typography>
            </StyledListItem >
        );
    }

    function CosmoDesktopSideMenu() {
        return (
            <Paper className={classes.paper}>
                <List
                    component='nav'
                    aria-labelledby="nested-list-subheader"
                    className={classes.menu}
                >
                    <ListItem button onClick={() => setCollapseFilter(!collapseFilter)} className={classes.menuTitle}>
                        <Typography variant='h6' >
                            <Box fontWeight='fontWeightBold'>
                                {title}
                            </Box>
                        </Typography>
                        {collapseFilter ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    {category && <BackButton />}
                    <Collapse in={collapseFilter} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {items?.filter(x => x.data).map((item, index) => {
                                return <InfoListItem button key={index} component={Link} to={categoryURL(item)}>
                                    <Typography variant='body1' className={classes.listItem}>
                                        {item.data.name}
                                    </Typography>
                                </InfoListItem>
                            })}
                        </List>
                    </Collapse>
                </List>
            </Paper>
        )
    }

    return (
        <CosmoDesktopSideMenu />
    )
}
