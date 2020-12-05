import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

export const cosmoTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#23adae',
            contrastText: '#fff'
        },
        secondary: {
            main: '#f4c132'
        },
        error: {
            main: '#de512b',
            contrastText: '#fff'
        },
        info: {
            main: '#894475',
            contrastText: '#fff'
        },
        succes: {
            main: '#55df99'
        }
    }
})

export const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    loginLogo: {
        margin: theme.spacing(3, 0),
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    divider: {
        background: theme.palette.primary.main
    },
    resetPasswordButton: {
        margin: theme.spacing(3, 0, 2),
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.error.main
            }
        }
    },
    alert: {
        margin: theme.spacing(0, 1, 2),
    },
}));