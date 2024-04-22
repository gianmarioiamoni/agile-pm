import React, { useState } from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { defaultRolePermissionsMap, projectPermissions } from '../../Authorizations';

export default function PermissionManagement() {
    const [rolePermissionsMap, setRolePermissionsMap] = useState(defaultRolePermissionsMap);

    const handlePermissionChange = (roleIndex, permissionIndex) => {
        const updatedPermissionsMap = [...rolePermissionsMap];
        updatedPermissionsMap[roleIndex].permissions[permissionIndex] = !updatedPermissionsMap[roleIndex].permissions[permissionIndex];
        setRolePermissionsMap(updatedPermissionsMap);
    };

    return (
        <div>
            {rolePermissionsMap.map((role, roleIndex) => (
                <div key={roleIndex}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        {role.role}
                    </Typography>
                    <FormGroup>
                        {role.permissions.map((permission, permissionIndex) => (
                            <FormControlLabel
                                key={permissionIndex}
                                control={
                                    <Checkbox
                                        checked={!!permission}
                                        onChange={() => handlePermissionChange(roleIndex, permissionIndex)}
                                    />
                                }
                                label={Object.keys(projectPermissions)[permissionIndex]}
                            />
                        ))}
                    </FormGroup>
                </div>
            ))}
        </div>
    );
}
