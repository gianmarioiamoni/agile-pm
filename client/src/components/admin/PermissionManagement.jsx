import React, { useState } from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox, Box, Button } from '@mui/material';

import { defaultRolePermissionsMap, permissions, projectPermissions, projectPermissionsLabel } from '../../Authorizations';

export default function PermissionManagement() {
    const [rolePermissionsMap, setRolePermissionsMap] = useState(defaultRolePermissionsMap);

    const handlePermissionChange = (roleIndex, permissionKey) => {
        const updatedPermissionsMap = [...rolePermissionsMap];
        const permissionIndex = Object.keys(projectPermissions).indexOf(permissionKey);
        const permissionValue = projectPermissions[permissionKey];
        const isChecked = !!updatedPermissionsMap[roleIndex].permissions.includes(permissionValue);

        if (isChecked) {
            // Remove permission if already present
            updatedPermissionsMap[roleIndex].permissions = updatedPermissionsMap[roleIndex].permissions.filter(permission => permission !== permissionValue);
        } else {
            // Add permission if not present
            updatedPermissionsMap[roleIndex].permissions.push(permissionValue);
        }

        setRolePermissionsMap(updatedPermissionsMap);
    };

    const handleSaveChanges = () => {
        console.log('Changes to permissions saved:', rolePermissionsMap);
    };

    return (
        <div>
            {rolePermissionsMap.map((role, roleIndex) => (
                <div key={roleIndex}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        {role.role}
                    </Typography>
                    {/* Projects permissions */}
                    <Box display="flex" alignItems="center" marginBottom={2}>
                        <Typography variant="h8" gutterBottom fontWeight="bold" marginRight={3}>
                            {projectPermissionsLabel}
                        </Typography>
                        <FormGroup row>
                            {Object.keys(projectPermissions).map((permissionKey, permissionIndex) => (
                                <FormControlLabel
                                    key={permissionKey}
                                    control={
                                        <Checkbox
                                            checked={role.permissions.includes(projectPermissions[permissionKey])}
                                            onChange={() => handlePermissionChange(roleIndex, permissionKey)}
                                        />
                                    }
                                    label={permissionKey}
                                />
                            ))}
                        </FormGroup>
                    </Box>
                </div>
            ))}
            {/* Save button */}
            <Button variant="contained" onClick={handleSaveChanges}>
                Save
            </Button>
        </div>
    );
}
