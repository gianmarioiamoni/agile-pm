// import { createContext, useState, useEffect } from 'react';

// import { getCurrentRoles } from '../services/userServices';

// // export const rolesMap = [
// //     { id: 1, description: 'Product Owner' },
// //     { id: 2, description: 'Scrum Master' },
// //     { id: 3, description: 'Scrum Team Member' }
// //     // Add other roles if needed
// // ];

// // const getRoles = async () => {
// //     return await getCurrentRoles();
// // }

// // const currentRoles = getRoles();
// // console.log("RolesProvider() - currentRoles: ", currentRoles)

// export const RolesContext = createContext();

// export const RolesProvider = async ({ children }) => {
//     try {
//         const currentRoles = await getCurrentRoles();
//         console.log("RolseProvider() - currentRoles: ", currentRoles)

//         const [roles] = useState(currentRoles);
    

//         return (
//             <RolesContext.Provider value={roles}>
//                 {children}
//             </RolesContext.Provider>
//         );
//     } catch(err) { console.log(err)  }
// };
