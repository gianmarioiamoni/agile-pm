import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Component to render a burndown chart using Recharts library.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Data for the burndown chart
 * @return {JSX.Element} Burndown chart component
 */
export default function BurndownChart({ data }) {
    console.log("BurndownChart() - data: ", data);

    // Flat the dailyPoints array
    const chartData = data.flatMap(sprint => {
        const totalPoints = sprint.dailyPoints[0].remainingPoints;
        const idealDecrement = totalPoints / (sprint.dailyPoints.length - 1);
        return sprint.dailyPoints.map((point, index) => ({
            ...point,
            idealPoints: Math.max(totalPoints - index * idealDecrement, 0) // ideal line calculation 
        }));
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Actual line */}
                <Line type="monotone" dataKey="completedPoints" stroke="#8884d8" />
                {/* Remaining line */}
                <Line type="monotone" dataKey="remainingPoints" stroke="#82ca9d" />
                {/* Ideal line */}
                <Line type="monotone" dataKey="idealPoints" stroke="#FF0000" strokeDasharray="5 5" />
            </LineChart>
        </ResponsiveContainer>
    );
}
