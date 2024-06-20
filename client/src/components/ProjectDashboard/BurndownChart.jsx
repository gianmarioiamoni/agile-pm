import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BurndownChart = ({ sprintData, projectData }) => {

    const formatData = (data) => data.flatMap(sprint => {
        const totalPoints = sprint.dailyPoints[0].remainingPoints;
        const idealDecrement = totalPoints / (sprint.dailyPoints.length - 1);
        return sprint.dailyPoints.map((point, index) => ({
            ...point,
            idealPoints: Math.max(totalPoints - index * idealDecrement, 0) // ideal line calculation 
        }));
    });

    const formattedSprintData = formatData(sprintData);
    
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
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formattedSprintData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completedPoints" stroke="#8884d8" />
                    <Line type="monotone" dataKey="remainingPoints" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="idealPoints" stroke="#FF0000" strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formattedProjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completedPoints" stroke="#8884d8" />
                    <Line type="monotone" dataKey="remainingPoints" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="idealPoints" stroke="#FF0000" strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BurndownChart;
