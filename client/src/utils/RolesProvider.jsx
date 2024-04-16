import { createContext, useState, useEffect } from 'react';

import { getCurrentRoles } from '../services/userServices';

export const rolesMap = [
    { id: 1, description: 'Product Owner' },
    { id: 2, description: 'Scrum Master' },
    { id: 3, description: 'Scrum Team Member' }
    // Add other roles if needed
];

let currentRoles;

export const RolesContext = createContext();



export const RolesProvider = ({ children }) => {
    const [roles] = useState(currentRoles);
    
    useEffect(() => {

    // get current roles from services; if default roles doesn't exist, It will create it
    currentRoles = getCurrentRoles();
    
}, [])

    return (
        <RolesContext.Provider value={roles}>
            {children}
        </RolesContext.Provider>
    );
};
