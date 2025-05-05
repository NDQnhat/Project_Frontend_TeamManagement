let currentProjectId = JSON.parse(sessionStorage.getItem("idProjectDetail")) || "";
let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
let currentProject = allProjects.find(project => project.id === currentProjectId);  //current pj nay` cua' the? sua? doi? nen dung` find hop. li'
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
// let isAvatarSet = JSON.parse(sessionStorage.getItem("isAvatarSet")) || false;


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

currentProject.members.forEach(mem => {
    mem.avatarUrl = findAvatarOfUser(mem.userId);
});
localStorage.setItem("allProjects", JSON.stringify(allProjects));

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
                <a href="../index.html" class="text-white me-3 text-decoration-none"><i class="fa-solid fa-circle-user"></i></a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    }
}

createHeader();

document.getElementById("nameOfProject").innerHTML = currentProject.projectName;
document.getElementById("descriptionProject").innerHTML = currentProject.description;


currentProject.tasks ? currentProject.tasks : [];

console.log(currentProject);

let statusTasks = ["To do", "In Progress", "Pending", "Done"];
function renderTasks() {
    html = "";

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

    if (currentProject.tasks.length === 0) {
        html += `<tr>
                    <td colspan="7" class="text-center">Không có nhiệm vụ nào</td>
                </tr>`;
    } else {
        statusTasks.forEach(status => {
            html += `<tr id="${status.replace(/\s+/g, "-")}" data-status="${status.replace(/\s+/g, "-")}">
                        <td colspan="7" class="fw-bold text-start">
                            <button class="btn btn-link text-dark p-0 text-decoration-none">
                                <span class="collapse-icon" id="icon-${status.replace(/\s+/g, "-")}">▼</span>${status}
                            </button>
                        </td>
                    </tr>`;

            // Loc. status cung` trang. thai'
            const tasksWithStatus = currentProject.tasks.filter(task => task.status.toLowerCase() === status.toLowerCase());

            if (tasksWithStatus.length === 0) {
                html += `<tr class="${status.replace(/\s+/g, "-")}">
                            <td colspan="7" class="text-center">Không có nhiệm vụ</td>
                        </tr>`;
            } else {
                tasksWithStatus.forEach(task => {
                    let assignedPerson = currentProject.members.find(member => member.userId === task.assignedId);
                    html += `<tr class="${status.replace(/\s+/g, "-")}">
                                <td class="border text-start">${task.taskName}</td>
                                <td class="border">${assignedPerson ? findUserName(assignedPerson.userId) : 'undefined'}</td>
                                <td class="border"><span class="badge status-badge ${getPriorityClassStyle(task)}">${task.priority}</span></td>
                                <td class="border date-column">${task.assignedDate}</td>
                                <td class="border date-column">${task.dueDate}</td>
                                <td class="border"><span class="badge ${getProgressClassStyle(task)}">${task.progress}</span></td>
                                <td class="border">
                                    <button class="btn btn-warning btn-sm edit-btn action-btn" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#addQuest">Sửa</button>
                                    <button data-id="${task.id}" class="btn btn-danger btn-sm action-btn del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel">Xóa</button>
                                </td>
                            </tr>`;
                });
            }
        });
        document.getElementById("table-body").innerHTML = html;

        statusTasks.forEach(status => {
            const statusId = status.replace(/\s+/g, "-");
            document.getElementById(statusId).addEventListener("click", function (event) {
                document.querySelectorAll(`.${statusId}`).forEach(function (task) {
                    task.classList.toggle("hidden-tasks");
                });

                const icon = this.querySelector(".collapse-icon");
                if (icon) {
                    icon.textContent = icon.textContent === "▼" ? "▶" : "▼";
                }
            });
        });
    }
}

renderTasks();



let isEditing = false;
let editingProjectId = null;

// tao. ham` handle de? loai. bo? nhieu` event listener
function handleSaveButton() {
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

    if (isTaskExisted && !isEditing) {
        mistake.innerHTML = "Tên nhiệm vụ đã tồn tại!!";
        return;
    }

    if (isEditing) {
        // let taskIndex = currentProject.tasks.findIndex(task => task.taskName === taskName);
        let found = currentProject.tasks.find(task => task.id === editingProjectId);
        if (found) {
            let isTaskExisted = currentProject.tasks.some(task =>
                task.taskName === taskName && task.id !== editingProjectId
            );

            if (isTaskExisted) {
                mistake.innerHTML = "Tên nhiệm vụ đã tồn tại!!";
                return;
            }

            found.taskName = taskName;
            found.assignedId = findUserId(inChargePers);
            found.assignedDate = dateStart;
            found.dueDate = dateEnd;
            found.priority = priority;
            found.progress = progress;
            found.status = statusQuest;

            renderTasks();
            // console.log(allProjects);

            localStorage.setItem("allProjects", JSON.stringify(allProjects));
            document.getElementById("saveAddOrEdit").setAttribute("data-bs-dismiss", "modal");
            document.getElementById("saveAddOrEdit").click();
        }
    } else {
        let isTaskExisted = currentProject.tasks.some(task => task.taskName === taskName);
        if (isTaskExisted) {
            mistake.innerHTML = "Tên nhiệm vụ đã tồn tại!!";
            return;
        }

        let idProject = createIdTask();
        let idAssign = findUserId(inChargePers);
        currentProject.tasks.push({ id: idProject, taskName: taskName, assignedId: idAssign, assignedDate: dateStart, dueDate: dateEnd, priority: priority, progress: progress, status: statusQuest });
        renderTasks();
        // console.log(allProjects);

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

// console.log(currentProject);


updateInChargePers = function () {
    html = "";
    html += `<option value="#" disabled selected>Chọn người phụ trách</option>`;
    currentProject.members.forEach(mem => {
        let userName = findUserName(mem.userId);
        // if (userName === "Undefined Member") {
        //     console.warn(`Không tìm thấy thành viên với ID: ${mem.userId}`);
        // }
        html += `<option value="${userName}">${userName}</option>`;
    });
    document.getElementById("inChargePers").innerHTML = html;
};

function findUserName(id) {
    let userFound = accounts.find(account => account.id === id);
    // if(userFound) {
    //     let userName = userFound.fullname;
    // }
    // console.log("userFound", userFound);
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

function findAvatarOfUser(id) {
    let userFound = accounts.find(account => account.id === id);
    return userFound ? userFound.avatarUrl : undefined;
}

function renderEmployee() {

    html = ``;
    console.log("arr",currentProject.members);
    currentProject.members.forEach(mem => {
      
        // console.log(mem.avatarUrl);
        if (mem.avatarUrl === "") {
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
                </div>`;
        } else {
                html += `
                    <div class="mb-2 me-2 p-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="member-info">
                                <img src="${mem.avatarUrl}" alt="avatar" class="member-avatar">
                                <div>
                                    <div>${findUserName(mem.userId)}</div>
                                    <small class="text-muted">${mem.role}</small>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }
    });
    html += `<img src="../assets/icon/More.png" alt="more" id="watchMoreMember" data-bs-toggle="modal" data-bs-target="#detailMember">`;
    document.getElementById("member-list").innerHTML = html;
}
renderEmployee();

addEmployee = function () {
    let addEmail = document.getElementById("member-email-add").value;
    let addRole = document.getElementById("member-role-add").value;
    let mistake = document.getElementById("printMistakeMember");
    // console.log(findUserIdByEmail(addEmail));

    if (userLogIn.toLowerCase() === "admin") {
        addRole = "Project owner";
        let isProjectOwnerSet = currentProject.members.some(member => member.role === "Project owner");
        if (isProjectOwnerSet) {
            alert("Bạn đã cấp Project owner cho gnười dùng khác!!");
            return;
        }
    } else {
        addRole = "Member";
        // console.log("addRole", addRole);    
    }


    let isEmailExisted = addEmail === "" || currentProject.members.some(member => member.userId === findUserIdByEmail(addEmail));
    // console.log(isEmailExisted);
    if (isEmailExisted) {
        mistake.innerHTML = "Email đã tồn tại!!";
    } else {
        currentProject.members.push({ userId: findUserIdByEmail(addEmail), role: addRole });
        renderEmployee();
        updateDetailMemberModal();
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

    html = "";
    html += `<option value="#" disabled selected>Chọn email</option>`;
    accounts.forEach(account => {
        html += `<option value="${account.email}">${account.email}</option>`;
    });
    document.getElementById("member-email-add").innerHTML = html;

    document.getElementById("saveAddMemberBtn").removeAttribute("data-bs-dismiss");
    document.getElementById("saveAddMemberBtn").removeEventListener("click", addEmployee);
    document.getElementById("saveAddMemberBtn").addEventListener("click", addEmployee);
});

//tach' ham` rieng ra thay vi` cho vao` event listener do cach' kia phai? load lai. trang moi' cap. nhat. member trong modal
function updateDetailMemberModal() {
    let html = "";
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
}

document.getElementById("watchMoreMember").addEventListener("click", function () {
    updateDetailMemberModal();
});

function delEmployee(id) {
    currentProject.members = currentProject.members.filter(mem => mem.userId !== id);
    renderEmployee();
    updateDetailMemberModal();
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
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
    updateInChargePers();

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
        isEditing = true;
        editingProjectId = +(event.target.getAttribute("data-id"));
        let task = currentProject.tasks.find(t => t.id === editingProjectId);

        if (task) {
            isEditing = true;
            updateInChargePers();
            document.getElementById("printMistakeTask").innerHTML = "";

            // set up thong tin task hien. tai. cho form
            document.getElementById("project-name-add").value = task.taskName;
            document.getElementById("inChargePers").value = findUserName(task.assignedId);
            document.getElementById("statusQuest").value = task.status;
            document.getElementById("date-start").value = task.assignedDate;
            document.getElementById("date-end").value = task.dueDate;
            document.getElementById("priority").value = task.priority;
            document.getElementById("progress").value = task.progress;

            document.getElementById("saveAddOrEdit").removeEventListener("click", handleSaveButton);
            document.getElementById("saveAddOrEdit").addEventListener("click", handleSaveButton);
        }
    }
});


function searchTask() {
    let searchInput = document.getElementById("searchTaskInput").value.toLowerCase();
    let taskRows = document.querySelectorAll(".To-do, .In-Progress, .Pending, .Done");

    taskRows.forEach(row => {
        const taskName = row.querySelector('td:first-child').textContent.toLowerCase();
        // console.log(taskName);

        if (taskName.includes(searchInput)) {
            row.style.display = ''; //hien? thi. neu' khop'
        } else {
            row.style.display = 'none';
        }
    });
}

function sortTask() {
    let sortSelect = document.getElementById("sortTask").value;
    let taskRows = document.querySelectorAll(".To-do, .In-Progress, .Pending, .Done");

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