import mongoose from 'mongoose';

import bcryptjs from 'bcryptjs';

import User from "../server/models/user.js";
import Role from '../server/models/role.js';
import Project from '../server/models/project.js';
import Sprint from '../server/models/sprint.js';
import BacklogItem from '../server/models/backlogItem.js';
import Task from '../server/models/task.js';
import Assignment from '../server/models/assignment.js';

// default roles
const defaultRolesMap = [
    { roleKey: 0, roleDescription: 'Admin' },
    { roleKey: 1, roleDescription: 'Product Owner' },
    { roleKey: 2, roleDescription: 'Scrum Master' },
    { roleKey: 3, roleDescription: 'Scrum Team Member' },
    { roleKey: 4, roleDescription: 'Project Manager' }
];

const defaultUsersMap = [
    { username: 'admin', email: 'admin@mail.com', password: 'password', roleKey: 0 },
    { username: 'john', email: 'john@mail.com', password: 'password', roleKey: 1 },
    { username: 'kate', email: 'kate@mail.com', password: 'password', roleKey: 2 },
    { username: 'peter', email: 'peter@mail.com', password: 'password', roleKey: 3 },
    { username: 'jane', email: 'jane@mail.com', password: 'password', roleKey: 4 }
];

const defaultPassword = 'password';


// Connect to MongoDB
mongoose.connect('mongodb+srv://gianmarioiamoni:GiaMongoDB21__@agile-pm.6debvvl.mongodb.net/agile-pm?retryWrites=true&w=majority&appName=agile-pm', { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Project.deleteMany({});
    await Sprint.deleteMany({});
    await BacklogItem.deleteMany({});
    await Task.deleteMany({});
    await Assignment.deleteMany({});

    // Create Roles
    const roles = defaultRolesMap.map(role => new Role({ ...role, isDefault: true }));
    console.log(roles);
    // const memberRole = new Role({ roleKey: 1, roleDescription: 'Member', isDefault: true });
    for (let role of roles) {
        await role.save();
    }
    // const adminRole = new Role({ roleKey: 0, roleDescription: 'Admin', isDefault: false });
    // const memberRole = new Role({ roleKey: 1, roleDescription: 'Member', isDefault: false });
    // await adminRole.save();
    // await memberRole.save();

    // Create Users
    // const users = [
    //     new User({ username: 'john', email: 'john@example.com', password: bcryptjs.hashSync(defaultPassword, 10)', role: memberRole._id }),
    //     new User({ username: 'jane', email: 'jane@example.com', password: 'password', role: memberRole._id }),
    //     new User({ username: 'jim', email: 'jim@example.com', password: 'password', role: memberRole._id })
    // ];

    // create users
    const users = defaultUsersMap.map(user => new User({ ...user, password: bcryptjs.hashSync(defaultPassword, 10), role: roles.find(role => role.roleKey === user.roleKey)._id }));
    for (let user of users) {
        await user.save();
    }

    // Create a Project
    const project = new Project({ name: 'Agile Project Manager', description: 'A project management tool for agile teams.' });
    await project.save();

    // Assign Users to Project
    const assignments = users.map(user => {
        return new Assignment({ userId: user._id, projectId: project._id, roleId: user.role });
    });
    for (let assignment of assignments) {
        await assignment.save();
    }

    // Create Sprints
    const sprints = [
        new Sprint({ name: 'Sprint 1', projectId: project._id, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), goal: 'Complete initial setup' }),
        new Sprint({ name: 'Sprint 2', projectId: project._id, startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), goal: 'Develop core features' }),
        new Sprint({ name: 'Sprint 3', projectId: project._id, startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), goal: 'Polish and refine' })
    ];
    for (let sprint of sprints) {
        await sprint.save();
    }

    // Create Backlog Items and Tasks
    for (let sprint of sprints) {
        const backlogItems = [
            new BacklogItem({ projectId: project._id, title: 'Setup Project', description: 'Setup initial project structure', priority: 1, points: 5, sprint: sprint._id }),
            new BacklogItem({ projectId: project._id, title: 'Develop Login', description: 'Develop user login functionality', priority: 2, points: 8, sprint: sprint._id }),
            new BacklogItem({ projectId: project._id, title: 'Create Dashboard', description: 'Create project dashboard', priority: 3, points: 13, sprint: sprint._id })
        ];
        for (let backlogItem of backlogItems) {
            await backlogItem.save();
            const tasks = [
                new Task({ title: 'Task 1', description: 'Initial task setup', backlogItemId: backlogItem._id, projectId: project._id, status: 'To Do', points: 2, assignee: users[1]._id }),
                new Task({ title: 'Task 2', description: 'Continue development', backlogItemId: backlogItem._id, projectId: project._id, status: 'In Progress', points: 3, assignee: users[2]._id }),
                new Task({ title: 'Task 3', description: 'Complete development', backlogItemId: backlogItem._id, projectId: project._id, status: 'Done', points: 4, assignee: users[3]._id })
            ];
            for (let task of tasks) {
                await task.save();
            }
        }
    }

    console.log('Database seeded!');
    mongoose.connection.close();
};

// Run the seed function
seedDatabase().catch(err => console.error(err));
