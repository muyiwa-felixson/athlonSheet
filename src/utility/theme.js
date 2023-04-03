const dimension = 8;
const Theme ={
    primary: {
        colors: {
            surface: '#ffffff',
            black: '#333333',
            border: '#DADCDF',
            google: '#0165FC',
            green: '#52c41a'
        },
        typography: {

        },
        radius: '3px',
    },
    secondary: {
        colors: {

        },
        typography: {

        },
        radius: '8px',
    },
    dimensions: {
        x0: 0,
        x05: `${dimension / 2}px`,
        x1: `${dimension}px`,
        x15: `${dimension * 1.5}px`,
        x2: `${dimension * 2}px`,
        x3: `${dimension * 3}px`,
        x4: `${dimension * 4}px`,
        x5: `${dimension * 5}px`,
        x6: `${dimension * 6}px`,
        x7: `${dimension * 7}px`,
        x8: `${dimension * 8}px`,
        x9: `${dimension * 9}px`,
        x10: `${dimension * 10}px`, 
    }
};

export default Theme;