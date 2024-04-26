// Authorizations.js


// import { getCurrentRoles, getCurrentPermissions } from "./services/userServices";


// // SERVER
// export const defaultRolesMap = [
//     { id: 0, description: 'Admin' },
//     { id: 1, description: 'Product Owner' },
//     { id: 2, description: 'Scrum Master' },
//     { id: 3, description: 'Scrum Team Member' }
// ];

// // SERVER
// export const permissions = {
//     // Project permissions
//     project: {
//         label: 'Project',
//         actions: {
//             create: 'projectCreate',
//             edit: 'projectEdit',
//             delete: 'projectDelete',
//             view: 'projectView'
//         }
//     },
//     sprint: {
//         label: 'Sprint',
//         actions: {
//             create: 'sprintCreate',
//             plan: 'sprintPlan',
//             monitor: 'sprintMonitor',
//             participate: 'sprintParticipate'
//         }
//     },
//     backlog: {
//         label: 'Backlog',
//         actions: {
//             manage: 'backlogManage'
//         }
//     },
//     agile: {
//         label: 'Agile',
//         actions: {
//             support: 'agileSupport'
//         }
//     },
//     obstacle: {
//         label: 'Obstacle',
//         actions: {
//             resolve: 'obstacleResolve'
//         }
//     },
//     task: {
//         label: 'task',
//         actions: {
//             view: 'taskView',
//             assign: 'taskAssign'
//         }
//     },
//     collaboration: {
//         label: 'collaboration',
//         actions: {
//             collaborate: 'collaborationCollaborate',
//         }
//     },
//     // Aggiungi altre autorizzazioni secondo necessità
// };

// // SERVER
// // shortcuts to access permissions
// const projectPermissions = permissions.project.actions;
// const projectPermissionsLabel = permissions.project.label;

// const sprintPermissions = permissions.sprint.actions;
// const sprintPermissionsLabel = permissions.sprint.label;

// const backlogPermissions = permissions.backlog.actions;
// const backlogPermissionsLabel = permissions.backlog.label;

// const agilePermissions = permissions.agile.actions;
// const agilePermissionsLabel = permissions.agile.label;

// const obstaclePermissions = permissions.obstacle.actions;
// const obstaclePermissionsLabel = permissions.obstacle.label;

// const taskPermissions = permissions.task.actions;
// const taskPermissionsLabel = permissions.task.label;

// const collaborationPermissions = permissions.collaboration.actions;
// const collaborationPermissionsLabel = permissions.collaboration.label;


// // SERVER + API call to provide permissionsLabelValueArray 
// export const permissionsLabelValueArray = [
//     { label: projectPermissionsLabel, permissions: projectPermissions },
//     { label: sprintPermissionsLabel, permissions: sprintPermissions },
//     { label: backlogPermissionsLabel, permissions: backlogPermissions },
//     { label: agilePermissionsLabel, permissions: agilePermissions },
//     { label: obstaclePermissionsLabel, permissions: obstaclePermissions },
//     { label: taskPermissionsLabel, permissions: taskPermissions },
//     { label: collaborationPermissionsLabel, permissions: collaborationPermissions },
// ];

// //  mapping between user roles and associated permissions 

// // SERVER
// export const defaultRolePermissionsMap = [
//     {
//         role: "Product Owner", 
//         permissions: [
//             {
//                 project: [
//                     projectPermissions.create,
//                     projectPermissions.edit,
//                     projectPermissions.delete
//                 ]
//             },
//             {
//                 sprint: [
//                     sprintPermissions.create,
//                 ]
//             },
//             {
//                 backlog: [
//                     backlogPermissions.manage
//                 ]
//             }
//         ]
//     },
//     {
//         role: "Scrum Master", 
//         permissions: [
//             {
//                 project: [
//                     projectPermissions.create,
//                     projectPermissions.delete
//                 ]
//             },
//             {
//                 sprint: [
//                     sprintPermissions.plan,
//                     sprintPermissions.monitor,
//                 ]
//             },
//             {
//                 agile: [
//                     agilePermissions.support,
//                 ]
//             },
//             {
//                 obstacle: [
//                     obstaclePermissions.resolve
//                 ]
//             }
//         ]
//     },
//     {
//         role: "Scrum Team Member", 
//         permissions: [
//             {
//                 project: [
//                     projectPermissions.view
//                 ]
//             },
//             {
//                 sprint: [
//                     sprintPermissions.participate
//                 ]
//             },
//             {
//                 task: [
//                     taskPermissions.view,
//                     taskPermissions.assign
//                 ]
//             },
//             {
//                 collaboration: [
//                     collaborationPermissions.collaborate,
//                 ]
//             }
//         ]
//     }];

// // SERVER

// // Function to check if the current user has permission to perform a specific action
// const hasPermission = async (currentUser, action) => {
//     // check if the user is Admin
//     if (currentUser.role === 0) {
//         // Admin has all authorizations
//         return true;
//     }

//     const rolesMap = await getCurrentRoles();

//     const currentUserRoleObj = rolesMap ? rolesMap.find((r) => {
//         return r.id === currentUser.role
//     }) : null;

//     if (currentUserRoleObj == null) {
//         console.log("No user role found")
//         return;
//     }
//     const currentUserRole = currentUserRoleObj.description;
//     const rolePermissionsMap = await getCurrentPermissions();

//     // Check if the currentUserRole exists in rolePermissions mapping
//     const currentUserPermissions = rolePermissionsMap ? rolePermissionsMap.find((rp) => rp.role === currentUserRole) : null;
//     if (currentUserPermissions) {
//         // Check if the action exists for the currentUserRole
//         currentUserPermissions.permissions.map((up) => {
//             const permissionsArray = Object.values(up);
//             if (permissionsArray.includes(action)) {
//                 return true;
//             }
//         })
//     }
//     return false; // User does not have permission to perform the action
// };

// // SERVER + API Call
// // utility functions to check permissions in components
// export const canEditProject = (currentUser) => {
//     return hasPermission(currentUser, projectPermissions.edit);
// };

// export const canCreateProject = async (currentUser) => {
//     return await hasPermission(currentUser, projectPermissions.create);
// };

// export const canDeleteProject = (currentUser) => {
//     return hasPermission(currentUser, projectPermissions.delete);
// };

// export const canViewProject = (currentUser) => {
//     return hasPermission(currentUser, projectPermissions.view);
// };



