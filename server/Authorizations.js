// Authorizations.js
import bcryptjs from 'bcryptjs';

import Role from "./models/role.js";
import RolesMap from "./models/rolesMap.js";
import User from "./models/user.js";


// DB INITIALIZATION

// Init user
const initUser = async () => {
    const hashedPassword = bcryptjs.hashSync(process.env.DEFAULT_ADMIN_PWD, 10);
    const adminUserData = {
        username: "admin",
        email: "agileprojectmanagerinfo@gmail.com",
        password: hashedPassword,
        role: 0
    }
    
    // role = 0 is Admin
    const adminUser = await User.findOne({ role: 0 });

    if (adminUser == null || adminUser == undefined) {
        console.log("default Admin user created")
        await User.create(adminUserData);
    }
};

// Init Roles
const initRoles = async () => {
    try {
        const defaultRolesData = {
            name: 'default',
            roles: defaultRolesMap,
        };

        const currentRolesData = {
            name: 'current',
            roles: defaultRolesMap,
        };

        const defRoles = await Role.findOne({ name: "default" });
        const currRoles = await Role.find({ name: "current" });

        if (defRoles == null || defRoles == undefined) {
            await Role.create(defaultRolesData);
            console.log("default Roles Map created");
            if (currRoles) {
                await Role.deleteOne({ name: "current" });
            }
            await Role.create(currentRolesData);
            console.log("default Roles Map copied in current Roles Map")
            return;
        }

        if (!currRoles) {
            await Role.create(currentRolesData);
            console.log("current Roles Map restore as default")
        }

    } catch (error) {
        console.log(error);
    }

};

// Init RolePermissionsMap
const initRolePermissions = async () => {

    try {
        const defaultRolePermissionsData = {
            name: 'default',
            roles: [...defaultRolePermissionsMap],
        };

        const currentRolePermissionsData = {
            name: 'current',
            roles: [ ...defaultRolePermissionsMap ],
        };

        const defRolePermissionsMap = await RolesMap.findOne({ name: "default" });
        const currRolePermissionsMap = await RolesMap.findOne({ name: "current" });

        if (defRolePermissionsMap == null || defRolePermissionsMap == undefined) {
            await RolesMap.create(defaultRolePermissionsData);
            console.log("default Role-Permissions Map created");
            if (currRolePermissionsMap) {
                await RolesMap.deleteOne({ name: "current" });
            }
            await RolesMap.create(currentRolePermissionsData);
            console.log("default Role-Permissions Map copied in current Roles Map")
            return;
        }

        if (!currRolePermissionsMap) {
            await RolesMap.create(currentRolePermissionsData);
            console.log("current Role-Permissions Map restore as default")
        }
        
    } catch (error) {
        console.log(error);
    }
};

export const initDB = async () => {
    await initUser();
    await initRoles();
    await initRolePermissions();
};


// GETTERS - internal usage

const getCurrentRoles = async () => {
    try {
        const name = "current";
        const roles = await Role.find({ name });
        return roles;
    } catch (error) {
        console.log(error)
    }
};

const getCurrentRolesMap = async () => {
    try {
        const name = "current";
        const rolePermissionsMap = await RolesMap.findOne({ name });
        if (!rolePermissionsMap) {
            await initRolePermissions();
            rolePermissionsMap = await RolesMap.findOne({ name });
        }
        return rolePermissionsMap.permissions;
    } catch (error) {
       console.log(error);
    }
};

// DEFAULT CONFIGURATIONS
const defaultRolesMap = [
    { id: 0, description: 'Admin' },
    { id: 1, description: 'Product Owner' },
    { id: 2, description: 'Scrum Master' },
    { id: 3, description: 'Scrum Team Member' }
];

const permissions = {
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
    },
    task: {
        label: 'task',
        actions: {
            view: 'taskView',
            assign: 'taskAssign'
        }
    },
    collaboration: {
        label: 'collaboration',
        actions: {
            collaborate: 'collaborationCollaborate',
        }
    },
};

// shortcuts to access permissions
const projectPermissions = permissions.project.actions;
const projectPermissionsLabel = permissions.project.label;

const sprintPermissions = permissions.sprint.actions;
const sprintPermissionsLabel = permissions.sprint.label;

const backlogPermissions = permissions.backlog.actions;
const backlogPermissionsLabel = permissions.backlog.label;

const agilePermissions = permissions.agile.actions;
const agilePermissionsLabel = permissions.agile.label;

const obstaclePermissions = permissions.obstacle.actions;
const obstaclePermissionsLabel = permissions.obstacle.label;

const taskPermissions = permissions.task.actions;
const taskPermissionsLabel = permissions.task.label;

const collaborationPermissions = permissions.collaboration.actions;
const collaborationPermissionsLabel = permissions.collaboration.label;


//  Permissions Label and Value mapping 
export const permissionsLabelValueArray = [
    { label: projectPermissionsLabel, permissions: projectPermissions },
    { label: sprintPermissionsLabel, permissions: sprintPermissions },
    { label: backlogPermissionsLabel, permissions: backlogPermissions },
    { label: agilePermissionsLabel, permissions: agilePermissions },
    { label: obstaclePermissionsLabel, permissions: obstaclePermissions },
    { label: taskPermissionsLabel, permissions: taskPermissions },
    { label: collaborationPermissionsLabel, permissions: collaborationPermissions },
];


//  mapping between user roles and associated permissions 
// API call for rolePermissionsMap
export const defaultRolePermissionsMap = [
    {
        role: "Product Owner",
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
        role: "Scrum Master",
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
    },
    {
        role: "Scrum Team Member",
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
            },
            {
                task: [
                    taskPermissions.view,
                    taskPermissions.assign
                ]
            },
            {
                collaboration: [
                    collaborationPermissions.collaborate,
                ]
            }
        ]
    }
];

// Function to check if the current user has permission to perform a specific action
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
    const rolePermissionsMap = await getCurrentRolesMap();

    // Check if the currentUserRole exists in rolePermissions mapping
    const currentUserPermissions = rolePermissionsMap ? rolePermissionsMap.find((rp) => rp.role === currentUserRole) : null;
    if (currentUserPermissions) {
        // Check if the action exists for the currentUserRole
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




