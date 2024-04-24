// Authorizations.js

// import { rolesMap } from "./utils/RolesProvider";

import { getCurrentRoles, getCurrentPermissions } from "./services/userServices";

export const defaultRolesMap = [
    { id: 0, description: 'Admin' },
    { id: 1, description: 'Product Owner' },
    { id: 2, description: 'Scrum Master' },
    { id: 3, description: 'Scrum Team Member' }
];


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


// export const permissions = {
//     // Project permissions
//     project: {
//         create: 'createProject',
//         edit: 'editProject',
//         delete: 'deleteProject',
//         view: 'viewProject'
//     }
//     // Aggiungi altre autorizzazioni secondo necessità
// };

export const permissions = {
    // Project permissions
    project: {
        label: 'Project',
        actions: {
            create: 'projectCreate',
            edit: 'projectEdit',
            delete: 'projectDelete',
            view: 'projectView'
        }
    },
    sprint: {
        label: 'Sprint',
        actions: {
            create: 'sprintCreate',
            plan: 'sprintPlan',
            monitor: 'sprintMonitor',
            participate: 'sprintParticipate'
        }
    },
    backlog: {
        label: 'Backlog',
        actions: {
            manage: 'backlogManage'
        }
    },
    agile: {
        label: 'Agile',
        actions: {
            support: 'agileSupport'
        }
    },
    obstacle: {
        label: 'Obstacle',
        actions: {
            resolve: 'obstacleResolve'
        }
    }
    // Aggiungi altre autorizzazioni secondo necessità
};

// shortcuts to access permissions
export const projectPermissions = permissions.project.actions;
export const projectPermissionsLabel = permissions.project.label;

export const sprintPermissions = permissions.sprint.actions;
export const sprintPermissionsLabel = permissions.sprint.label;

export const backlogPermissions = permissions.backlog.actions;
export const backlogPermissionsLabel = permissions.backlog.label;

export const agilePermissions = permissions.agile.actions;
export const agilePermissionsLabel = permissions.agile.label;

export const obstaclePermissions = permissions.obstacle.actions;
export const obstaclePermissionsLabel = permissions.obstacle.label;

export const permissionsLabelValueArray = [
    { label: projectPermissionsLabel, permissions: projectPermissions },
    { label: sprintPermissionsLabel, permissions: sprintPermissions },
    { label: backlogPermissionsLabel, permissions: backlogPermissions },
    { label: agilePermissionsLabel, permissions: agilePermissions },
    { label: obstaclePermissionsLabel, permissions: obstaclePermissions },
]

//  mapping between user roles and associated permissions 

// export const defaultRolePermissionsMap = [
//     {
//         role: "Product Owner", // role key: 1
//         permissions: [
//             projectPermissions.create,
//             projectPermissions.edit,
//             projectPermissions.delete,
//             sprintPermissions.create
//         ]
//         // backlogManagement: ["manage"], // Manage project backlog
//         // sprintManagement: ["create"], // Create sprints
//     },
//     {
//         role: "Scrum Master", // role key: 2
//         permissions: [
//             projectPermissions.create,
//             projectPermissions.delete
//         ]
//         // sprintManagement: ["plan", "monitor"], // Plan and monitor sprints
//         // agileSupport: ["support"], // Support team in Agile practices
//         // obstacleResolution: ["resolve"], // Resolve obstacles
//     },
//     {
//         role: "Scrum Team Member", // role key: 3
//         // taskManagement: ["view", "assign"], // View and assign tasks
//         // sprintParticipation: ["participate"], // Participate in sprint meetings
//         // collaboration: ["collaborate"], // Collaborate with team members
//         permissions: [
//             projectPermissions.view
//         ]

//     }];

export const defaultRolePermissionsMap = [
    {
        role: "Product Owner", // role key: 1
        permissions: [
            {
                project: [
                    projectPermissions.create,
                    projectPermissions.edit,
                    projectPermissions.delete
                ]
            },
            {
                sprint: [
                    sprintPermissions.create,
                ]
            },
            {
                backlog: [
                    backlogPermissions.manage
                ]
            }
        ]
    },
    {
        role: "Scrum Master", // role key: 2
        permissions: [
            {
                project: [
                    projectPermissions.create,
                    projectPermissions.delete
                ]
            },
            {
                sprint: [
                    sprintPermissions.plan,
                    sprintPermissions.monitor,
                ]
            },
            {
                agile: [
                    agilePermissions.support,
                ]
            },
            {
                obstacle: [
                    obstaclePermissions.resolve
                ]
            }
        ]
        // agileSupport: ["support"], // Support team in Agile practices
        // obstacleResolution: ["resolve"], // Resolve obstacles
    },
    {
        role: "Scrum Team Member", // role key: 3
        // taskManagement: ["view", "assign"], // View and assign tasks
        // collaboration: ["collaborate"], // Collaborate with team members
        permissions: [
            {
                project: [
                    projectPermissions.view
                ]
            },
            {
                sprint: [
                    sprintPermissions.participate
                ]
            }
        ]
    }];


// Function to check if the current user has permission to perform a specific action
// Usage:
// console.log(hasPermission(currentUser, "create")); // true - Product Owner can create projects
// console.log(hasPermission(currentUser, "plan")); // false - Product Owner cannot plan sprints
// console.log(hasPermission(currentUser, "participate")); // false - Product Owner cannot participate in sprint meetings
const hasPermission = async (currentUser, action) => {
    // check if the user is Admin
    if (currentUser.role === 0) {
        // Admin has all authorizations
        return true;
    }

    const rolesMap = await getCurrentRoles();

    const currentUserRoleObj = rolesMap ? rolesMap.find((r) => {
        return r.id === currentUser.role
    }) : null;

    if (currentUserRoleObj == null) {
        console.log("No user role found")
        return;
    }
    const currentUserRole = currentUserRoleObj.description;
    const rolePermissionsMap = await getCurrentPermissions();

    // Check if the currentUserRole exists in rolePermissions mapping
    const currentUserPermissions = rolePermissionsMap ? rolePermissionsMap.find((rp) => rp.role === currentUserRole) : null;
    // if (rolePermissionsMap[currentUserRole]) {
    if (currentUserPermissions) {
        // Check if the action exists for the currentUserRole
        // if (currentUserPermissions.permissions.includes(action)) {
        //     return true; // User has permission to perform the action
        // }
        currentUserPermissions.permissions.map((up) => {
            const permissionsArray = Object.values(up);
            if (permissionsArray.includes(action)) {
                return true;
            }
        })
    }
    return false; // User does not have permission to perform the action
};

// utility functions to check permissions in components
export const canEditProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.edit);
};

export const canCreateProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.create);
};

export const canDeleteProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.delete);
};

export const canViewProject = (currentUser) => {
    return hasPermission(currentUser, projectPermissions.view);
};



