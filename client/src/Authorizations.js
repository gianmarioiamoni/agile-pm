// Authorizations.js

import { rolesMap } from "./utils/RolesProvider";

// Authorizations are defined as an object with keys corresponding to the endpoints or to actions in the application
// Usage:
// import permissions from './Authorization';
//
// if (userRole === 'Product Owner') {
//     // Example authorization check for the Product Owner role
//     if (permissions.createProject) {
//         // The Product Owner user has permission to create a project
//         // Implement logic here
//     } else {
//         // The Product Owner user does not have permission to create a project
//         // Implement access denied handling here
//     }
// } else {
//     // Handle other roles
// }


const permissions = {
    // Project permissions
    project: {
        create: 'createProject',
        edit: 'editProject',
        delete: 'deleteProject',
        view: 'viewProject'
    }
    // Aggiungi altre autorizzazioni secondo necessità
};

// shortcutes to access permissions
const projectPermissions = permissions.project;

//  mapping between user roles and associated permissions 
const rolePermissions = {
    "Product Owner": // role key: 1
        [
            projectPermissions.create,
            projectPermissions.edit,
            projectPermissions.delete
        ] 
        // backlogManagement: ["manage"], // Manage project backlog
        // sprintManagement: ["create"], // Create sprints
    ,
    "Scrum Master": // role key: 2
        [
            projectPermissions.create,
            projectPermissions.delete
        ]
        // sprintManagement: ["plan", "monitor"], // Plan and monitor sprints
        // agileSupport: ["support"], // Support team in Agile practices
        // obstacleResolution: ["resolve"], // Resolve obstacles
    ,
    "Scrum Team Member": // role key: 3
        // taskManagement: ["view", "assign"], // View and assign tasks
        // sprintParticipation: ["participate"], // Participate in sprint meetings
        // collaboration: ["collaborate"], // Collaborate with team members
        [
            projectPermissions.view
        ]

};

// Function to check if the current user has permission to perform a specific action
// Usage:
// console.log(hasPermission(currentUser, "create")); // true - Product Owner can create projects
// console.log(hasPermission(currentUser, "plan")); // false - Product Owner cannot plan sprints
// console.log(hasPermission(currentUser, "participate")); // false - Product Owner cannot participate in sprint meetings
const hasPermission = (currentUser, action) => {
    // check if the user is Admin
    if (currentUser.role === 0) {
        // Admin has all authorizations
        return true;
    }

    const currentUserRoleObj = rolesMap.find((r) => {
        return r.id === currentUser.role
    });

    if (currentUserRoleObj == null) {
        console.log("No user role found")
        return;
    }
    const currentUserRole = currentUserRoleObj.description;

    // Check if the currentUserRole exists in rolePermissions mapping
    if (rolePermissions[currentUserRole]) {
        // Check if the action exists for the currentUserRole
        if (rolePermissions[currentUserRole].includes(action)) {
            return true; // User has permission to perform the action
        }
    }
    return false; // User does not have permission to perform the action
};

// utility functions to check permissions in components
export const canEditProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.edit);
};

export const canCreateProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.create);
};

export const canDeleteProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.delete);
};

export const canViewProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.view);
};



