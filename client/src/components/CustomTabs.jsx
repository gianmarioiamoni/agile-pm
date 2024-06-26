// src/components/CustomTabs.js
import { styled } from '@mui/system';
import { Tabs, Tab } from '@mui/material';

import { defaultBaseColor, reportBaseColor, metricBaseColor } from '../utils/colors';

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
        color: defaultBaseColor,
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
            // color: '#40a9ff',
            color: defaultBaseColor,
            opacity: 1,
        },
        '&.Mui-selected': {
            // color: '#1890ff',
            color: defaultBaseColor,
            fontWeight: 'medium',
        },
        '&:focus': {
            // color: '#40a9ff',
            color: defaultBaseColor,
        },
    }),
);


export const MetricTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 'regular',
        color: metricBaseColor,
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
            color: metricBaseColor,
            opacity: 1,
        },
        '&.Mui-selected': {
            color: metricBaseColor,
            fontWeight: 'medium',
            opacity: 1,
        },
        '&:focus': {
            color: metricBaseColor,
        },
    }),
);

export const ReportTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 'regular',
        color: reportBaseColor,
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
            color: reportBaseColor,
            opacity: 1,
        },
        '&.Mui-selected': {
            color: reportBaseColor,
            fontWeight: 'medium',
            opacity: 1,
        },
        '&:focus': {
            color: reportBaseColor,
        },
    }),
);
