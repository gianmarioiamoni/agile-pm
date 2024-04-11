import { createContext, useState } from 'react';

export const rolesMap = [
    { id: 1, description: 'Product Owner' },
    { id: 2, description: 'Scrum Master' },
    { id: 3, description: 'Scrum Team Member' }
    // Add other roles if needed
];

export const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
    const [roles] = useState(rolesMap);

    return (
        <RolesContext.Provider value={roles}>
            {children}
        </RolesContext.Provider>
    );
};
