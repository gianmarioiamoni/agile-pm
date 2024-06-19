# Agile Project Manager

**<span style="color: #2d3748;">Agile Project Manager</span>** is a comprehensive web application designed to streamline and enhance the management of agile projects. It provides a suite of tools to facilitate project planning, task management, and team collaboration, ensuring projects are delivered on time and within scope.

![alt text](<01 - Home page.png>)


## Technologies Used

### Frontend:
- **<span style="color: #3182ce;">React</span>**: for building the user interface
- **<span style="color: #3182ce;">Redux</span>**: for state management
- **<span style="color: #3182ce;">Tailwind CSS</span>**: for styling and layout
- **<span style="color: #3182ce;">Material-UI</span>**: for UI components and design

### Backend:
- **<span style="color: #38a169;">Node.js</span>**: for the server-side runtime environment
- **<span style="color: #38a169;">Express.js</span>**: for building the web application framework
- **<span style="color: #38a169;">MongoDB</span>**: for the database, providing a flexible and scalable data storage solution
- **<span style="color: #38a169;">JWT (JSON Web Tokens)</span>**: for secure authentication
- **<span style="color: #38a169;">Mongoose</span>**: for MongoDB object modeling

## Features

- **<span style="color: #805ad5;">Authentication and Authorization</span>**
- **<span style="color: #805ad5;">Project Management</span>**
- **<span style="color: #805ad5;">Project Backlog</span>**
- **<span style="color: #805ad5;">Sprint Planning</span>**
- **<span style="color: #805ad5;">Dashboard and Reports</span>**
- **<span style="color: #805ad5;">User and Role Management</span>**

## Detailed Feature Description

### Authentication and Authorization

- **<span style="color: #805ad5;">User Registration and Login</span>**: 
  - secure registration request via email and login processes for users
  - passwords are hashed for security
  - JWT tokens are used to maintain sessions

  ![alt text](<02 - signup.png>)

  ![alt text](<03 - signin.png>)


- **<span style="color: #805ad5;">Role Management for Users</span>**: 
  - admins can assign roles to users
  - different roles have different permissions, such as accessing admin functions or managing projects



### Project Management

- **<span style="color: #805ad5;">Creation, Modification, and Deletion of Projects</span>**: 
  - admins and authorized users can create new projects
  - projects can be updated with new information or requirements
  - projects can be deleted if they are no longer needed

  ![alt text](<04 - create project.png>)

  ![alt text](<05 - edit project.png>)

  ![alt text](<06 - delete project.png>)


- **<span style="color: #805ad5;">Assignment of Team Members to Projects</span>**: 
  - admins can assign team members to specific projects based on their roles and responsibilities
  - team members receive notifications about their assignments

  ![alt text](<07 - Resources assignment.png>)

  ![alt text](<06 - Resources assignment.png>)

  ![alt text](<05 - Resorces assignment.png>)


- **<span style="color: #805ad5;">Viewing Project Details</span>**: 
  - users can view comprehensive details about each project, including the list of tasks, deadlines, and sprint plans



### Project Backlog

 ![alt text](<08 - Backlog.png>)

- **<span style="color: #805ad5;">Creation and Management of Project Backlogs</span>**: 
  - users can create backlog items for tasks that need to be completed
  - backlog items can be edited or deleted as required

  ![alt text](<10 - Backlog - edit item.png>)


- **<span style="color: #805ad5;">Prioritization of Backlog Items</span>**: 
  - users can set priorities for each backlog item to ensure important tasks are addressed first
  - high-priority items are highlighted for better visibility

  ![alt text](<11 - Backlog - change item priority.png>)


- **<span style="color: #805ad5;">Drag-and-Drop Functionality</span>**: 
  - intuitive drag-and-drop interface for managing backlog items
  - users can easily rearrange items to reflect changing priorities

### Sprint Planning

![alt text](<12 - Sprint management.png>)

- **<span style="color: #805ad5;">Creation of Sprints for Projects</span>**: 
  - users can create sprints, defining the duration and goals for each sprint
  - sprints help in organizing work into manageable chunks

![alt text](<13 . Sprint Management - create sprint.png>)

![alt text](<14 - Sprint Management - create sprint 2.png>)


- **<span style="color: #805ad5;">Assignment of Tasks to Sprints</span>**: 
  - tasks from the backlog can be assigned to specific sprints
  - this ensures that work is planned and executed in a structured manner

- **<span style="color: #805ad5;">Monitoring Task Status</span>**: 
  - users can track the status of tasks within each sprint
  - tasks can be marked as **To Do**, **In Progress**, or **Done**

  ![alt text](<15 - Tasks management.png>)

  - **<span style="color: #805ad5;">Assignment of Resources to Tasks</span>**: 
  - resources can be assigned to specific tasks

  ![alt text](<16 - Tasks management - resources.png>)


### Project Dashboard and Reports

![alt text](<17 - Project Dashboard.png>)

- **<span style="color: #805ad5;">Project Details and status</span>**: 
  - the dashboard provides an overview of project information and status of sprints and tasks

![alt text](<17a - Project Dashboard - Backlog.png>)

![alt text](<18 - Dashboard - sprints backlog.png>)

![alt text](<19 - Scrum Board-1.png>)


- **<span style="color: #805ad5;">Dashboard with Key Metrics</span>**: 
  - the dashboard provides an overview of project metrics such as sprint velocity, task completion rate, and burndown charts
  - users can quickly assess the health and progress of their projects

  ![alt text](<21 - Project Dashboard - sprint velocity.png>)


- **<span style="color: #805ad5;">Generation of Reports</span>**: 
  - detailed reports on project progress and team performance can be generated
  - reports include metrics like task completion times, sprint success rates, and individual performance assessments

  ![alt text](<23 - Project Dashboard - team performance.png>)
  

### User and Role Management

- **<span style="color: #805ad5;">User Account Creation and Management</span>**: 
  - admins can create and manage user accounts
  - users can update their profiles and change passwords

- **<span style="color: #805ad5;">Modification of User Privileges</span>**: 
  - admins can modify user privileges to grant or restrict access to certain features
  - privileges can be customized based on the user's role and responsibilities

- **<span style="color: #805ad5;">Management of Access Permissions</span>**: 
  - admins can manage access permissions for various parts of the application
  - ensures that sensitive information is accessible only to authorized users

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/agile-project-manager.git

