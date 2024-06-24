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
    { username: 'jane', email: 'jane@mail.com', password: 'password', roleKey: 4 },
    { username: 'Caterine', email: 'caterine@mail.com', password: 'password', roleKey: 3 }
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
        new Sprint({ name: 'Sprint 1', projectId: project._id, startDate: new Date(Date.now() + (-3) * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), goal: 'Complete initial setup' }),
        new Sprint({ name: 'Sprint 2', projectId: project._id, startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), goal: 'Develop core features' }),
        new Sprint({ name: 'Sprint 3', projectId: project._id, startDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), goal: 'Polish and refine' }),
        new Sprint({ name: 'Sprint 4', projectId: project._id, startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), goal: 'Deploy to production' })
    ];
    for (let sprint of sprints) {
        await sprint.save();
    }

    // Create Backlog Items
    const backlogItems = [
        new BacklogItem({ projectId: project._id, title: 'Setup Project', description: 'Setup initial project structure', priority: 1, points: 6, sprint: sprints[0]._id }),
        new BacklogItem({ projectId: project._id, title: 'Develop Login', description: 'Develop user login functionality', priority: 2, points: 6, sprint: sprints[1]._id }),
        new BacklogItem({ projectId: project._id, title: 'Create Dashboard', description: 'Create project dashboard', priority: 3, points: 6, sprint: sprints[2]._id }),
        new BacklogItem({ projectId: project._id, title: 'Deployment Configuration', description: 'Prepare for deployment', priority: 4, points: 6, sprint: sprints[3]._id })
    ];

    // assign items to sprints
    for (let i = 0; i < sprints.length; i++) {
        sprints[i].items = [backlogItems[i]._id];
        sprints[i].save();
    }

    // create tasks    
    for (let backlogItem of backlogItems) {
        
        const tasks = [
            new Task({ title: 'Task 1', description: 'Initial task setup', backlogItemId: backlogItem._id, projectId: project._id, status: 'To Do', points: 1, assignee: users[1]._id }),
            new Task({ title: 'Task 2', description: 'Continue development', backlogItemId: backlogItem._id, projectId: project._id, status: 'In Progress', points: 2, assignee: users[2]._id }),
            new Task({ title: 'Task 3', description: 'Complete development', backlogItemId: backlogItem._id, projectId: project._id, status: 'Done', points: 3, assignee: users[3]._id })
        ];
        backlogItem.tasks = tasks.map(task => task._id); 

        await backlogItem.save();
        
        for (let task of tasks) {
            await task.save();
        }
    }

    console.log('Database seeded!');
    mongoose.connection.close();
};

// Run the seed function
seedDatabase().catch(err => console.error(err));
