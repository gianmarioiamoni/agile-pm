// Authorizations.js

import { rolesMap } from "./utils/RolesProvider";

// Authorizations are defined as an object with keys corresponding to the endpoints or to actions in the application
// Usage:
// // Any file where you want to use permissions

// import permissions from './Authorization';

// // Use permissions as follows
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


export const permissions = {
    createProject: 'createProject',
    editProject: 'editProject',
    deleteProject: 'deleteProject',
    viewProject: 'viewProject',
    // Aggiungi altre autorizzazioni secondo necessità
};

//  mapping between user roles and associated permissions 
// Usage:
// // Assume currentUserRole is the role of the current user
// const currentUserRole = "Product Owner";


export const rolePermissions = {
    "Product Owner": { // role key: 1
        // Permissions for Product Owner
        projectManagement: ["create", "edit", "delete"], // Manage projects
        backlogManagement: ["manage"], // Manage project backlog
        sprintManagement: ["create"], // Create sprints
    },
    "Scrum Master": { // role key: 2
        // Permissions for Scrum Master
        sprintManagement: ["plan", "monitor"], // Plan and monitor sprints
        agileSupport: ["support"], // Support team in Agile practices
        obstacleResolution: ["resolve"], // Resolve obstacles
    },
    "Scrum Team Member": { // role key: 3
        // Permissions for Scrum Team Member
        taskManagement: ["view", "assign"], // View and assign tasks
        sprintParticipation: ["participate"], // Participate in sprint meetings
        collaboration: ["collaborate"], // Collaborate with team members
    },
};

// Function to check if the current user has permission to perform a specific action
// Usage:
// console.log(hasPermission("create")); // true - Product Owner can create projects
// console.log(hasPermission("plan")); // false - Product Owner cannot plan sprints
// console.log(hasPermission("participate")); // false - Product Owner cannot participate in sprint meetings
export const hasPermission = (currentUser, action) => {
    const currentUserRole = currentUser.role;
    // Check if the currentUserRole exists in rolePermissions mapping
    if (rolePermissions[currentUserRole]) {
        // Check if the action exists for the currentUserRole
        if (rolePermissions[currentUserRole][action]) {
            return true; // User has permission to perform the action
        }
    }
    return false; // User does not have permission to perform the action
};



