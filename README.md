# Agile Project Manager

**Agile Project Manager** is a comprehensive web application designed to streamline and enhance the management of agile projects. It provides a suite of tools to facilitate project planning, task management, and team collaboration, ensuring projects are delivered on time and within scope.

## Technologies Used

### Frontend:
- **React**: for building the user interface
- **Redux**: for state management
- **Tailwind CSS**: for styling and layout
- **Material-UI**: for UI components and design

### Backend:
- **Node.js**: for the server-side runtime environment
- **Express.js**: for building the web application framework
- **MongoDB**: for the database, providing a flexible and scalable data storage solution
- **JWT (JSON Web Tokens)**: for secure authentication
- **Mongoose**: for MongoDB object modeling

## Features

- **Authentication and Authorization**
- **Project Management**
- **Project Backlog**
- **Sprint Planning**
- **Dashboard and Reports**
- **User and Role Management**

## Detailed Feature Description

### Authentication and Authorization

- **User Registration and Login**: 
  - Secure registration and login processes for users.
  - Passwords are hashed for security.
  - JWT tokens are used to maintain sessions.

- **Role Management for Users**: 
  - Admins can assign roles to users.
  - Different roles have different permissions, such as accessing admin functions or managing projects.

### Project Management

- **Creation, Modification, and Deletion of Projects**: 
  - Admins and authorized users can create new projects.
  - Projects can be updated with new information or requirements.
  - Projects can be deleted if they are no longer needed.

- **Assignment of Team Members to Projects**: 
  - Admins can assign team members to specific projects based on their roles and responsibilities.
  - Team members receive notifications about their assignments.

- **Viewing Project Details**: 
  - Users can view comprehensive details about each project, including the list of tasks, deadlines, and sprint plans.

### Project Backlog

- **Creation and Management of Project Backlogs**: 
  - Users can create backlog items for tasks that need to be completed.
  - Backlog items can be edited or deleted as required.

- **Prioritization of Backlog Items**: 
  - Users can set priorities for each backlog item to ensure important tasks are addressed first.
  - High-priority items are highlighted for better visibility.

- **Drag-and-Drop Functionality**: 
  - Intuitive drag-and-drop interface for managing backlog items.
  - Users can easily rearrange items to reflect changing priorities.

### Sprint Planning

- **Creation of Sprints for Projects**: 
  - Users can create sprints, defining the duration and goals for each sprint.
  - Sprints help in organizing work into manageable chunks.

- **Assignment of Tasks to Sprints**: 
  - Tasks from the backlog can be assigned to specific sprints.
  - This ensures that work is planned and executed in a structured manner.

- **Monitoring Task Status**: 
  - Users can track the status of tasks within each sprint.
  - Tasks can be marked as **To Do**, **In Progress**, or **Done**.

### Dashboard and Reports

- **Dashboard with Key Metrics**: 
  - The dashboard provides an overview of project metrics such as sprint velocity, task completion rate, and burndown charts.
  - Users can quickly assess the health and progress of their projects.

- **Generation of Reports**: 
  - Detailed reports on project progress and team performance can be generated.
  - Reports include metrics like task completion times, sprint success rates, and individual performance assessments.

### User and Role Management

- **User Account Creation and Management**: 
  - Admins can create and manage user accounts.
  - Users can update their profiles and change passwords.

- **Modification of User Privileges**: 
  - Admins can modify user privileges to grant or restrict access to certain features.
  - Privileges can be customized based on the user's role and responsibilities.

- **Management of Access Permissions**: 
  - Admins can manage access permissions for various parts of the application.
  - Ensures that sensitive information is accessible only to authorized users.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/agile-project-manager.git

