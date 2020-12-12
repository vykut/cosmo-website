import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, OutlinedInput, Paper, Select, withStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react'


export const useStyles = makeStyles((theme) => ({
    iconButton: {
        marginRight: theme.spacing(1),
        padding: theme.spacing(1, 0),
        minWidth: 50,
        marginLeft: -15,
        color: theme.palette.info.main,
    },
    input: {
        color: theme.palette.info.main,
    },
    cssLabel: {
        color: theme.palette.info.main,
        "&.Mui-focused": {
            color: theme.palette.info.main
        }
    }
}))

const StyledOutlineInput = withStyles((theme) => ({
    root: {
        color: theme.palette.info.main,
    },
    notchedOutline: {
        borderColor: `${theme.palette.info.main} !important`,
    }
}))(OutlinedInput);

const StyledSearchIcon = withStyles((theme) => ({
    root: {
        color: theme.palette.info.main
    }
}))(SearchIcon);

const StyledMenuItem = withStyles((theme) => ({
    root: {
        color: theme.palette.info.main
    }
}))(MenuItem);


export default function ProductsPageHeader({ sort, numberOfProducts, handleChange }) {
    const classes = useStyles()

    return (

        <Paper style={{ padding: 8, margin: 8 }}>
            <Grid container direction='row' justify='space-around' alignContent='center' alignItems='center' spacing={2} >
                <Grid item sm={12} md={6}>
                    {/* <FormControl> */}

                    <StyledOutlineInput
                        placeholder='Caută un produs'
                        variant='outlined'
                        margin='dense'
                        fullWidth

                        startAdornment={
                            <Button className={classes.iconButton} >
                                <StyledSearchIcon />
                            </Button>
                        } />
                    {/* </FormControl> */}
                </Grid>
                <Grid container xs item justify='flex-end' spacing={2} >
                    <Grid item >
                        <FormControl variant='outlined'>
                            <InputLabel id="sort-label" className={classes.cssLabel}>Sortează</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sort}
                                name='sort'
                                onChange={handleChange}
                                margin='dense'
                                input={<StyledOutlineInput notched label='Sortează' />}
                            >
                                <StyledMenuItem value={0}>După poziție</StyledMenuItem>
                                <StyledMenuItem value={1}>Preț crescător</StyledMenuItem>
                                <StyledMenuItem value={2}>Preț descrescător</StyledMenuItem>
                                <StyledMenuItem value={3}>Alfabetic A-Z</StyledMenuItem>
                                <StyledMenuItem value={4}>Alfabetic Z-A</StyledMenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item >
                        <FormControl variant='outlined' style={{ width: 80 }}>
                            <InputLabel id="number-of-products-label" className={classes.cssLabel}>Afișează</InputLabel>
                            <Select
                                labelId="number-of-products-label"
                                value={numberOfProducts}
                                name='numberOfProducts'
                                onChange={handleChange}
                                margin='dense'
                                input={<StyledOutlineInput notched label='Afișează' />}
                            >
                                <StyledMenuItem value={24}>24</StyledMenuItem>
                                <StyledMenuItem value={48}>48</StyledMenuItem>
                                <StyledMenuItem value={96}>96</StyledMenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
