import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

/**
 * Component to render a burndown chart using Recharts library.
 *
 * @param {Object} props - Component props
 * @param {Array} props.sprintData - Data for the burndown chart for sprints
 * @param {Array} props.projectData - Data for the burndown chart for project
 * @return {JSX.Element} Burndown chart component
 */
const BurndownChart = ({ sprintData, projectData }) => {
    console.log('sprintData: ', sprintData);
    console.log('projectData: ', projectData);

    /**
     * Helper function to format the data for the burndown chart.
     * Calculates the ideal line for each sprint.
     *
     * @param {Array} data - Data for the burndown chart
     * @return {Array} Formatted data for the burndown chart
    */
    const formatData = (data) => data.flatMap(sprint => {
        const totalPoints = sprint.totalSprintPoints;
        const idealDecrement = totalPoints / (sprint.dailyPoints.length - 1);
        return sprint.dailyPoints.map((point, index) => ({
            ...point,
            idealPoints: Math.max(totalPoints - index * idealDecrement, 0) // ideal line calculation 
        }));
    });

    // Format sprint data
    const formattedSprintData = formatData(sprintData);

    // Format project data
    const formattedProjectData = projectData.map((point, index) => {
        const totalPoints = projectData[0].remainingPoints;
        const idealDecrement = totalPoints / (projectData.length - 1);
        return {
            ...point,
            idealPoints: Math.max(totalPoints - index * idealDecrement, 0) // ideal line calculation 
        };
    });

    return (
        <div>
            {/* Render sprint burndown chart */}
            <Typography variant="h6" gutterBottom>Sprint Burndown Chart</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formattedSprintData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} style={{ fontSize: '0.8rem' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completedPoints" stroke="#8884d8" name='Actual Work Completed Line' />
                    <Line type="monotone" dataKey="remainingPoints" stroke="#82ca9d" name='Work Remaining Line' />
                    <Line type="monotone" dataKey="idealPoints" stroke="#FF0000" strokeDasharray="5 5" name='Ideal Sprint Remaining Line' />
                </LineChart>
            </ResponsiveContainer>
            {/* Render project burndown chart */}
            <Typography variant="h6" gutterBottom>Project Burndown Chart</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formattedProjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} style={{ fontSize: '0.8rem' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completedPoints" stroke="#8884d8" name='Actual Work Completed Line' />
                    <Line type="monotone" dataKey="remainingPoints" stroke="#82ca9d" name='Work Remaining Line' />
                    <Line type="monotone" dataKey="idealPoints" stroke="#FF0000" strokeDasharray="5 5" name='Ideal Project Remaining Line' />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BurndownChart;

