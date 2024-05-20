// components/AddSprint.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

/**
 * A React component that renders a form to create a new sprint for a project.
 *
 * @param {object} props Component props.
 * @param {string} projectId The ID of the project for which to create the sprint.
 * @param {array} sprints An array of all sprints for the project.
 * @param {function} setSprints A callback to update the array of sprints.
 * @return {ReactElement} The component element.
 */
export default function AddSprint({ projectId, sprints, setSprints }) {
    /**
     * The state of the form, containing the name, start date, end date, and goal of the sprint to create.
     */
    const [sprint, setSprint] = useState({
        name: '',
        projectId,
        startDate: '',
        endDate: '',
        goal: '',
    });

    /**
     * Handles the submission of the form by creating a new sprint with the form data.
     * @param {SyntheticEvent} e The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/server/sprints', sprint);
            setSprints([...sprints, response.data]);
            setSprint({
                name: '',
                projectId,
                startDate: '',
                endDate: '',
                goal: '',
            });
        } catch (error) {
            console.error('Error creating sprint:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Create New Sprint
            </Typography>
            <TextField
                label="Sprint Name"
                value={sprint.name}
                onChange={(e) =>
                    setSprint((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                fullWidth
                margin="normal"
                name="name"
            />
            <TextField
                label="Start Date"
                type="date"
                value={sprint.startDate}
                onChange={(e) =>
                    setSprint((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name="startDate"
            />
            <TextField
                label="End Date"
                type="date"
                value={sprint.endDate}
                onChange={(e) =>
                    setSprint((prev) => ({ ...prev, endDate: e.target.value }))
                }
                required
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name="endDate"
            />
            <TextField
                label="Sprint Goal"
                value={sprint.goal}
                onChange={(e) =>
                    setSprint((prev) => ({ ...prev, goal: e.target.value }))
                }
                fullWidth
                margin="normal"
                name="goal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Sprint
            </Button>
        </Box>
    );
};

