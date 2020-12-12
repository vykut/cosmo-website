import { Box, Collapse, Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Slider, Tooltip, Typography } from '@material-ui/core'
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@material-ui/icons'
import React from 'react'
import HomeIcon from '@material-ui/icons/Home';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import EuroIcon from '@material-ui/icons/Euro';
import SmokingRoomsIcon from '@material-ui/icons/SmokingRooms';
import StoreIcon from '@material-ui/icons/Store';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { capitalize } from '../../utils/utils';

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

function paramToCategory(param) {
    switch (param) {
        case 'alimente': return "Alimente"
        case 'bauturi': return "Băuturi"
        case 'tigari': return "Țigări"
        default: return "Categorie"
    }
}


export default function CosmoMenu(props) {
    const classes = useStyles();

    const [collapseFilter, setCollapseFilter] = useState(true)
    const [backButton, setBackButton] = useState(true)

    const { match, history } = props;
    const { params } = match;
    const { categorie } = params;

    const items = [
        'Davidoff',
        'Dunhill',
        'Heets',
        'Kent',
        'Marlboro',
        'Neo',
        'Pall Mall',
        'Sobranie',
        'Vogue',

    ]

    function BackButton() {
        return (
            <StyledListItem button>
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
                                {paramToCategory(categorie)}
                            </Box>
                        </Typography>
                        {collapseFilter ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    {backButton && <BackButton />}
                    <Collapse in={collapseFilter} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {items.map((item, index) => {
                                return <ListItem button key={index}>
                                    <Typography variant='body1' className={classes.listItem} key={index}>
                                        {item}
                                    </Typography>
                                </ListItem>
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
