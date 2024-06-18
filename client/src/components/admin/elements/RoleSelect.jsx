import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * RoleSelect component
 * 
 * This component renders a select box for selecting a role.
 * 
 * @param {Object} props - The component props
 * @param {boolean} [props.disabled=false] - Determines if the select box is disabled
 * @param {string} props.value - The currently selected value
 * @param {function} props.onChange - The function to call when the selected value changes
 * @param {Array} props.roles - An array of objects representing roles
 * @param {string} props.roles[].roleKey - The key of the role
 * @param {string} props.roles[].roleDescription - The description of the role
 */
const RoleSelect = ({ disabled = false, value, onChange, roles }) => {
    
    return (
        // Outlined form control
        <FormControl fullWidth variant="outlined">
            {/* Input label */}
            <InputLabel id="role-label">Select Role</InputLabel>
            {/* Select box */}
            <Select
                // Disable the select box if disabled prop is true
                disabled={disabled}
                labelId="role-label"
                id="role"
                // Currently selected value
                value={value}
                // Call onChange function when the selected value changes
                onChange={onChange}
                // Label for the select box
                label="Select Role"
            >
                {/* Option for selecting no role */}
                <MenuItem value="" disabled>
                    Select Role
                </MenuItem>
                {/* Render an option for each role */}
                {roles.map((role, index) => (
                    <MenuItem key={index} value={role.roleKey}>
                        {/* Display the description of the role */}
                        {role.roleDescription}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default RoleSelect;
