// export const defaultRolesMap = [
//     { id: 1, description: 'Product Owner' },
//     { id: 2, description: 'Scrum Master' },
//     { id: 3, description: 'Scrum Team Member' }
// ];

// //  mapping between user roles and associated permissions 
// export const defaultRolePermissions = {
//         "Product Owner": // role key: 1
//             [
//                 projectPermissions.create,
//                 projectPermissions.edit,
//                 projectPermissions.delete
//             ]
//         // backlogManagement: ["manage"], // Manage project backlog
//         // sprintManagement: ["create"], // Create sprints
//         ,
//         "Scrum Master": // role key: 2
//             [
//                 projectPermissions.create,
//                 projectPermissions.delete
//             ]
//         // sprintManagement: ["plan", "monitor"], // Plan and monitor sprints
//         // agileSupport: ["support"], // Support team in Agile practices
//         // obstacleResolution: ["resolve"], // Resolve obstacles
//         ,
//         "Scrum Team Member": // role key: 3
//             // taskManagement: ["view", "assign"], // View and assign tasks
//             // sprintParticipation: ["participate"], // Participate in sprint meetings
//             // collaboration: ["collaborate"], // Collaborate with team members
//             [
//                 projectPermissions.view
//             ]

//     };

