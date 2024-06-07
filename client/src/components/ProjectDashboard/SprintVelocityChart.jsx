// src/components/ProjectDashboard/SprintVelocityChart.js

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Component to render a sprint velocity chart using Recharts library.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Data for the sprint velocity chart
 * @return {JSX.Element} Sprint velocity chart component
 */
export default function SprintVelocityChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Velocity line */}
                <Line type="monotone" dataKey="velocity" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
}
