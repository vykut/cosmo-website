import { Breadcrumbs, Collapse, Container, Divider, Link, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState, useCallback } from 'react'
import ProductsRow from './ProductsRow'
import HomeIcon from '@material-ui/icons/Home';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import EuroIcon from '@material-ui/icons/Euro';
import SmokingRoomsIcon from '@material-ui/icons/SmokingRooms';
import StoreIcon from '@material-ui/icons/Store';

export const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        padding: theme.spacing(2),

    },
    menu: {
        width: 320,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 5,
        margin: theme.spacing(1),
    },
    menuContainer: {
    },
    menuProductsContainer: {
        display: 'flex',

    },
    productsContainer: {
        paddingLeft: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        // marginTop: theme.spacing(1)
    },

}))




export default function Home() {
    const classes = useStyles()

    // to add routing
    function CosmoBreadcrumbs() {
        return (
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Link color="inherit" href="#" >
                    <StoreIcon />
                </Link>
                <Typography color="textPrimary">Acasă</Typography>
            </Breadcrumbs>
        );
    }

    function Filter() {
        return (
            <ListItem button>
                <ListItemIcon>
                    <FilterListIcon color='secondary' />
                </ListItemIcon>
                <ListItemText primary="Filtrare" />
                {true ? <ExpandLess /> : <ExpandMore />}
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                <EuroIcon color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary="Preț" />
                        </ListItem>
                    </List>
                </Collapse>
            </ListItem>
        )
    }

    function CosmoSideMenu() {
        return (
            <List
                component='nav'
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader style={{ borderRadius: 5 }} component="div" id="nested-list-subheader" color='inherit'>
                        Categorii
                    </ListSubheader>
                }
                className={classes.menu}
            >
                <Divider />
                {false && <Filter />}
                <Divider />
                <ListItem button className={classes.listItem}>
                    <ListItemIcon>
                        <RestaurantMenuIcon color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary="Pentru acasă" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <LocalBarIcon color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary="Alimente" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <RestaurantMenuIcon color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary="Băuturi" />
                </ListItem>
                <Divider />
                <ListItem button>

                    <ListItemIcon>
                        <SmokingRoomsIcon color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary="Țigări" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <RestaurantMenuIcon color='secondary' />
                    </ListItemIcon>
                    <ListItemText primary="Alte categorii" />
                </ListItem>

            </List>
        )
    }


    return (
        <div>
            <CosmoBreadcrumbs />
            <div className={classes.menuProductsContainer}>
                <div className={classes.menuContainer}>
                    <CosmoSideMenu />
                </div>
                <div className={classes.productsContainer}>
                    <ProductsRow category='Produse recent adăugate în catalogul Cosmo Market' products={[]} />
                    <ProductsRow category='Mâncare gătită' products={[]} />
                </div>
            </div>
        </div>
    )
}