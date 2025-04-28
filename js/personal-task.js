let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
let html = "";
let emailLogin = JSON.parse(sessionStorage.getItem("isLogIn")) || "";
let role = JSON.parse(sessionStorage.getItem("userLogIn")) || "";
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let accountId;
let tasksOfUser = [];
// console.log(allProjects[0].tasks);
// console.log(allProjects[0].tasks[0].assignedId);
// console.log(findUserIdByEmail(emailLogin));

// tasksOfUser = allProjects.filter(project => project.tasks.some(task => task.assignedId === findUserIdByEmail(emailLogin)));
allProjects.forEach(project => {
    // tasksOfUser = project.tasks.filter(task => task.assignedId === findUserIdByEmail(emailLogin));
    let temp = project.tasks.filter(task => task.assignedId === findUserIdByEmail(emailLogin));
    tasksOfUser.push(temp.length ? temp : []);
});
// tasksOfUser = tasksOfUser.flat();
tasksOfUser = tasksOfUser.filter(task => task.length > 0);
console.log(tasksOfUser);



//copy code
function findUserIdByEmail(email) {
    let userFound = accounts.find(account => account.email === email);
    return userFound ? userFound.id : undefined;
}

function findProjectName(taskId) {
    let projectFound = allProjects.find(project => project.tasks.some(task => task.id === taskId));
    return projectFound ? projectFound.projectName : undefined;
};

function createHeader() {
    let header = document.getElementById("header");
    if (role === "admin") {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="../pages/project-management.html" class="text-white me-3 text-decoration-none">Dự Án</a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    } else if (role === "Project owner") {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="../pages/project-management.html" class="text-white me-3 text-decoration-none">Dự Án</a>
                <a href="../pages/personal-task.html" class="text-white me-3 text-decoration-none">Nhiệm Vụ của tôi</a>
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

getProgressClassStyle = (task) => {
    let progressClass = "";
    let progressText = task.progress.toLowerCase();
    switch (progressText) {
        case "đúng tiến độ": progressClass = "bg-success"; break;
        case "có rủi ro": progressClass = "bg-warning text-dark"; break;
        case "trễ hạn": progressClass = "bg-danger"; break;
        default: progressClass = "bg-secondary";
    }
    return progressClass;
};

getPriorityClassStyle = (task) => {
    let priorityClass = "";
    let priorityText = task.priority.toLowerCase();
    switch (priorityText) {
        case "thấp": priorityClass = "bg-info"; break;
        case "trung bình": priorityClass = "bg-warning"; break;
        case "cao": priorityClass = "bg-danger"; break;
        default: priorityClass = "bg-secondary";
    }
    return priorityClass;
}

let temp = []; //bien' luu id

function renderYourTask() {
    html = "";
    if (tasksOfUser.length === 0) {
        html += `<tr>
                    <td colspan="6" class="text-center">Không có nhiệm vụ nào</td>
                </tr>`;
    } else {
        tasksOfUser.forEach(tasks => {
            tasks.forEach(task => {
                // console.log(findProjectName(task.id).toLowerCase().replace(/\s+/g, "-"));
                temp.push(findProjectName(task.id).toLowerCase().replace(/\s+/g, "-"));
                html += `
                <tr id='${findProjectName(task.id).toLowerCase().replace(/\s+/g, "-")}'>
                    <td colspan="6">
                        <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                            <span class="collapse-icon">▼</span> ${findProjectName(task.id)}
                        </button>
                    </td>
                </tr>`;
            });
        });
        document.getElementById("table-body").innerHTML = html;

        temp.forEach(id => {
            tasksOfUser.forEach(tasks => {
                tasks.forEach(task => {
                    
                });
            });
        });
    }
}
renderYourTask();

// temp.forEach(id => {
//     document.getElementById(id).addEventListener("click", function (event) {
//         event.target.classList.toggle("hidden-tasks");

//         let icon = event.target.querySelector(".collapse-icon");
//         if (icon.textContent === "▼") {
//             icon.textContent = "▶";
//         } else {
//             icon.textContent = "▼";
//         }
//     });
// });