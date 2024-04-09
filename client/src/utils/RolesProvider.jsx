import { createContext, useState } from 'react';

export const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
    const [roles, setRoles] = useState([
        { id: 1, description: 'Product Owner' },
        { id: 2, description: 'Scrum Master' },
        { id: 3, description: 'Team Scrum Member' }
        // Aggiungi altri ruoli se necessario
    ]);

    return (
        <RolesContext.Provider value={roles}>
            {children}
        </RolesContext.Provider>
    );
};
