import React, { useState } from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox, Box, Button } from '@mui/material';

import {
    defaultRolePermissionsMap,
    permissions,
    projectPermissions, projectPermissionsLabel,
    sprintPermissions, sprintPermissionsLabel
} from "../../Authorizations";

import { getRolesMap, createRolesMap, updateRolesMap } from '../../services/rolesMapServices';


export default function PermissionManagement() {
    const [rolePermissionsMap, setRolePermissionsMap] = useState(defaultRolePermissionsMap);

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
    // const isPermissionIncluded = (permissionsArray, permission) => {
    //     for (let i = 0; i < permissionsArray.length; i++) {
    //         const permArray = Object.values(permissionsArray[i]);
            
    //         if (permArray[0].includes(permission)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // };

    const handlePermissionChange = (roleIndex, permissionKey) => {
        const updatedPermissionsMap = [...rolePermissionsMap];
        const permissionIndex = Object.keys(projectPermissions).indexOf(permissionKey);
        const permissionValue = projectPermissions[permissionKey];
        // const isChecked = !!updatedPermissionsMap[roleIndex].permissions.includes(permissionValue);
        console.log("permissionValue: ", permissionValue)
        console.log("updatedPermissionsMap: ", updatedPermissionsMap)
        console.log("roleIndex: ", roleIndex)
        console.log("updatedPermissionsMap[roleIndex]: ", updatedPermissionsMap[roleIndex])
        console.log("updatedPermissionsMap[roleIndex].permissions: ", updatedPermissionsMap[roleIndex].permissions)

        const isChecked = isPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);

        const rolePermisssionsArray = updatedPermissionsMap[roleIndex].permissions;
        console.log("rolePermissionsArray: ", rolePermisssionsArray)

        if (isChecked) {
            // Permission is present: remove It
            const idx = getIndexPermissionIncluded(updatedPermissionsMap[roleIndex].permissions, permissionValue);
            const catPermArray = Object.values(updatedPermissionsMap[roleIndex].permissions[idx]);
            const catPermKey = Object.keys(updatedPermissionsMap[roleIndex].permissions[idx])[0];
            console.log("catPermKey: ", catPermKey)
            catPermArray[0] = catPermArray[0].filter((p) => p !== permissionValue);

            updatedPermissionsMap[roleIndex].permissions[idx][catPermKey] = catPermArray[0];

            // updatedPermissionsMap[roleIndex].permissions = updatedPermissionsMap[roleIndex].permissions.filter(permission => permission !== permissionValue);
        } else {
            // Permission is not present: add It
            
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
                            {Object.keys(projectPermissions).map((permissionKey, permissionsIndex) => (
                                    <FormControlLabel
                                        key={permissionKey}
                                        control={
                                            <Checkbox
                                                // checked={role.permissions.includes(projectPermissions[permissionKey])}
                                                checked={isPermissionIncluded(role.permissions, projectPermissions[permissionKey])}
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


