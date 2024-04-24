import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { v4 as uuidv4 } from 'uuid';


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
        console.log("permissionValue: ", permissionValue)
        console.log("updatedPermissionsMap: ", updatedPermissionsMap)
        console.log("roleIndex: ", roleIndex)
        console.log("updatedPermissionsMap[roleIndex]: ", updatedPermissionsMap[roleIndex])
        console.log("updatedPermissionsMap[roleIndex].permissions: ", updatedPermissionsMap[roleIndex].permissions)

        const isChecked = isPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);

        const rolePermissionsArray = updatedPermissionsMap[roleIndex].permissions;
        console.log("rolePermissionsArray: ", rolePermissionsArray)

        if (isChecked) {
            // Permission is present: remove It
            const idx = getIndexPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);
            const groupPermArray = Object.values(updatedPermissionsMap[roleIndex].permissions[idx]);
            const groupPermKey = Object.keys(updatedPermissionsMap[roleIndex].permissions[idx])[0];
            console.log("groupPermKey: ", groupPermKey)
            console.log("permissionKey: ", permissionKey)
            groupPermArray[0] = groupPermArray[0].filter((p) => p !== permissionValue);

            updatedPermissionsMap[roleIndex].permissions[idx][groupPermKey] = groupPermArray[0];

            // updatedPermissionsMap[roleIndex].permissions = updatedPermissionsMap[roleIndex].permissions.filter(permission => permission !== permissionValue);
        } else {
            // Permission is not present: add It

            // get group key from permission value. es. createProject => project
            const lowPermValue = permissionValue.toLowerCase();
            console.log("lowPermValue: ", lowPermValue)
            console.log("permissionKey: ", permissionKey)
            console.log("lowPermValue.length: ", lowPermValue.length)
            console.log("permissionKey.length: ", permissionKey.length)
            const groupPermKey = lowPermValue.slice(0, lowPermValue.length - permissionKey.length);
            console.log("groupPermKey: ", groupPermKey)

            updatedPermissionsMap[roleIndex].permissions.map((p) => {
                if (Object.keys(p)[0] === groupPermKey) {
                    p[groupPermKey].push(permissionValue)
                }
            })


            // updatedPermissionsMap[roleIndex].permissions.push(permissionValue);
        }

        setRolePermissionsMap(updatedPermissionsMap);
    };


    return (
        <Box display="flex" flexDirection="column" alignItems="flexStart" marginBottom={2}>
            <Typography key={uuidv4()} variant="h8" gutterBottom fontWeight="bold" marginRight={3} marginBottom={-1}>
                {permissionsLabel}
            </Typography>
            <FormGroup key={uuidv4()} row>
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