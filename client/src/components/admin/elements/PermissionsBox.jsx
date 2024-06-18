import { useId } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

/**
 * PermissionsBox component
 * 
 * Renders a permissions box for a given role and permissions
 * 
 * @param {Object} props - The component props
 * @param {string} props.permissionsLabel - The label for the permissions box
 * @param {Object} props.permissions - The permissions object for the box
 * @param {Array} props.rolePermissionsMap - The current permissions map for the role
 * @param {Function} props.setRolePermissionsMap - The function to update the permissions map
 * @param {Object} props.role - The role object
 * @param {number} props.roleIndex - The index of the role in the permissions map
 */
export default function PermissionsBox({
    permissionsLabel,
    permissions,
    rolePermissionsMap,
    setRolePermissionsMap,
    role,
    roleIndex }) {
    
    /**
     * Get the index of a permission in the role permissions map
     * 
     * @param {Array} permissionsArray - The permissions array
     * @param {string} permission - The permission to search for
     * @returns {number} The index of the permission, or -1 if not found
     */
    const getIndexPermissionIncluded = (permissionsArray, permission) => {
        for (let i = 0; i < permissionsArray.length; i++) {
            const permArray = Object.values(permissionsArray[i]);

            if (permArray[0].includes(permission)) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Check if a permission is included in the role permissions map
     * 
     * @param {Array} permissionsArray - The permissions array
     * @param {string} permission - The permission to search for
     * @returns {boolean} True if the permission is included, false otherwise
     */
    const isPermissionIncluded = (permissionsArray, permission) => {
        return getIndexPermissionIncluded(permissionsArray, permission) !== -1;
    }

    /**
     * Handle a permission change event
     * 
     * @param {number} roleIndex - The index of the role in the permissions map
     * @param {string} permissionKey - The key of the permission that was changed
     */
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
                {/* Label for the permissions box */}
                {permissionsLabel}
            </Typography>
            <FormGroup key={useId()} row>
                {/* Render checkboxes for each permission */}
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
