import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Paper, Container, Box, Grid } from '@mui/material';
import { Restore } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';

import { v4 as uuidv4 } from 'uuid';

import PermissionsBox from "./elements/PermissionsBox";
import { getPermissionsLabelValues, getRolePermissionsMap, updateRolePermissionsMap } from '../../services/rolesMapServices';

/**
 * PermissionManagement component displays and manages the permissions of a role.
 * It provides tabs for each role and allows the user to edit and save the permissions.
 * The component also provides a button to restore the default permissions.
 *
 * @param {Object} props - The props object containing rolePermissionsMap, setRolePermissionsMap and refreshCount.
 * @param {Array} props.rolePermissionsMap - The array of role permissions.
 * @param {Function} props.setRolePermissionsMap - The function to update the role permissions.
 * @param {number} props.refreshCount - The count to refresh the component.
 * @returns {JSX.Element} The rendered PermissionManagement component.
 */
export default function PermissionManagement({rolePermissionsMap, setRolePermissionsMap, refreshCount}) {
    // State to keep track of the selected tab
    const [selectedTab, setSelectedTab] = useState(0);

    /**
     * Handler function to handle tab change.
     *
     * @param {Object} event - The event object.
     * @param {number} newValue - The new value of the tab.
     */
    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    /**
     * Handler function to handle save changes.
     * It updates the role permissions map in the database.
     */
    const handleSaveChanges = async () => {
        try {
            await updateRolePermissionsMap("current", [...rolePermissionsMap]);
        } catch (error) {
            console.log(error)
        }
    };

    /**
     * Handler function to handle restore default.
     * It updates the role permissions map with the default values from the database.
     */
    const handleRestoreDefault = async () => {
        const defaultRolePermissionsMap = await getRolePermissionsMap("default");
        await updateRolePermissionsMap("current", defaultRolePermissionsMap);
        setRolePermissionsMap(defaultRolePermissionsMap);
    };


    // Effect hook to initialize the role permissions map
    useEffect(() => {
        const initStates = async () => {

            // Fetch the role permissions map from the database
            const rpm = await getRolePermissionsMap("current");
            setRolePermissionsMap([...rpm]);
        };
        initStates();
        
    }, [refreshCount])

    return (
        <>
            <Container component={Paper} >
                {/* Tabs for each role */}
                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Role Tabs">
                    {rolePermissionsMap && rolePermissionsMap.map((role, roleIndex) => (
                        <Tab label={role.role} key={roleIndex} />
                    ))}
                </Tabs>
                {/* Render the PermissionsBoxContainer for each role */}
                {rolePermissionsMap.map((role, roleIndex) => (
                    <TabPanel value={selectedTab} index={roleIndex} key={uuidv4()}>
                        <PermissionsBoxContainer
                            role={role}
                            roleIndex={roleIndex}
                            rolePermissionsMap={rolePermissionsMap}
                            setRolePermissionsMap={setRolePermissionsMap}
                        />
                    </TabPanel>
                ))}
            </Container>
            <Box display="flex" alignItems="flex-start"  >
                {/* Button to save roles */}
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveChanges}
                        fullWidth
                    >
                        Save Permissions
                    </Button>
                </Grid>
                {/* Button to restore default role */}
                <Grid item xs={3} sx={{ marginLeft: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Restore />}
                        onClick={handleRestoreDefault}
                        fullWidth
                    >
                        Default
                    </Button>
                </Grid>
            </Box>
        </>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}

function PermissionsBoxContainer({ role, roleIndex, rolePermissionsMap, setRolePermissionsMap }) {
    
    const [permissionsLabelValueArray, setPermissionsLabelValueArray] = useState([]);

    useEffect(() => {
        const initStates = async () => {
            // init permissionsLabelValueArray
            const plv = await getPermissionsLabelValues();
            setPermissionsLabelValueArray([...plv]);

        };
        initStates();

    }, [])


    return (
        <>
            <div style={{ maxHeight: "350px", overflowY: "auto", marginBottom: "3"}}>
                {/* <h3>{role.role}</h3> */}
                {/* Permissions Boxes */}
                {permissionsLabelValueArray.map((p, idx) => (
                    <PermissionsBox
                        key={uuidv4()}
                        permissionsLabel={p.label}
                        permissions={p.permissions}
                        rolePermissionsMap={rolePermissionsMap}
                        setRolePermissionsMap={setRolePermissionsMap}
                        role={role}
                        roleIndex={roleIndex}
                    />
                ))}
            </div>
        </>
    );
}
