import Header from "../components/Header";

const backgroundImage = "/backgrounds/background-05.jpg";

export default function About() {
  return (
    <>
      {/* Header */}
      <Header isShowHome={true} isShowDashboard={true} />
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4 py-12 max-w-4xl mx-auto text-white">
          <h1 className="text-3xl font-bold mb-4">About Agile Project Manager</h1>
          <p className="mb-4">
            <span className="text-blue-400 font-semibold">Agile Project Manager</span> is a comprehensive web application designed to streamline and enhance the management of agile projects. It provides a suite of tools to facilitate project planning, task management, and team collaboration, ensuring projects are delivered on time and within scope.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Key Features:</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <span className="text-green-400 font-semibold">Authentication and Authorization:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">User registration and login:</span> allows users to securely sign up and access the platform</li>
                <li><span className="text-purple-400 font-semibold">Role management for users:</span> supports administrators and team members</li>
              </ul>
            </li>
            <li>
              <span className="text-green-400 font-semibold">Project Management:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">Creation, modification, and deletion of projects:</span> manage all project details</li>
                <li><span className="text-purple-400 font-semibold">Assignment of team members to projects:</span> easily assign roles</li>
                <li><span className="text-purple-400 font-semibold">Viewing project details:</span> includes task lists and sprint planning</li>
              </ul>
            </li>
            <li>
              <span className="text-green-400 font-semibold">Project Backlog:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">Creation and management of project backlogs:</span> organize and prioritize tasks</li>
                <li><span className="text-purple-400 font-semibold">Prioritization of backlog items:</span> focus on what's important</li>
                <li><span className="text-purple-400 font-semibold">Drag-and-drop functionality:</span> for intuitive backlog management</li>
              </ul>
            </li>
            <li>
              <span className="text-green-400 font-semibold">Sprint Planning:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">Creation of sprints for projects:</span> structure your workflow</li>
                <li><span className="text-purple-400 font-semibold">Assignment of tasks to sprints:</span> allocate work efficiently</li>
                <li><span className="text-purple-400 font-semibold">Monitoring task status:</span> track progress during the sprint</li>
              </ul>
            </li>
            <li>
              <span className="text-green-400 font-semibold">Dashboard and Reports:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">Dashboard with key metrics:</span> including sprint velocity and burndown charts</li>
                <li><span className="text-purple-400 font-semibold">Generation of reports:</span> on project progress and team performance</li>
              </ul>
            </li>
            <li>
              <span className="text-green-400 font-semibold">User and Role Management:</span>
              <ul className="list-disc list-inside pl-5">
                <li><span className="text-purple-400 font-semibold">User account creation and management:</span> handle user profiles</li>
                <li><span className="text-purple-400 font-semibold">Modification of user privileges:</span> manage access rights</li>
                <li><span className="text-purple-400 font-semibold">Management of access permissions:</span> ensure security and proper access</li>
              </ul>
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">Technologies Used:</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Frontend:</h3>
            <ul className="list-disc list-inside pl-5">
              <li><span className="text-blue-400 font-semibold">React:</span> for building the user interface</li>
              <li><span className="text-blue-400 font-semibold">Redux:</span> for state management</li>
              <li><span className="text-blue-400 font-semibold">Tailwind CSS:</span> for styling and layout</li>
              <li><span className="text-blue-400 font-semibold">Material-UI:</span> for UI components and design</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 mt-4">Backend:</h3>
            <ul className="list-disc list-inside pl-5">
              <li><span className="text-blue-400 font-semibold">Node.js:</span> for the server-side runtime environment</li>
              <li><span className="text-blue-400 font-semibold">Express.js:</span> for building the web application framework</li>
              <li><span className="text-blue-400 font-semibold">MongoDB:</span> for the database, providing a flexible and scalable data storage solution</li>
              <li><span className="text-blue-400 font-semibold">JWT (JSON Web Tokens):</span> for secure authentication</li>
              <li><span className="text-blue-400 font-semibold">Mongoose:</span> for MongoDB object modeling</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 text-xs font-extralight text-slate-500 px-4">
        Images by <a href="https://www.freepik.com/free-photo/protection-concept-with-lock_22632777.htm#page=2&query=authentication&position=4&from_view=keyword&track=sph&uuid=21e2b08c-0b79-47b2-8856-f2a913cf9353" className="underline">Freepik</a>
      </div>
    </>
  )
}

