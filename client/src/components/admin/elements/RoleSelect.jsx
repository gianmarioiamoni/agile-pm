import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RoleSelect = ({ disabled=false, value, onChange, roles }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
                disabled={disabled}
                labelId="role-label"
                id="role"
                value={value}
                onChange={onChange}
                label="Select Role"
            >
                <MenuItem value="" disabled>
                    Select Role
                </MenuItem>
                {roles.map((role, index) => (
                    <MenuItem key={index} value={role.id}>
                        {role.description}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default RoleSelect;
