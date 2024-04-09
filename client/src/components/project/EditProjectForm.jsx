// EditProjectForm.jsx

import { TextField } from '@mui/material';

export default function EditProjectForm ({ project, onInputChange }) {
    return (
        <>
            <TextField
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                value={project ? project.name : ""}
                onChange={onInputChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Description"
                variant="outlined"
                name="description"
                value={project ? project.description : ""}
                onChange={onInputChange}
                multiline
                rows={4}
                margin="normal"
            />
        </>
    );
};

