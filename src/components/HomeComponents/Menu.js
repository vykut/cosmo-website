import { Box, Collapse, List, ListItem, ListItemIcon, Paper, Typography } from '@material-ui/core'
import { ChevronLeft, ExpandLess, ExpandMore } from '@material-ui/icons'
import React, { useEffect, useMemo } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from "react-router-dom";
import { firestoreDB } from '../..';

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

    const firestore = firestoreDB

    const [collapseFilter, setCollapseFilter] = useState(true)
    const [items, setItems] = useState([])
    const [title, setTitle] = useState('')

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

    //fetch categories
    useEffect(() => {
        const categoriesRef = firestore.collection('categories')
        if (queryParam === 'all') {
            setTitle('Toate categoriile')
            fetchCategories(['0klQV3KLSaG9uCWZofCL', 'KIdyISkEMmATZsnAhYpk', 'LY7gSrR5uwYR4t91EOcA'])
        } else {
            categoriesRef.doc(queryParam).get()
                .then((doc) => {
                    setTitle(doc.data().name)
                    fetchCategories(doc.data().childrenCategories)
                })
        }
        async function fetchCategories(categoriesIDs) {
            setItems([])
            if (categoriesIDs) {
                var promises = []
                categoriesIDs.forEach((category) => {
                    promises.push(categoriesRef.doc(category).get())
                })
                var docs = (await Promise.all(promises)).map((doc) => { return { id: doc.id, data: doc.data() } })
                docs = docs.filter(doc => doc.data.enabled)
                setItems(docs)
            }
        }
    }, [firestore, queryParam])

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
                            {items.filter(x => x).map((item, index) => {
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
