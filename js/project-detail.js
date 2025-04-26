let currentProjectId = JSON.parse(sessionStorage.getItem("idProjectDetail")) || "";
let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
let currentProject = allProjects.find(project => project.id === currentProjectId);  //current pj nay` cua' the? sua? doi? nen dung` find hop. li'


let html = "";
let role = JSON.parse(sessionStorage.getItem("isLogIn")) || "";
let userLogIn = JSON.parse(sessionStorage.getItem("userLogIn")) || "";
// let emailUser = JSON.parse(sessionStorage.getItem("isLogin")) || "";

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


//su? li' nhan' nut mui~ ten
document.getElementById("projectToDo").addEventListener("click", function (event) {
    // event.target.classList.toggle("rotate-icon");
    // document.querySelectorAll(".projectToDo").classList.toggle("hidden-tasks"); tra? ve` 1 list nen phai? dung` vong` lap.
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

//set up 1 vai` task mac. dinh. cho pj
(function createDefaultTask() {
    if (+(currentProjectId === 1)) {
        let tasks = [];
        let task = { id: 1, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Thấp", progress: "Đúng tiến độ", status: "To do" };
        tasks.push(task);
        task = { id: 2, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "To do" };
        tasks.push(task);
        task = { id: 3, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Cao", progress: "Trễ hạn", status: "To do" };
        tasks.push(task);

        let currentProjectIndex = allProjects.findIndex(p => p.id === +(currentProjectId));
        if (currentProjectIndex !== -1) {
            allProjects[currentProjectIndex].tasks = tasks;

            tasks = [];
            let task4 = { id: 4, taskName: "Lên lịch họp kickoff", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "In Progress" };
            tasks.push(task4);
            allProjects[currentProjectIndex].tasks = allProjects[currentProjectIndex].tasks.concat(tasks);

            localStorage.setItem("allProjects", JSON.stringify(allProjects));
        }
    }
})();


renderTasks = () => {
    html = "";
    let members = currentProject.members || [];

    //dung` cach' nay` nen moi~ lan` lay' ra phair reset lai. du~ lieu. trong table khong se~ gap' doi DL moi~ lan` goi.
    document.querySelectorAll(".projectToDo").forEach(element => element.remove());
    document.querySelectorAll(".projectInProgress").forEach(element => element.remove());
    document.querySelectorAll(".projectPending").forEach(element => element.remove());
    document.querySelectorAll(".projectDone").forEach(element => element.remove());

    //tao. ham` lay' ra class mau` nen` cho tien' do.
    let getProgressClassStyle = (task) => {
        let progressClass = "";
        let progressText = task.progress.toLowerCase();
        switch (progressText) {
            case "đúng tiến độ": progressClass = "bg-success"; break;
            case "có rủi ro": progressClass = "bg-warning text-dark"; break;
            case "trễ hạn": progressClass = "bg-danger"; break;
            default: progressClass = "bg-secondary";
        }
        return progressClass;
    }

    //ham` lay' ra class mau` nen` cho uu tien
    let getPriorityClassStyle = (task) => {
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

    let todoTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "to do");
    let inProgressTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "in progress");
    let pendingTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "pending");
    let doneTasks = currentProject.tasks.filter(task => task.status.toLowerCase() === "done");

    let projectToDo = document.getElementById("projectToDo");
    todoTasks.forEach(task => {
        let assignedPerson = members.find(member => member.id === task.assignedId);
        // <td class="border">${findUserName(assignedPerson.userId)}</td>
        // <td class="border">${assignedPerson}</td>
        html += `
            <tr class="projectToDo">
                <td class="border text-start">${task.taskName}</td>
                <td class="border">${assignedPerson ? findUserName(assignedPerson.userId) : 'undefined'}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
                </td>
            </tr>
        `;
    });
    projectToDo.insertAdjacentHTML("afterend", html);

    let projectInProgress = document.getElementById("projectInProgress");
    html = "";
    inProgressTasks.forEach(task => {
        let assignedPerson = members.find(member => member.id === task.assignedId);
        html += `
            <tr class="projectInProgress">
                <td class="border text-start">${task.taskName}</td>
                <td class="border">${assignedPerson}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
                </td>
            </tr>
        `;
    });
    projectInProgress.insertAdjacentHTML("afterend", html);

    let projectPending = document.getElementById("projectPending");
    html = "";
    pendingTasks.forEach(task => {
        let assignedPerson = members.find(member => member.id === task.assignedId);
        html += `
            <tr class="projectPending">
                <td class="border text-start">${task.taskName}</td>
                <td class="border">${assignedPerson}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
                </td>
            </tr>
        `;
    });
    projectPending.insertAdjacentHTML("afterend", html);

    let projectDone = document.getElementById("projectDone");
    html = "";
    doneTasks.forEach(task => {
        let assignedPerson = members.find(member => member.id === task.assignedId);
        html += `
            <tr class="projectDone">
                <td class="border text-start">${task.taskName}</td>
                <td class="border">${assignedPerson}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
                </td>
            </tr>
        `;
    });
    projectDone.insertAdjacentHTML("afterend", html);
};
renderTasks();

let isEditing = true;

// tao. ham` handle de? loai. bo? nhieu` event listener
function handleSaveButton(event) {
    document.getElementById("saveAddOrEdit").removeAttribute("data-bs-dismiss");

    let mistake = document.getElementById("printMistakeTask");
    let taskName = document.getElementById("project-name-add").value;
    let inChargePers = document.getElementById("inChargePers").value;
    let statusQuest = document.getElementById("statusQuest").value;
    let dateStart = document.getElementById("date-start").value;
    let dateEnd = document.getElementById("date-end").value;
    let priority = document.getElementById("priority").value;
    let progress = document.getElementById("progress").value;

    console.log(currentProject);
    let isTaskExisted = currentProject.tasks.some(task => task.taskName === taskName || taskName === "");

    if (isTaskExisted) {
        mistake.innerHTML = "Tên nhiệm vụ đã tồn tại!!";
    } else {
        let idProject = currentProject.tasks.length + 1;
        let idAssign = findUserId(inChargePers);
        currentProject.tasks.push({ id: idProject, taskName: taskName, assignedId: idAssign, assignedDate: dateStart, dueDate: dateEnd, priority: priority, progress: progress, status: statusQuest });
        renderTasks();
        localStorage.setItem("allProjects", JSON.stringify(allProjects));

        //dieu` chinh? khi nao` lu se~ dong'
        document.getElementById("saveAddOrEdit").setAttribute("data-bs-dismiss", "modal");
        document.getElementById("saveAddOrEdit").click();
    }
}
document.getElementById("addQuestBtn").addEventListener("click", () => {
    let mistake = document.getElementById("printMistakeTask");
    mistake.innerHTML = "";
    isEditing = false;
    document.getElementById("saveAddOrEdit").removeAttribute("data-bs-dismiss");

    document.getElementById("saveAddOrEdit").removeEventListener("click", handleSaveButton);
    document.getElementById("saveAddOrEdit").addEventListener("click", handleSaveButton);
});

console.log(currentProject);

updateInChargePers = function() {
    html = "";
    html += `<option value="#" disabled selected>Chọn người phụ trách</option>`;
    // let inChargePers = document.getElementById("inChargePers");
    currentProject.members.forEach(mem => {
        html += `
            <option value="${findUserName(mem.userId)}">${findUserName(mem.userId)}</option>
        `;
    });
    document.getElementById("inChargePers").innerHTML = html;
}

let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
function findUserName(id) {
    let userFound = accounts.find(account => account.id === id);
    // if(userFound) {
    //     let userName = userFound.fullname;
    // }
    return userFound ? userFound.fullname : "No One";
}

function findUserId(name) {
    let userFound = accounts.find(account => account.fullname === name);
    return userFound ? userFound.id : undefined;
}