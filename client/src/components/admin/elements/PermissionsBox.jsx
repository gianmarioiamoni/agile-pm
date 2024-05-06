import { useId } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function PermissionsBox({permissionsLabel, permissions, rolePermissionsMap, setRolePermissionsMap, role, roleIndex}) {
    
    const getIndexPermissionIncluded = (permissionsArray, permission) => {
        for (let i = 0; i < permissionsArray.length; i++) {
            const permArray = Object.values(permissionsArray[i]);

            if (permArray[0].includes(permission)) {
                return i;
            }
        }
        return -1;
    };

    const isPermissionIncluded = (permissionsArray, permission) => {
        return getIndexPermissionIncluded(permissionsArray, permission) !== -1;
    }

    const handlePermissionChange = (roleIndex, permissionKey) => {
        const updatedPermissionsMap = [...rolePermissionsMap];
        const permissionIndex = Object.keys(permissions).indexOf(permissionKey);
        const permissionValue = permissions[permissionKey];

        const isChecked = isPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);

        const rolePermissionsArray = updatedPermissionsMap[roleIndex].permissions;

        if (isChecked) {
            // Permission is present: remove It
            const idx = getIndexPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);
            const groupPermArray = Object.values(updatedPermissionsMap[roleIndex].permissions[idx]);
            const groupPermKey = Object.keys(updatedPermissionsMap[roleIndex].permissions[idx])[0];
            groupPermArray[0] = groupPermArray[0].filter((p) => p !== permissionValue);

            updatedPermissionsMap[roleIndex].permissions[idx][groupPermKey] = groupPermArray[0];

        } else {
            // Permission is not present: add It

            // get group key from permission value. es. createProject => project
            const lowPermValue = permissionValue.toLowerCase();
            const groupPermKey = lowPermValue.slice(0, lowPermValue.length - permissionKey.length);

            if (updatedPermissionsMap[roleIndex].permissions) {
                // new custom role, no permissions checked
                updatedPermissionsMap[roleIndex].permissions.push({ [groupPermKey]: [permissionValue] });
            } else {
                // existing role with existing permissions
                updatedPermissionsMap[roleIndex].permissions.map((p) => {
                    if (Object.keys(p)[0] === groupPermKey) {
                        p[groupPermKey].push(permissionValue)
                    }
                })
            }
        }

        setRolePermissionsMap(updatedPermissionsMap);
    };


    return (
        <Box display="flex" flexDirection="column" alignItems="flexStart" marginBottom={2}>
            <Typography key={useId()} variant="h8" gutterBottom fontWeight="bold" marginRight={3} marginBottom={-1}>
                {permissionsLabel}
            </Typography>
            <FormGroup key={useId()} row>
                {Object.keys(permissions).map((permissionKey) => (
                    <FormControlLabel
                        key={permissionKey}
                        control={
                            <Checkbox
                                checked={isPermissionIncluded(role.permissions, permissions[permissionKey])}
                                onChange={() => handlePermissionChange(roleIndex, permissionKey)}
                            />
                        }
                        label={permissionKey}
                    />
                ))}
            </FormGroup>
        </Box>
    )
}