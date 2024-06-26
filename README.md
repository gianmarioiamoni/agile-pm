# Agile Project Manager

**<span style="color: #2d3748;">Agile Project Manager</span>** is a comprehensive web application designed to streamline and enhance the management of agile projects. It provides a suite of tools to facilitate project planning, task management, and team collaboration, ensuring projects are delivered on time and within scope.

![01 - Home Page](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/50bfefb5-8489-4486-a138-346b5b2f8ec6)


## Technologies

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

  ![02 - signup](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/af7c2949-e594-4216-a621-61cfdf8b20e0)

  ![03 - signin](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/001f3181-50a6-4be5-8944-368df56ff7fd)


- **<span style="color: #805ad5;">Role Management for Users</span>**: 
  - admins can assign roles to users
  - different roles have different permissions, such as accessing admin functions or managing projects


### Project Management

- **<span style="color: #805ad5;">Creation, Modification, and Deletion of Projects</span>**: 
  - admins and authorized users can create new projects
  - projects can be updated with new information or requirements
  - projects can be deleted if they are no longer needed

  ![04 - Create New Project](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/114d8965-27fb-4369-92ea-72745a03185a)

  ![04a - Create New Project](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/fad54ebd-e160-4472-ac60-6f86228c7b87)

  ![04b - Edit Project](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/59e9724a-c43d-432e-a571-724ea4bed99d)

  ![04c - Delete Project](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/d08f7b26-0b4d-42e5-b593-a1b173f86a79)


- **<span style="color: #805ad5;">Assignment of Team Members to Projects</span>**: 
  - admins can assign team members to specific projects based on their roles and responsibilities
  - team members receive notifications about their assignments

  ![05a - Resources assignment](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/d85c1304-3495-451f-b415-e5d88b94272f)

  ![05b - Resources assignment](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/d2b28cfd-1849-45ce-ae96-07d812b507f4)

  ![05c - Resorces assignment](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/5724a3c0-f85e-49eb-b5fd-6385113428a5)


- **<span style="color: #805ad5;">Viewing Project Details</span>**: 
  - users can view comprehensive details about each project, including the list of tasks, deadlines, and sprint plans



### Project Backlog

 ![08 - Backlog](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/adb72aba-6119-43ca-8ef3-bb58ee4b1191)


- **<span style="color: #805ad5;">Creation and Management of Project Backlogs</span>**: 
  - users can create backlog items for tasks that need to be completed
  - backlog items can be edited or deleted as required

  ![09 - Backlog - add new item](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/b3ffe782-db51-49f9-8e77-4c60e286bd2e)


  ![10 - Backlog - edit item](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/9bdffd65-a0cc-46ca-9889-e1f5340e0301)



- **<span style="color: #805ad5;">Prioritization of Backlog Items</span>**: 
  - users can set priorities for each backlog item to ensure important tasks are addressed first
  - high-priority items are highlighted for better visibility

  ![11 - Backlog - change item priority](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/b459b4be-ffb0-425d-b081-fd17d2b7314b)


- **<span style="color: #805ad5;">Drag-and-Drop Functionality</span>**: 
  - intuitive drag-and-drop interface for managing backlog items
  - users can easily rearrange items to reflect changing priorities

### Sprint Planning

![12 - Sprint management](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/01be7762-f976-438e-970d-ff7e51910955)


- **<span style="color: #805ad5;">Creation of Sprints for Projects</span>**: 
  - users can create sprints, defining the duration and goals for each sprint
  - sprints help in organizing work into manageable chunks

![13   Sprint Management - create sprint](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/cf5f93ff-5490-4482-aff6-f6e4d7860b3f)

![13a - Sprint Management - create sprint](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/a31391ae-d823-4160-8b89-dfe9bdc5fcd3)


- **<span style="color: #805ad5;">Assignment of Tasks to Sprints</span>**: 
  - tasks from the backlog can be assigned to specific sprints
  - this ensures that work is planned and executed in a structured manner

- **<span style="color: #805ad5;">Monitoring Task Status</span>**: 
  - users can track the status of tasks within each sprint
  - tasks can be marked as **To Do**, **In Progress**, or **Done**

  ![15 - Tasks management](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/46089cbe-af00-4e91-8434-0f2a7453f68a)


  - **<span style="color: #805ad5;">Assignment of Resources to Tasks</span>**: 
  - resources can be assigned to specific tasks

  ![16 - Tasks management - resources](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/74c079a4-ecb4-496e-b186-d57ea87b0a07)


### Project Dashboard and Reports

![17 - Project Dashboard](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/62de4952-30bf-4c46-adba-e40e50a28bed)


- **<span style="color: #805ad5;">Project Details and status</span>**: 
  - the dashboard provides an overview of project information and status of sprints and tasks

![17a - Project Dashboard - Backlog](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/ae4e28d7-60b9-47bd-9cfa-d5b25dad6d9c)

![18 - Dashboard - sprints backlog](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/9a146f52-f513-4901-a862-40b3cb6b40af)

![Scrum Board 01](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/778ecb72-4aa2-4f1b-8630-635f12abd12f)

![Scrum Board 02](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/0b3de00a-95fd-420b-b036-b87e745d2dc8)


- **<span style="color: #805ad5;">Dashboard with Key Metrics</span>**: 
  - the dashboard provides an overview of project metrics such as sprint velocity, task completion rate, and burndown charts
  - users can quickly assess the health and progress of their projects

  ![Sprints Velocity](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/a88e8975-4315-42f9-8552-9e473e76a589)

  ![Project Progress Report](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/53885831-317c-4988-8bae-79b0070fc42d)

  ![Burndown Chart](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/344ad2f8-b110-4219-9483-cd6cf2696f92)


- **<span style="color: #805ad5;">Generation of Reports</span>**: 
  - detailed reports on project progress and team performance can be generated
  - reports include metrics like task completion times, sprint success rates, and individual performance assessments

 ![23 - Project Dashboard - team performance](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/de024312-3889-4f75-95c1-35ae0b2bdf28)

  
### User and Role Management

![30 - User and Permission Management](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/f6bb28cc-3587-42bc-9100-1cbeaa1c8ff8)

- **<span style="color: #805ad5;">User Account Creation and Management</span>**: 
  - admins can create and manage user accounts
  - new created user is notified by email about the login details
  - users can update their profiles and change passwords

  ![31 - Add New User](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/7e10579c-a215-411a-8e63-1e56173cf67b)

  ![31a - Add NewUser](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/81afb093-e634-4ec0-8a18-cc819ede7ab4)

  ![32 - User profile](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/7124c691-af2c-41dc-8060-aa0c44dd29d4)


- **<span style="color: #805ad5;">Modification of User Privileges</span>**: 
  - admins can modify user privileges to grant or restrict access to certain features
  - privileges can be customized based on the user's role and responsibilities

- **<span style="color: #805ad5;">Advanced Roles Management</span>**: 
  - admins can manage access permissions for various parts of the application
  - ensures that sensitive information is accessible only to authorized users
 
  ![33 - role management](https://github.com/gianmarioiamoni/agile-pm/assets/113024091/6a48e284-0700-4fc4-a4d7-113985d80d73)


## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/agile-project-manager.git
