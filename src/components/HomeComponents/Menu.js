import { Box, Collapse, List, ListItem, ListItemIcon, Paper, Typography } from '@material-ui/core'
import { ChevronLeft, ExpandLess, ExpandMore } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom';
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

    const { url, path } = useRouteMatch();
    const { category, subcategory1, subcategory2 } = useParams()

    const firestore = firestoreDB

    const [collapseFilter, setCollapseFilter] = useState(true)
    const [items, setItems] = useState([])
    const [title, setTitle] = useState('')

    //fetch categories
    useEffect(() => {

        const categories = firestore.collection('categories')
        const subcategories1 = categories.doc(category).collection('categories')
        const subcategories2 = subcategories1.doc(subcategory1).collection('categories')

        var unsubscribe

        async function getTitle(docRef) {
            const doc = await docRef.get()
            setTitle(doc.data().name)
        }

        if (subcategory1 || subcategory2) {
            unsubscribe = subcategories2.onSnapshot(function (querySnapshot) {
                var ids = []
                querySnapshot.forEach(function (doc) {
                    ids.push({ id: doc.id, name: doc.data().name, path: `/categorii/${category}/${subcategory1}/${doc.id}` })
                })
                setItems(ids)
            })
            if (subcategory2) {
                getTitle(subcategories2.doc(subcategory2))
            } else {
                getTitle(subcategories1.doc(subcategory1))
            }
        } else {
            unsubscribe = subcategories1.onSnapshot(function (querySnapshot) {
                var ids = []
                querySnapshot.forEach(function (doc) {
                    ids.push({ id: doc.id, name: doc.data().name, path: `/categorii/${category}/${doc.id}` })
                })
                setItems(ids)
            })
            getTitle(categories.doc(category))
        }

        return () => {
            unsubscribe();
        }
    }, [category, firestore, subcategory1, subcategory2])

    function BackButton() {
        return (
            <StyledListItem button component={Link} to={url.substr(0, url.lastIndexOf('/'))}>
                <ListItemIcon>
                    <ChevronLeft />
                </ListItemIcon>
                <Typography variant='body1' color='error'>
                    Înapoi
                </Typography>
            </StyledListItem>
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
                    {subcategory1 && <BackButton />}
                    <Collapse in={collapseFilter} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {items.map((item, index) => {
                                return <InfoListItem button key={index} component={Link} to={item.path}>
                                    <Typography variant='body1' className={classes.listItem}>
                                        {item.name}
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
