// EditProjectForm.jsx

import { TextField } from '@mui/material';

/**
 * Project edit form component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.project - The project object.
 * @param {Function} props.onInputChange - The input change handler.
 * @returns {JSX.Element} - The rendered component.
 */
export default function EditProjectForm({ project, onInputChange }) {
    // Render the project edit form.
    return (
        <>
            {/* Project name input */}
            <TextField
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                value={project ? project.name : ""}
                onChange={onInputChange}
                margin="normal"
            />
            {/* Project description input */}
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

