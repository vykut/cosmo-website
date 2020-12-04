import { makeStyles } from '@material-ui/core/styles';


export const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        marginBottom: theme.spacing(3),
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
        
    },
    divider: {
        background: theme.palette.primary.dark
    },
    resetPasswordButton : {
        margin: theme.spacing(3, 0, 2),
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.error.main
      }
    }
    },
}));