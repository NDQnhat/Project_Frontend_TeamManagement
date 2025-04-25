let currentProjectId = JSON.parse(sessionStorage.getItem("idProjectDetail")) || "";
let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
let currentProject = allProjects.find(project => project.id === currentProjectId);  //current pj nay` cua' the? sua? doi? nen dung` find hop. li'


let html = "";
let role = JSON.parse(sessionStorage.getItem("isLogIn")) || "";
let userLogIn = JSON.parse(sessionStorage.getItem("userLogIn")) || "";

if (role !== "admin") {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    //email la` doc. nhat' nen khong lo trung`
    let currentAccount = accounts.find(account => account.email === role);
    if (!currentAccount) {
        location.href = '../pages/login.html';
    }
};

function createHeader() {
    let header = document.getElementById("header");
    if (role === "admin" || role === "Project owner") {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="../pages/project-management" class="text-white me-3 text-decoration-none">Dự Án</a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    } else {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="../pages/personal-task.html" class="text-white me-3 text-decoration-none">Nhiệm Vụ của tôi</a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    }
}

createHeader();

document.getElementById("nameOfProject").innerHTML = currentProject.projectName;
document.getElementById("descriptionProject").innerHTML = currentProject.description;


// //su? li' nhan' nut mui~ ten
// document.getElementById("projectToDo").addEventListener("click", function(event) {
//     // event.target.classList.toggle("rotate-icon");
//     // document.querySelectorAll(".projectToDo").classList.toggle("hidden-tasks"); tra? ve` 1 list nen phai? dung` vong` lap.
//     document.querySelectorAll(".projectToDo").forEach(function(element) {
//         element.classList.toggle("hidden-tasks");
//     });
// });
// document.getElementById("projectInProgress").addEventListener("click", function() {
//     document.querySelectorAll(".projectInProgress").forEach(function(element) {
//         element.classList.toggle("hidden-tasks");
//     });
// });
// document.getElementById("projectPending").addEventListener("click", function() {
//     document.querySelectorAll(".projectPending").forEach(function(element) {
//         element.classList.toggle("hidden-tasks");
//     });
// });
// document.getElementById("projectDone").addEventListener("click", function () {
//     document.querySelectorAll(".projectDone").forEach(function (element) {
//         element.classList.toggle("hidden-tasks");
//     });
// });

//set up 1 vai` task mac. dinh. cho pj
(function createDefaultTask() {
    if (+(currentProjectId === 1)) {
        let tasks = [];
        let task = { id: 1, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Thấp", progress: "Đúng tiến độ", status: "To do" };
        tasks.push(task);
        task = { id: 2, taskName: "Soạn thảo đề cương dự án", assignedId: 2, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "To do" };
        tasks.push(task);
        task = { id: 3, taskName: "Soạn thảo đề cương dự án", assignedId: 3, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Cao", progress: "Trễ hạn", status: "To do" };
        tasks.push(task);

        let currentProjectIndex = allProjects.findIndex(p => p.id === +(currentProjectId));
        if (currentProjectIndex !== -1) {
            allProjects[currentProjectIndex].tasks = tasks;

            tasks = [];
            let task4 = { id: 4, taskName: "Lên lịch họp kickoff", assignedId: 4, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "In Progress" };
            tasks.push(task4);
            allProjects[currentProjectIndex].tasks = allProjects[currentProjectIndex].tasks.concat(tasks);

            localStorage.setItem("allProjects", JSON.stringify(allProjects));
        }
    }
})();

// (function renderTasks() {
//     let todoTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "to do");
//     let inProgressTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "in progress");
//     let pendingTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "pending");
//     let doneTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "done");

//     let members = currentProject.members || [];

//     // khoi? tao. tung` hang` trong html
//     const generateTaskRow = (task, statusClass) => {
//         let priorityClass = "";
//         switch (task.priority.toLowerCase()) {
//             case "thấp": priorityClass = "bg-info"; break;
//             case "trung bình": priorityClass = "bg-warning"; break;
//             case "cao": priorityClass = "bg-danger"; break;
//             default: priorityClass = "bg-secondary";
//         }

//         let progressClass = "";
//         let progressText = task.progress;
//         switch (task.progress.toLowerCase()) {
//             case "đúng tiến độ": progressClass = "bg-success"; break;
//             case "có rủi ro": progressClass = "bg-warning text-dark"; break;
//             case "trễ hạn": progressClass = "bg-danger"; break;
//             default: progressClass = "bg-secondary";
//         }

//         const formatDate = (dateString) => {
//             if (!dateString) return "";
//             const date = new Date(dateString);
//             return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
//         };

//         const assignedPerson = members.find(member => member.id === task.assignedId);
//         const assignedName = assignedPerson ? assignedPerson.name : "An Nguyễn"; // gan' mac. dinh. nu' khong thay'

//         return `
//             <tr class="${statusClass}">
//                 <td class="border text-start">${task.taskName}</td>
//                 <td class="border">${assignedName}</td>
//                 <td class="border"><span class="badge status-badge ${priorityClass}">${task.priority}</span></td>
//                 <td class="border date-column">${formatDate(task.assignedDate)}</td>
//                 <td class="border date-column">${formatDate(task.dueDate)}</td>
//                 <td class="border"><span class="badge ${progressClass}">${progressText}</span></td>
//                 <td class="border">
//                     <button class="btn btn-warning btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#addQuest" data-task-id="${task.id}">Sửa</button>
//                     <button class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel" data-task-id="${task.id}">Xóa</button>
//                 </td>
//             </tr>
//         `;
//     };

//     let todoHtml = "";
//     todoTasks.forEach(task => {
//         todoHtml += generateTaskRow(task, "projectToDo");
//     });

//     let inProgressHtml = "";
//     inProgressTasks.forEach(task => {
//         inProgressHtml += generateTaskRow(task, "projectInProgress");
//     });

//     let pendingHtml = "";
//     pendingTasks.forEach(task => {
//         pendingHtml += generateTaskRow(task, "projectPending");
//     });

//     let doneHtml = "";
//     doneTasks.forEach(task => {
//         doneHtml += generateTaskRow(task, "projectDone");
//     });

//     // tao. cau' truc cho table
//     document.getElementById("table-body").innerHTML = `
//         <tr id="projectToDo">
//             <td colspan="7" class="fw-bold text-start">
//                 <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
//                     <span class="collapse-icon">▼</span>To Do
//                 </button> 
//             </td>
//         </tr>
//         ${todoHtml}
//         <tr id="projectInProgress">
//             <td colspan="7" class="fw-bold text-start">
//                 <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
//                     <span class="collapse-icon">▼</span>In Progress
//                 </button> 
//             </td>
//         </tr>
//         ${inProgressHtml}
//         <tr id="projectPending">
//             <td colspan="7" class="fw-bold text-start">
//                 <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
//                     <span class="collapse-icon">▼</span>Pending
//                 </button> 
//             </td>
//         </tr>
//         ${pendingHtml}
//         <tr id="projectDone">
//             <td colspan="7" class="fw-bold text-start">
//                 <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
//                     <span class="collapse-icon">▼</span>Done
//                 </button> 
//             </td>
//         </tr>
//         ${doneHtml}`;

//     //su? li' nhan' nut mui~ ten
//     document.getElementById("projectToDo").addEventListener("click", function (event) {
//         // event.target.classList.toggle("rotate-icon");
//         // document.querySelectorAll(".projectToDo").classList.toggle("hidden-tasks"); tra? ve` 1 list nen phai? dung` vong` lap.
//         document.querySelectorAll(".projectToDo").forEach(function (element) {
//             element.classList.toggle("hidden-tasks");
//         });
//     });
//     document.getElementById("projectInProgress").addEventListener("click", function () {
//         document.querySelectorAll(".projectInProgress").forEach(function (element) {
//             element.classList.toggle("hidden-tasks");
//         });
//     });
//     document.getElementById("projectPending").addEventListener("click", function () {
//         document.querySelectorAll(".projectPending").forEach(function (element) {
//             element.classList.toggle("hidden-tasks");
//         });
//     });
//     document.getElementById("projectDone").addEventListener("click", function () {
//         document.querySelectorAll(".projectDone").forEach(function (element) {
//             element.classList.toggle("hidden-tasks");
//         });
//     });    
// })();

renderTasks = () => {
    // First, find the current project data
    let currentProjectId = JSON.parse(sessionStorage.getItem("idProjectDetail")) || "";
    let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    let currentProject = allProjects.find(project => project.id === currentProjectId);

    if (!currentProject || !currentProject.tasks) {
        return; // Exit if no project or tasks found
    }

    // Group tasks by status
    let todoTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "to do");
    let inProgressTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "in progress");
    let pendingTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "pending");
    let doneTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "done");

    // Get all members for task assignment info
    let members = currentProject.members || [];

    // Function to generate task row HTML
    const generateTaskRow = (task, statusClass) => {
        // Convert priority to appropriate badge class
        let priorityClass = "";
        switch (task.priority.toLowerCase()) {
            case "thấp": priorityClass = "bg-info"; break;
            case "trung bình": priorityClass = "bg-warning"; break;
            case "cao": priorityClass = "bg-danger"; break;
            default: priorityClass = "bg-secondary";
        }

        // Convert progress to appropriate badge class
        let progressClass = "";
        let progressText = task.progress;
        switch (task.progress.toLowerCase()) {
            case "đúng tiến độ": progressClass = "bg-success"; break;
            case "có rủi ro": progressClass = "bg-warning text-dark"; break;
            case "trễ hạn": progressClass = "bg-danger"; break;
            default: progressClass = "bg-secondary";
        }

        // Format dates (assuming format YYYY-MM-DD to MM-DD)
        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        };

        // Find assigned person's name
        const assignedPerson = members.find(member => member.id === task.assignedId);
        const assignedName = assignedPerson ? assignedPerson.name : "An Nguyễn"; // Default to An Nguyễn if not found

        return `
            <tr class="${statusClass}">
                <td class="border text-start">${task.taskName}</td>
                <td class="border">${assignedName}</td>
                <td class="border"><span class="badge status-badge ${priorityClass}">${task.priority}</span></td>
                <td class="border date-column">${formatDate(task.assignedDate)}</td>
                <td class="border date-column">${formatDate(task.dueDate)}</td>
                <td class="border"><span class="badge ${progressClass}">${progressText}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#addQuest" data-task-id="${task.id}">Sửa</button>
                    <button class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel" data-task-id="${task.id}">Xóa</button>
                </td>
            </tr>
        `;
    };

    // Render To Do tasks
    let todoHtml = "";
    todoTasks.forEach(task => {
        todoHtml += generateTaskRow(task, "projectToDo");
    });

    // Render In Progress tasks
    let inProgressHtml = "";
    inProgressTasks.forEach(task => {
        inProgressHtml += generateTaskRow(task, "projectInProgress");
    });

    // Render Pending tasks
    let pendingHtml = "";
    pendingTasks.forEach(task => {
        pendingHtml += generateTaskRow(task, "projectPending");
    });

    // Render Done tasks
    let doneHtml = "";
    doneTasks.forEach(task => {
        doneHtml += generateTaskRow(task, "projectDone");
    });

    // Insert tasks into the table
    const tableBody = document.getElementById("table-body");

    // Create the table structure with collapsible sections
    tableBody.innerHTML = `
        <tr id="projectToDo">
            <td colspan="7" class="fw-bold text-start">
                <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                    <span class="collapse-icon">▼</span>To Do
                </button> 
            </td>
        </tr>
        ${todoHtml}
        <tr id="projectInProgress">
            <td colspan="7" class="fw-bold text-start">
                <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                    <span class="collapse-icon">▼</span>In Progress
                </button> 
            </td>
        </tr>
        ${inProgressHtml}
        <tr id="projectPending">
            <td colspan="7" class="fw-bold text-start">
                <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                    <span class="collapse-icon">▼</span>Pending
                </button> 
            </td>
        </tr>
        ${pendingHtml}
        <tr id="projectDone">
            <td colspan="7" class="fw-bold text-start">
                <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                    <span class="collapse-icon">▼</span>Done
                </button> 
            </td>
        </tr>
        ${doneHtml}
    `;

    // Re-attach event listeners for collapsible sections
    document.getElementById("projectToDo").addEventListener("click", function () {
        document.querySelectorAll(".projectToDo").forEach(function (element) {
            element.classList.toggle("hidden-tasks");
        });
    });

    document.getElementById("projectInProgress").addEventListener("click", function () {
        document.querySelectorAll(".projectInProgress").forEach(function (element) {
            element.classList.toggle("hidden-tasks");
        });
    });

    document.getElementById("projectPending").addEventListener("click", function () {
        document.querySelectorAll(".projectPending").forEach(function (element) {
            element.classList.toggle("hidden-tasks");
        });
    });

    document.getElementById("projectDone").addEventListener("click", function () {
        document.querySelectorAll(".projectDone").forEach(function (element) {
            element.classList.toggle("hidden-tasks");
        });
    });
};

// Call the function to render tasks when the page loads
document.addEventListener("DOMContentLoaded", renderTasks);