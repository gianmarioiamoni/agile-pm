import React, { useState } from 'react';
import { Button, IconButton, Tab, Tabs, Paper, Container } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import PermissionsBox from "./elements/PermissionsBox";
import { defaultRolePermissionsMap, permissionsLabelValueArray } from "../../Authorizations";

export default function PermissionManagement() {
    const [rolePermissionsMap, setRolePermissionsMap] = useState(defaultRolePermissionsMap);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleSaveChanges = () => {
        console.log('Changes to permissions saved:', rolePermissionsMap);
    };

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
                Save
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
