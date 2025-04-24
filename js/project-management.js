let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [
    { id: 1, projectName: "Xây dựng website thương mại điện tử", members: [{ userId: 1, role: "Project owner" }, { userId: 2, role: "Frontend developer" }], description: "Dự án nhằm phát triển một nền tảng thương mại điện tử với các tính năng như giỏ hàng, thanh toán và quản lý sản phẩm." },
    { id: 2, projectName: "Phát triển ứng dụng di động", members: [], description: "" },
    { id: 3, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "" },
    { id: 4, projectName: "Xây dựng website thương mại điện tử", members: [], description: "" },
    { id: 5, projectName: "Phát triển ứng dụng di động", members: [], description: "" },
    { id: 6, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "" },
    { id: 7, projectName: "Xây dựng website thương mại điện tử", members: [], description: "" },
    { id: 8, projectName: "Phát triển ứng dụng di động", members: [], description: "" },
    { id: 9, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "" },
];
localStorage.setItem("allProjects", JSON.stringify(allProjects));

let html = "";
let role = JSON.parse(sessionStorage.getItem("isLogIn")) || "";
let userLogIn = JSON.parse(sessionStorage.getItem("userLogIn")) || "";
let accountId;


if (role !== "admin") {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    //email la` doc. nhat' nen khong lo trung`
    let currentAccount = accounts.find(account => account.email === role);
    console.log(currentAccount);

    if (!currentAccount) {
        location.href = '../pages/login.html';
    }
    accountId = currentAccount.id;


    //luc' viet' code la` chua thiet' lap. vai tro` cho account nen gan' role cho du~ lieu. mau~
    accounts.forEach(account => {
        allProjects.forEach(project => {
            project.members.forEach(member => {
                if (member.userId === account.id) {
                    account.role = member.role;
                }
            });
        });
    });

    localStorage.setItem("accounts", JSON.stringify(accounts));
    role = currentAccount.role;
    sessionStorage.setItem("userLogIn", JSON.stringify(role));
}



function createHeader() {
    let header = document.getElementById("header");
    if (role === "admin") {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="#" class="text-white me-3 text-decoration-none">Dự Án</a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    } else if (role === "Project owner") {
        header.innerHTML = `<div class="container d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Quản Lý Dự Án</h5>
            </div>
            <div>
                <a href="#" class="text-white me-3 text-decoration-none">Dự Án</a>
                <a href="#" class="text-white text-decoration-none" id="logOutBtn">Đăng Xuất</a>
            </div>
        </div>`;
    }
}

function renderProject(projects = allProjects) {
    html = "";
    createHeader();
    if (role === "admin") {
        projects.forEach(project => {
            html += `<tr>
                        <td class="border">${project.id}</td>
                        <td class="border text-start">${project.projectName}</td>
                        <td class="btns border">
                            <button data-id="${project.id}" class="btn btn-warning btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#addProject">Sửa</button>
                            <button class="btn btn-danger btn-sm del-btn" data-bs-toggle="modal" data-bs-target="#confirmDel" data-id="${project.id}">Xóa</button>
                            <button class="btn btn-primary btn-sm detail-btn" data-id="${project.id}">Chi tiết</button>
                        </td>
                    </tr>`;
        });
        document.getElementById("table-body").innerHTML = html;
    } else if (role == "Project owner") {
        let projectBelongTo = projects.filter(project => {
            return project.members.some(member => member.userId === accountId);
        });

        if (projectBelongTo.length === 0) {
            html = html = `<tr><td colspan="3" class="text-center">OOPS! YOU DON'T HAVE ANY PROJECT NOW!!</td></tr>`;
            document.getElementById("table-body").innerHTML = html;
        } else {
            projectBelongTo.forEach(project => {
                html += `<tr>
                            <td class="border">${project.id}</td>
                            <td class="border text-start">${project.projectName}</td>
                            <td class="btns border">
                                <button data-id="${project.id}" class="btn btn-primary btn-sm detail-btn">Chi tiết</button>
                            </td>
                        </tr>`;
            });
            document.getElementById("table-body").innerHTML = html;
        }
    } else {
        location.href = '../pages/personal-task.html';
    }
}

renderProject();

(function displayAddBtn() {
    let addBtn = document.getElementById("addProjectBtn");
    if (role === "admin") {
        addBtn.style.display = "block";
    } else {
        addBtn.style.display = "none";
    }
})();

document.getElementById("table-body").addEventListener("click", function (event) {
    if (event.target.classList.contains("del-btn")) {
        let id = +(event.target.getAttribute("data-id"));
        document.getElementById("confirmDel").addEventListener("click", () => {
            allProjects = allProjects.filter(project => project.id !== id);
            renderProject();
            localStorage.setItem("allProjects", JSON.stringify(allProjects));
        });
    }
});

let isEditing = false;
let editingProjectId = null;

document.getElementById("addProjectBtn").addEventListener("click", function () {
    // Reset form
    document.getElementById("project-name-add").value = "";
    document.getElementById("project-describe-add").value = "";
    document.getElementById("printMistake").innerHTML = "";

    isEditing = false;
    editingProjectId = null;
});

//an' nut' sua? 
document.getElementById("table-body").addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
        isEditing = true;
        editingProjectId = +(e.target.getAttribute("data-id"));
        let found = allProjects.find(project => project.id === editingProjectId);

        if (found) {
            document.getElementById("project-name-add").value = found.projectName;
            document.getElementById("project-describe-add").value = found.description;
            document.getElementById("printMistake").innerHTML = "";

            let saveBtn = document.getElementById("saveAddBtn");
            saveBtn.textContent = "Cập nhật";
        }
    }
});

//su. kien nhan' nut' luu
document.getElementById("saveAddBtn").addEventListener("click", function () {
    let namePj = document.getElementById("project-name-add").value.trim();
    let describe = document.getElementById("project-describe-add").value.trim();
    let printMistake = document.getElementById("printMistake");

    if (namePj === "") {
        printMistake.innerHTML = "Tên dự án không được để trống!!";
        return;
    }

    if (isEditing) {
        let found = allProjects.find(project => project.id === editingProjectId);
        if (found) {
            found.projectName = namePj;
            found.description = describe;
        }
    } else {
        let newId = allProjects.length + 1;
        allProjects.push({
            id: newId,
            projectName: namePj,
            members: [],
            description: describe
        });
    }

    renderProject();
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
});

//xoa' du~ lieu. trong input cua? modal
document.getElementById("addProjectBtn").addEventListener("click", function () {
    document.getElementById("project-name-add").value = "";
    document.getElementById("project-describe-add").value = "";
});

function searchProject() {
    let input = document.getElementById("search-project").value.trim().toLowerCase();
    let filterProject = allProjects.filter(project => project.projectName.toLowerCase().includes(input));

    renderProject(filterProject);
}

//khi nhan' vao` chi tiet
document.getElementById("table-body").addEventListener("click", function(e) {
    if(e.target.classList.contains("detail-btn")) {
        let id = +(e.target.getAttribute("data-id"));
        console.log(id);
        
        sessionStorage.setItem("idProjectDetail", JSON.stringify(id));
        location.href = './project-detail.html';
    }
})