import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Paper, Container, Box, Grid } from '@mui/material';
import { Restore } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';

import { v4 as uuidv4 } from 'uuid';

import PermissionsBox from "./elements/PermissionsBox";
import { getPermissionsLabelValues, getRolePermissionsMap, updateRolePermissionsMap } from '../../services/rolesMapServices';

export default function PermissionManagement({rolePermissionsMap, setRolePermissionsMap, refreshCount}) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleSaveChanges = async () => {
        try {
            await updateRolePermissionsMap("current", [...rolePermissionsMap]);
        } catch (error) {
            console.log(error)
        }
    };

    const handleRestoreDefault = async () => {
        const defaultRolePermissionsMap = await getRolePermissionsMap("default");
        await updateRolePermissionsMap("current", defaultRolePermissionsMap);
        setRolePermissionsMap(defaultRolePermissionsMap);
    };


    useEffect(() => {
        const initStates = async () => {

            // init rolePermissionsMap
            const rpm = await getRolePermissionsMap("current");
            setRolePermissionsMap([...rpm]);
        };
        initStates();
        
    }, [refreshCount])

    return (
        <>
            <Container component={Paper} >
                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Role Tabs">
                    {rolePermissionsMap && rolePermissionsMap.map((role, roleIndex) => (
                        <Tab label={role.role} key={roleIndex} />
                    ))}
                </Tabs>
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
                {/* button to save roles */}
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
                {/* button to restore default role */}
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
