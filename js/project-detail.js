let currentProjectId = JSON.parse(sessionStorage.getItem("idProjectDetail")) || "";
let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
let currentProject = allProjects.find(project => project.id === currentProjectId);  //current pj nay` cua' the? sua? doi? nen dung` find hop. li'
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];


let html = "";
let role = JSON.parse(sessionStorage.getItem("isLogIn")) || "";
let userLogIn = JSON.parse(sessionStorage.getItem("userLogIn")) || "";
// let emailUser = JSON.parse(sessionStorage.getItem("isLogin")) || "";

if (!currentProjectId) {
    alert("Không tìm thấy thông tin dự án!");
    location.href = '../pages/project-management/index.html';
}

if (!currentProject) {
    alert("Không tìm thấy dự án!");
    location.href = '../pages/project-management/index.html';
}

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
//LUU Y' CHI? DUNG` LAN` DAU` KHI CHUA CO' DU~ LIEU. NEU' KHONG THI` SE~ LUON MAC DINH LA` DU~ LIEU. NAY` DU` CO' LUU LEN LOCAL
// (function createDefaultTask() {
//     if (+currentProjectId === 1) {
//         let tasks = [];
//         let task = { id: 1, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Thấp", progress: "Đúng tiến độ", status: "To do" };
//         tasks.push(task);
//         task = { id: 2, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "To do" };
//         tasks.push(task);
//         task = { id: 3, taskName: "Soạn thảo đề cương dự án", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Cao", progress: "Trễ hạn", status: "To do" };
//         tasks.push(task);

//         let currentProjectIndex = allProjects.findIndex(p => p.id === +(currentProjectId));
//         if (currentProjectIndex !== -1) {
//             allProjects[currentProjectIndex].tasks = tasks;

//             tasks = [];
//             let task4 = { id: 4, taskName: "Lên lịch họp kickoff", assignedId: 1, assignedDate: "2025-02-24", dueDate: "2025-02-27", priority: "Trung bình", progress: "Có rủi ro", status: "In Progress" };
//             tasks.push(task4);
//             allProjects[currentProjectIndex].tasks = allProjects[currentProjectIndex].tasks.concat(tasks);

//             localStorage.setItem("allProjects", JSON.stringify(allProjects));
//         }
//     }
// })();     


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
                    <button class="btn btn-warning btn-sm edit-btn action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
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
                <td class="border">${assignedPerson ? findUserName(assignedPerson.userId) : 'undefined'}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning btn-sm edit-btn action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
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
                <td class="border">${assignedPerson ? findUserName(assignedPerson.userId) : 'undefined'}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning edit-btn btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
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
                <td class="border">${assignedPerson ? findUserName(assignedPerson.userId) : 'undefined'}</td>
                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                <td class="border date-column">${task.assignedDate}</td>
                <td class="border date-column">${task.dueDate}</td>
                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                <td class="border">
                    <button class="btn btn-warning edit-btn btn-sm action-btn" data-id="${task.id}"  data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
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

    if (taskName === "") {
        mistake.innerHTML = "Vui lòng nhập tên nhiệm vụ!";
        return;
    }

    if (inChargePers === "" || inChargePers === "#") {
        mistake.innerHTML = "Vui lòng chọn người phụ trách!";
        return;
    }

    if (statusQuest === "" || statusQuest === "#") {
        mistake.innerHTML = "Vui lòng chọn trạng thái!";
        return;
    }

    if (!dateStart) {
        mistake.innerHTML = "Vui lòng chọn ngày bắt đầu!";
        return;
    }

    if (!dateEnd) {
        mistake.innerHTML = "Vui lòng chọn hạn chót!";
        return;
    }

    if (priority === "" || priority === "#") {
        mistake.innerHTML = "Vui lòng chọn độ ưu tiên!";
        return;
    }

    if (progress === "" || progress === "#") {
        mistake.innerHTML = "Vui lòng chọn tiến độ!";
        return;
    }

    if (new Date(dateStart) > new Date(dateEnd)) {
        mistake.innerHTML = "Ngày bắt đầu không thể sau hạn chót!!";
        return;
    }

    let isTaskExisted = currentProject.tasks.some(task => task.taskName === taskName);

    if (isTaskExisted) {
        mistake.innerHTML = "Tên nhiệm vụ đã tồn tại!!";
    } else {
        let idProject = createIdTask();
        let idAssign = findUserId(inChargePers);
        currentProject.tasks.push({ id: idProject, taskName: taskName, assignedId: idAssign, assignedDate: dateStart, dueDate: dateEnd, priority: priority, progress: progress, status: statusQuest });
        renderTasks();
        console.log(allProjects);

        localStorage.setItem("allProjects", JSON.stringify(allProjects));

        //dieu` chinh? khi nao` lu se~ dong'
        document.getElementById("saveAddOrEdit").setAttribute("data-bs-dismiss", "modal");
        document.getElementById("saveAddOrEdit").click();
    }
}

function createIdTask() {
    if (!currentProject.tasks || currentProject.tasks.length === 0) {
        return 1;
    }

    // Tim` id lon' nhat va` tra? ve` id moi' = max + 1
    let maxId = Math.max(...currentProject.tasks.map(task => task.id));
    return maxId + 1;
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

updateInChargePers = function () {
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

function findUserName(id) {
    let userFound = accounts.find(account => account.id === id);
    // if(userFound) {
    //     let userName = userFound.fullname;
    // }
    return userFound ? userFound.fullname : "Undefined Member";
}

function findUserId(name) {
    let userFound = accounts.find(account => account.fullname === name);
    return userFound ? userFound.id : undefined;
}

function findUserIdByEmail(email) {
    let userFound = accounts.find(account => account.email === email);
    return userFound ? userFound.id : undefined;
}

findEmailOfUser = (id) => {
    let userFound = accounts.find(account => account.id === id);
    return userFound ? userFound.email : undefined;
}

function renderEmployee() {
    html = "";
    currentProject.members.forEach(mem => {
        console.log(mem);

        html += `
            <div class="mb-2 me-2 p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="member-info">
                        <div class="member-avatar">${findUserName(mem.userId).split(" ").pop().substring(0, 2)}</div>
                        <div>
                            <div>${findUserName(mem.userId)}</div>
                            <small class="text-muted">${mem.role}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += `<img src="../assets/icon/More.png" alt="more" id="watchMoreMember" data-bs-toggle="modal" data-bs-target="#detailMember">`;
    document.getElementById("member-list").innerHTML = html;
}
renderEmployee();

addEmployee = function () {
    let addEmail = document.getElementById("member-email-add").value;
    let addRole = document.getElementById("member-role-add").value;
    let mistake = document.getElementById("printMistakeMember");
    console.log(findUserIdByEmail(addEmail));


    let isEmailExisted = addEmail === "" || currentProject.members.some(member => member.userId === findUserIdByEmail(addEmail));
    console.log(isEmailExisted);
    if (isEmailExisted) {
        mistake.innerHTML = "Email đã tồn tại!!";
    } else {
        currentProject.members.push({ userId: findUserIdByEmail(addEmail), role: addRole });
        renderEmployee();
        localStorage.setItem("allProjects", JSON.stringify(allProjects));
        document.getElementById("addMemberBtn").setAttribute("data-bs-dismiss", "modal");
        document.getElementById("addMemberBtn").click();
    }
}

document.getElementById("addMemberBtn").addEventListener("click", function () {
    document.getElementById("member-email-add").value = "";
    document.getElementById("member-role-add").value = "";
    let mistake = document.getElementById("printMistakeMember");
    mistake.innerHTML = "";

    document.getElementById("saveAddMemberBtn").removeAttribute("data-bs-dismiss");
    document.getElementById("saveAddMemberBtn").removeEventListener("click", addEmployee);
    document.getElementById("saveAddMemberBtn").addEventListener("click", addEmployee);
});


document.getElementById("watchMoreMember").addEventListener("click", function () {
    html = "";
    html += `<div class="row">
                    <div class="col">
                        <p class="text-center">Thành viên</p>   
                    </div>
                    <div class="col">
                        <p class="text-center">Vai trò</p>
                    </div>
                </div>`;
    currentProject.members.forEach(mem => {
        html += `<div class="row">
                    <div class="col">
                        <div class="mb-2 me-2 p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="member-info">
                                    <div class="member-avatar">${findUserName(mem.userId).split(" ").pop().substring(0, 2)}</div>
                                    <div>
                                        <div>${findUserName(mem.userId)}</div>
                                        <small class="text-muted">${findEmailOfUser(mem.userId)}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col mb-2 me-2 p-2 d-flex justify-content-end align-items-center gap-2">
                        <div class="card">${mem.role}</div><i class="fa-solid fa-trash-can-slash" onclick="delEmployee(${mem.userId})"></i>
                    </div>
                </div>`;
    });
    document.getElementById("detailAllMember").innerHTML = html;
});

function delEmployee(id) {
    currentProject.members = currentProject.members.filter(mem => mem.userId !== id);
    renderEmployee();
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
    //kbiet sua? sao nhung phai? load lai. trang thi` modal moi' update du~ lieu.
}

//tu. dong. cap. nhap. member 
document.getElementById("addQuestBtn").addEventListener("click", function () {
    html = "";
    html += `<option value="#" disabled selected>Chọn người phụ trách</option>`;
    currentProject.members.forEach(mem => {
        html += `<option value="${findUserName(mem.userId)}">${findUserName(mem.userId)}</option>`;
    });
    document.getElementById("inChargePers").innerHTML = html;
});

//su. kien nhan' nut' xoa'
document.getElementById("table-body").addEventListener("click", function (event) {
    if (event.target.classList.contains("del-btn")) {
        // let taskId = event.target.dataset.id;
        let taskId = +(event.target.getAttribute("data-id"));
        document.getElementById("confirmDelBtn").addEventListener("click", () => {
            currentProject.tasks = currentProject.tasks.filter(task => task.id !== taskId);
            let projectIndex = allProjects.findIndex(p => p.id === currentProjectId);
            if (projectIndex !== -1) {
                allProjects[projectIndex] = currentProject;
            }

            renderTasks();
            localStorage.setItem("allProjects", JSON.stringify(allProjects));
        });
    }
});

//reset form 
document.getElementById("addQuestBtn").addEventListener("click", function () {
    document.getElementById("project-name-add").value = "";
    document.getElementById("printMistakeTask").innerHTML = "";
    document.getElementById("inChargePers").value = "";
    document.getElementById("statusQuest").value = "";
    document.getElementById("date-start").value = "";
    document.getElementById("date-end").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("progress").value = "";
});

// Sua? task
document.getElementById("table-body").addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
        let taskId = +(event.target.getAttribute("data-id"));
        let task = currentProject.tasks.find(t => t.id === taskId);

        if (task) {
            isEditing = true;

            // Điền thông tin vào form
            document.getElementById("project-name-add").value = task.taskName;
            document.getElementById("inChargePers").value = findUserName(task.assignedId);
            document.getElementById("statusQuest").value = task.status;
            document.getElementById("date-start").value = task.assignedDate;
            document.getElementById("date-end").value = task.dueDate;
            document.getElementById("priority").value = task.priority;
            document.getElementById("progress").value = task.progress;

            document.getElementById("saveAddOrEdit").setAttribute("data-id", taskId);
            document.getElementById("printMistakeTask").innerHTML = "";
        }
    }
});


function searchTask() {
    let searchInput = document.getElementById("searchTaskInput").value.toLowerCase();
    let taskRows = document.querySelectorAll('.projectToDo, .projectInProgress, .projectPending, .projectDone');

    taskRows.forEach(row => {
        const taskName = row.querySelector('td:first-child').textContent.toLowerCase();
        if (taskName.includes(searchInput)) {
            row.style.display = ''; //hien? thi. neu' khop'
        } else {
            row.style.display = 'none';
        }
    });
}

function sortTask() {
    let sortSelect = document.getElementById("sortTask").value;
    let taskRows = document.querySelectorAll('.projectToDo, .projectInProgress, .projectPending, .projectDone');

    switch (sortSelect) {
        case "progess":
            // currentProject.tasks.sort((a, b) => a.progress.localeCompare(b.progress));
            currentProject.tasks.sort((a, b) => {
                const progressOrder = { 'Đúng tiến độ': 1, 'Có rủi ro': 2, 'Trễ hạn': 3 };
                return progressOrder[a.progress] - progressOrder[b.progress];
            });
            break;
        case 'date-start':
            currentProject.tasks.sort((a, b) => new Date(a.assignedDate) - new Date(b.assignedDate));
            break;
        case 'date-end':
            currentProject.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'prioritize':
            const priorityOrder = { 'Cao': 1, 'Trung bình': 2, 'Thấp': 3 };
            currentProject.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
    }
    renderTasks();
}







document.getElementById("logOutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("userLogIn");
    sessionStorage.removeItem("idProjectDetail");
    sessionStorage.removeItem("isLogIn");

    location.href = '../pages/login.html';
});