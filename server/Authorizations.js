// Authorizations.js
import bcryptjs from 'bcryptjs';

import Role from "./models/role.js"
import RolesMap from "./models/rolesMap.js";
import User from "./models/user.js";


// DB INITIALIZATION

// Init user
const initUser = async () => {
    const hashedPassword = bcryptjs.hashSync(process.env.DEFAULT_ADMIN_PWD, 10);
    
    
    // role = 0 is Admin
    // const adminRoleId = await getRoleId(0);
    // const adminUser = await User.findOne({ role: adminRoleId });
    const users = await User.find({}).populate('role');
    const adminUser = users.find((u) => u.role.roleKey === 0);

    if (adminUser == null || adminUser == undefined) {
        const adminUserData = {
            username: "admin",
            email: "agileprojectmanagerinfo@gmail.com",
            password: hashedPassword,
            role: adminRoleId
        }
        await User.create(adminUserData);
        console.log("default Admin user created")
    }
};

// Init Roles
const initRoles = async () => {
    try {
        const currRoles = await Role.findOne({});
        
        if (!currRoles || currRoles.length === 0) {
            await Role.insertMany(defaultRolesMap);
            console.log("current Roles Map initialized")
        }

    } catch (error) {
        console.log(error);
    }

};

// utility function to get roleId from roleKey
// export const getRoleId = async (roleKey) => {
//     const rolesMap = await getCurrentRoles();
//     const roleId = rolesMap.find((r) => r.roleKey === roleKey)._id;

//     return roleId;
// }

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


// GETTERS

// export const getCurrentRoles = async () => {
//     try {
//         const roles = await Role.find({});
//         return roles;
//     } catch (error) {
//         console.log(error)
//     }
// };

export const getDefaultRoles = () => {
    return defaultRolesMap;
}

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
    { roleKey: 0, roleDescription: 'Admin' },
    { roleKey: 1, roleDescription: 'Product Owner' },
    { roleKey: 2, roleDescription: 'Scrum Master' },
    { roleKey: 3, roleDescription: 'Scrum Team Member' },
    { roleKey: 4, roleDescription: 'Project Manager' }
];

const permissions = {
    project: {
        label: 'Project',
        actions: {
            create: 'projectCreate',
            edit: 'projectEdit',
            delete: 'projectDelete',
            view: 'projectView',
            allocate: 'projectAllocate'
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
    },
    {
        role: "Project Manager",
        permissions: [
            {
                project: [
                    projectPermissions.edit,
                    projectPermissions.allocate
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
];

// Function to check if the current user has permission to perform a specific action
const hasPermission = async (currentUser, action) => {
    // check if the user is Admin
    console.log("hasPermission() - currentUser = ", currentUser)
    if (currentUser.role === 0) {
        // Admin has all authorizations
        return true;
    }

    // const rolesMap = await getCurrentRoles();

    // const currentUserRoleObj = rolesMap ? rolesMap.find((r) => {
    //     return r.id === currentUser.role
    // }) : null;


    // if (currentUserRoleObj == null) {
    //     console.log("No user role found")
    //     return;
    // }
    // const currentUserRole = currentUserRoleObj.description;
    const currentUserRole = currentUser.role._id;
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
export const canEditProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.edit);
};

export const canCreateProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.create);
};

export const canDeleteProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.delete);
};

export const canViewProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.view);
};

export const canAllocateProject = async (currentUser) => {
    return await hasPermission(currentUser, projectPermissions.allocate);
};




