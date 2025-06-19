import { RaThemeOptions } from 'react-admin';

/** Just for fun */

export const chiptuneTheme: RaThemeOptions = {
    palette: {
        mode: 'dark' as 'dark',
        primary: {
            main: '#D4AF37',
        },
        background: {
            default: '#111111',
            paper: '#212121',
        },
        text: {
            primary: '#D4AF37',
        },
    },
    typography: {
        fontFamily: `'Pixelify Sans', cursive`,
    },
    components: {
        MuiAutocomplete: { defaultProps: { fullWidth: true } },
        MuiFormControl: { defaultProps: { fullWidth: true } },
        MuiTextField: { defaultProps: { fullWidth: true } },
        RaSimpleFormIterator: { defaultProps: { fullWidth: true } },
    },
};
