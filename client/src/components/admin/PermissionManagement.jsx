import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Paper, Container } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import PermissionsBox from "./elements/PermissionsBox";
import { getPermissionsLabelValues, getRolesMap, updateRolesMap } from '../../services/rolesMapServices';

export default function PermissionManagement({rolePermissionsMap, setRolePermissionsMap, refreshCount}) {
    // const [rolePermissionsMap, setRolePermissionsMap] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleSaveChanges = async () => {
        console.log('Changes to permissions saved:', rolePermissionsMap);
        try {
            await updateRolesMap("current", [...rolePermissionsMap]);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const initStates = async () => {

            // init rolePermissionsMap
            const rpm = await getRolesMap("current");
            setRolePermissionsMap([...rpm]);
        };
        initStates();
        
    }, [refreshCount])

    return (
        <>
            <Container component={Paper} >
                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Role Tabs">
                    {rolePermissionsMap.map((role, roleIndex) => (
                        <Tab label={role.role} key={roleIndex} />
                    ))}
                </Tabs>
                {rolePermissionsMap.map((role, roleIndex) => (
                    <TabPanel value={selectedTab} index={roleIndex} key={roleIndex}>
                        <PermissionsBoxContainer
                            role={role}
                            roleIndex={roleIndex}
                            rolePermissionsMap={rolePermissionsMap}
                            setRolePermissionsMap={setRolePermissionsMap}
                        />
                    </TabPanel>
                ))}
            </Container>
            <Button
                variant="contained"
                startIcon={<SaveIcon />} 
                onClick={handleSaveChanges}
            >
                Save Permissions
            </Button>
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
                        key={idx}
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
