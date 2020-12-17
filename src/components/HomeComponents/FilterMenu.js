import { Box, Collapse, Grid, List, ListItem, ListItemIcon, makeStyles, Paper, Slider, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useState } from 'react'

export const useStyles = makeStyles((theme) => ({
    paper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
        margin: theme.spacing(1),
        width: 250
    },
    menu: {
        color: theme.palette.info.main
    },
    menuTitle: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    filterIcon: {
        color: theme.palette.info.main
    },
    listSlider: {

    }
}))

export default function FilterMenu({ defaultValue, commitFilter }) {
    const classes = useStyles()

    const [value, setValue] = useState(defaultValue)

    const handleChange = (e, value) => {
        setValue(value)
    }

    const [collapseFilter, setCollapseFilter] = useState(false)

    return (
        <Paper className={classes.paper}>
            <List className={classes.menu}>
                <ListItem button onClick={() => setCollapseFilter(!collapseFilter)} className={classes.menuTitle}>
                    <Typography variant='h6' >
                        <Box fontWeight='fontWeightBold'>
                            Filtrare
                            </Box>
                    </Typography>
                    <ListItemIcon className={classes.filterIcon}>
                        <FilterListIcon />
                    </ListItemIcon>
                    {collapseFilter ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={collapseFilter} timeout="auto" unmountOnExit>
                    <ListItem className={classes.listSlider}>
                        <Grid container direction='column'>
                            <Grid item>
                                <Typography variant='body1'>
                                    Preț
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Slider min={defaultValue[0]} max={defaultValue[1]} defaultValue={defaultValue} value={value} onChangeCommitted={commitFilter('price')} step={5} onChange={handleChange} />
                            </Grid>
                            <Grid item container justify='space-between'>
                                <Grid item>
                                    <Typography variant='h6'>
                                        {value ? value[0] : defaultValue[0]}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='h6'>
                                        RON
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='h6'>
                                        {value ? value[1] : defaultValue[1]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ListItem>
                </Collapse>
            </List>
        </Paper>
    )
}
