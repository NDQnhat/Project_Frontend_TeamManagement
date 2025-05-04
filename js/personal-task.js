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
// allProjects.forEach(project => {
//     // tasksOfUser = project.tasks.filter(task => task.assignedId === findUserIdByEmail(emailLogin));
//     let temp = project.tasks.filter(task => task.assignedId === findUserIdByEmail(emailLogin));
//     tasksOfUser.push(temp.length ? temp : []);
// });
// tasksOfUser = tasksOfUser.flat();
// tasksOfUser = tasksOfUser.filter(task => task.length > 0);
// console.log(tasksOfUser);

let _tasksOfUser = allProjects.filter(project => project.tasks.some(task => task.assignedId === findUserIdByEmail(emailLogin)));
console.log(_tasksOfUser);



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
    } else {
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

function renderYourTask(yourOwnTasks = _tasksOfUser) {
    html = "";

    if (yourOwnTasks.length === 0) {
        html = `<tr>
                    <td colspan="6" class="text-center">Không có nhiệm vụ nào</td>
                </tr>`;
    } else {
        yourOwnTasks.forEach(project => {
            let classId = `${project.projectName}-${project.id}`;
            classId = classId.replace(/\s+/g, "-");
            html += `<tr id='${classId}' class="project-row">
                        <td colspan="6">
                            <button class="collapsible btn btn-link text-dark p-0 text-decoration-none">
                                <span class="collapse-icon" data-id="${classId}">▼</span> ${project.projectName}
                            </button>
                        </td>
                    </tr>`;
            project.tasks.forEach(task => {
                if (task.assignedId === findUserIdByEmail(emailLogin)) {
                    html += `<tr class="task-row ${classId}">
                                <td class="text-start border">${task.taskName}</td>
                                <td class="border">
                                    <span class="badge ${getPriorityClassStyle(task)} rounded-pill priority">${task.priority}</span>
                                </td>
                                <td class="border">
                                    ${task.status} <i class="fa-light fa-pen-to-square edit-btn" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#confirmUpdate"></i>
                                </td>
                                <td class="border">${task.assignedDate}</td>
                                <td class="border">${task.dueDate}</td>
                                <td class="border">
                                    <span class="badge ${getProgressClassStyle(task)} rounded-pill">${task.progress}</span>
                                </td>
                            </tr>`;
                }
            });
        });
    }
    document.getElementById("table-body").innerHTML = html;

    yourOwnTasks.forEach(project => {
        let projectId = `${project.projectName}-${project.id}`;
        projectId = projectId.replace(/\s+/g, "-");
        document.getElementById(projectId).addEventListener("click", function (event) {
            console.log(projectId);
            document.querySelectorAll(`.${projectId}`).forEach(function (task) {
                task.classList.toggle("hidden-tasks");
            });

            let icon = this.querySelector(".collapse-icon");
            if (icon) {
                icon.textContent = icon.textContent === "▼" ? "▶" : "▼";
            }
        });
    });
}

renderYourTask();

    // temp.forEach(id => {
    //     document.getElementById(id).addEventListener("click", function (event) {
    //         // let className = `.${id}`;
    //         document.querySelectorAll(`.${id}`).forEach(function (task) {
    //             task.classList.toggle("hidden-tasks");

    //             let icon = event.target.querySelector(".collapse-icon");
    //             if (icon.textContent === "▼") {
    //                 icon.textContent = "▶";
    //             } else {
    //                 icon.textContent = "▼";
    //             }
    //         });
    //     });
    // });

    let transferStatusArray = ["To Do", "In Progress", "Pending", "Done"];

    function transferStatus(task) {
        let currentStatus = task.status;
        let index = transferStatusArray.indexOf(currentStatus);

        // Tăng index lên 1, nếu đã là trạng thái cuối cùng thì quay lại đầu
        let nextIndex = (index + 1) % transferStatusArray.length;
        task.status = transferStatusArray[nextIndex];
        return task.status;
    }

    // document.getElementById("confirmUpdate").addEventListener("click", function (event) {
    //     let task = event.target.closest(".task-row");
    //     let status = transferStatus(task);
    //     task.querySelector(".status").textContent = status;
    // });

    document.getElementById("table-body").addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            document.getElementById("confirmUpdateBtn").addEventListener("click", function () {
                // let taskId = event.target.dataset.id;
                let taskId = event.target.getAttribute("data-id");
                // console.log(taskId);

                // event.target.closest(".task-row").querySelector(".status").textContent = status;
                // event.target.parentElement.querySelector(".status").textContent = status;
                // let task = null;
                // let projectIndex = -1;
                // let taskIndex = -1;

                // for (let i = 0; i < allProjects.length; i++) {
                //     let taskFound = allProjects[i].tasks.findIndex(t => t.id === taskId);
                //     if (taskFound !== -1) {
                //         task = allProjects[i].tasks[taskFound];
                //         projectIndex = i;
                //         taskIndex = taskFound;
                //         break;
                //     }
                // }
                let projectContainTask = allProjects.find(project => project.tasks.find(task => task.id === +taskId));
                // console.log(task);
                if (projectContainTask) {
                    let task = projectContainTask.tasks.find(task => task.id === +taskId);
                    // console.log(task);
                    let newStatus = transferStatus(task);
                    task.status = newStatus;
                    localStorage.setItem("allProjects", JSON.stringify(allProjects));
                    let statusElement = event.target.parentElement;
                    statusElement.innerHTML = `${newStatus} <i class="fa-light fa-pen-to-square edit-btn" data-id="${taskId}" data-bs-toggle="modal" data-bs-target="#confirmUpdate"></i>`;

                }
            });
        }
    });

    function sortTask() {
        let sortSelect = document.getElementById("sortTask").value;
        // let taskRows = document.querySelectorAll('.task-row');
        let taskRows = Array.from(document.querySelectorAll('.task-row'));

        switch (sortSelect) {
            case "name":
                taskRows.sort((a, b) => a.querySelector(".task-name").textContent.localeCompare(b.querySelector(".task-name").textContent));
                break;
            case "date-start":
                taskRows.sort((a, b) => new Date(a.querySelector(".date-column").textContent) - new Date(b.querySelector(".date-column").textContent));
                break;
            case "date-end":
                taskRows.sort((a, b) => new Date(b.querySelector(".date-column").textContent) - new Date(a.querySelector(".date-column").textContent));
                break;
            case "priority":
                // taskRows.sort((a, b) => a.querySelector(".priority").textContent.localeCompare(b.querySelector(".priority").textContent));
                let priorityMap = { "Cao": 1, "Trung bình": 2, "Thấp": 3 };
                taskRows.sort((a, b) => priorityMap[a.querySelector(".priority").textContent] - priorityMap[b.querySelector(".priority").textContent]);
                break;
        }
        let tableBody = document.getElementById("table-body");
        taskRows.forEach(row => tableBody.appendChild(row));
    }


    document.getElementById("searchTask").addEventListener("input", function () {
        let searchValue = this.value.toLowerCase();
        let taskRows = Array.from(document.querySelectorAll('.task-row'));
        taskRows.forEach(row => {
            let taskName = row.querySelector(".task-name").textContent.toLowerCase();
            if (taskName.includes(searchValue)) {
                row.classList.remove("hidden-tasks");
            } else {
                row.classList.add("hidden-tasks");
            }
        });
    });




    document.getElementById("logOutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("userLogIn");
        sessionStorage.removeItem("idProjectDetail");
        sessionStorage.removeItem("isLogIn");

        location.href = '../pages/login.html';
    });