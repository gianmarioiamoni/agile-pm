// src/components/CustomTabs.js
import { styled } from '@mui/system';
import { Tabs, Tab } from '@mui/material';

// const burndownBaseColor = '#d32f2f';
// const sprintVelocityBaseColor = '#fbc02d';
import { burndownBaseColor, sprintVelocityBaseColor } from '../utils/colors';

export const StyledTabs = styled(Tabs)({
    borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
        backgroundColor: 'transparent', // Initial state: no color
    },
});

export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 'regular',
        marginRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&.Mui-selected': {
            color: '#1890ff',
            fontWeight: 'medium',
        },
        '&:focus': {
            color: '#40a9ff',
        },
    }),
);

export const BurndownTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 'regular',
        color: burndownBaseColor,
        opacity: 0.7,
        marginRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: burndownBaseColor,
            opacity: 1,
        },
        '&.Mui-selected': {
            color: burndownBaseColor,
            fontWeight: 'medium',
            opacity: 1,
        },
        '&:focus': {
            color: burndownBaseColor,
        },
    }),
);

export const SprintVelocityTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 'regular',
        color: sprintVelocityBaseColor,
        opacity: 0.7,
        marginRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: sprintVelocityBaseColor,
            opacity: 1,
        },
        '&.Mui-selected': {
            color: sprintVelocityBaseColor,
            fontWeight: 'medium',
            opacity: 1,
        },
        '&:focus': {
            color: sprintVelocityBaseColor,
        },
    }),
);
