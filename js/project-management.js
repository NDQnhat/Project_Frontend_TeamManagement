let allProjects = JSON.parse(localStorage.getItem("allProjects")) || [
    { id: 1, projectName: "Xây dựng website thương mại điện tử", members: [], description: "Dự án nhằm phát triển một nền tảng thương mại điện tử với các tính năng như giỏ hàng, thanh toán và quản lý sản phẩm.", tasks: [] },
    { id: 2, projectName: "Phát triển ứng dụng di động", members: [], description: "", tasks: [] },
    { id: 3, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "", tasks: [] },
    { id: 4, projectName: "Xây dựng website thương mại điện tử", members: [], description: "", tasks: [] },
    { id: 5, projectName: "Phát triển ứng dụng di động", members: [], description: "", tasks: [] },
    { id: 6, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "", tasks: [] },
    { id: 7, projectName: "Xây dựng website thương mại điện tử", members: [], description: "", tasks: [] },
    { id: 8, projectName: "Phát triển ứng dụng di động", members: [], description: "", tasks: [] },
    { id: 9, projectName: "Quản lý dữ liệu khách hàng", members: [], description: "", tasks: [] },
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


function yourAllProject() {
    // let yourProjects = [];
    // yourProjects = allProjects.filter(project => {
    //     project.tasks.some(task => task.assignedId === accountId);
    // });
    // return yourProjects;
    let $projects = [];
    allProjects.forEach(project => {
        11566.6
        project.members.forEach(member => {
            if (member.userId === accountId && member.role === "Project owner") {
                $projects.push(project);
            }
        });
    });
    return $projects;
}

console.log("yourAllProject", yourAllProject());


function renderProject(projects = allProjects) {
    html = "";
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
    } else {

        if (projects.length === 0) {
            html = `<tr><td colspan="3" class="text-center">OOPS! YOU DON'T HAVE ANY PROJECT NOW!!</td></tr>`;
            document.getElementById("table-body").innerHTML = html;
        } else {
            // if(projects !== allProjects)
            let yourOwnProjects = [];
            projects.forEach(project => {
                project.members.forEach(member => {
                    if (member.userId === accountId && member.role === "Project owner") {
                        yourOwnProjects.push(project);
                    }
                });
            });
            console.log(yourOwnProjects);

            yourOwnProjects.forEach(project => {
                html += `<tr>
                            <td class="border">${project.id}</td>
                            <td class="border text-start">${project.projectName}</td>
                            <td class="btns border">
                                <button class="btn btn-primary btn-sm detail-btn" data-id="${project.id}">Chi tiết</button>
                            </td>
                        </tr>`;
            });
            document.getElementById("table-body").innerHTML = html;
        }
    }
}
// renderProject(projects = userLogIn.toLowerCase() === "admin" ? allProjects : yourAllProject());     //o? logic phan trang da~ goi. nen khong can` goi. them o? day nhung khi khong co' project nao` de? phan trang thi` se~ khong hien. gi` ca?

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
        document.getElementById("confirmDelBtn").addEventListener("click", () => {
            allProjects = allProjects.filter(project => project.id !== id);
            // renderProject();
            renderPagination(allProjects);
            changePage(1);
            localStorage.setItem("allProjects", JSON.stringify(allProjects));
        });
    }
});

let isEditing = false;
let editingProjectId = null;

// Reset form
document.getElementById("addProjectBtn").addEventListener("click", function () {
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
            description: describe,
            tasks: []
        });
    }

    // renderProject();
    renderPagination(allProjects);
    changePage(1);
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

    // console.log(filterProject);

    const arrTest = [

    ]

    // renderProject(filterProject.length > 0 ? divideArray(filterProject, itemsPerPage)[0] : arrTest);
    // renderPagination(filterProject.length > 0 ? divideArray(filterProject, itemsPerPage) : "No project found");

    renderProject(filterProject.length > 0 ? filterProject : arrTest);
    renderPagination(filterProject.length > 0 ? filterProject : "No project found");    //gap. loi~ khi tim` kiem' "" ket' qua? se~ khong duoc. phan trang
}

// let currentProjects = userLogIn.toLowerCase() === "admin" ? allProjects : yourAllProject();
// function searchProject() {
//     let input = document.getElementById("search-project").value.trim().toLowerCase();

//     // Cập nhật kết quả tìm kiếm
//     if (input === "") {
//         // Nếu không có từ khóa tìm kiếm, hiển thị tất cả dự án
//         currentProjects = userLogIn.toLowerCase() === "admin" ? allProjects : yourAllProject();
//     } else {
//         // Lọc dự án dựa trên từ khóa
//         currentProjects = allProjects.filter(project =>
//             project.projectName.toLowerCase().includes(input)
//         );

//         // Nếu không phải admin, chỉ hiển thị dự án của người dùng hiện tại
//         if (userLogIn.toLowerCase() !== "admin") {
//             currentProjects = currentProjects.filter(project => {
//                 return project.members.some(member =>
//                     member.userId === accountId && member.role === "Project owner"
//                 );
//             });
//         }
//     }
// }

//khi nhan' vao` chi tiet
document.getElementById("table-body").addEventListener("click", function (e) {
    if (e.target.classList.contains("detail-btn")) {
        let id = +(e.target.getAttribute("data-id"));
        console.log(id);

        sessionStorage.setItem("idProjectDetail", JSON.stringify(id));
        location.href = './project-detail.html';
    }
});

//==================================================
//pagination page
var currentPage = 1;
var itemsPerPage = 5;
function divideArray(array, pageSize) {
    let result = [];
    for (let i = 0; i < array.length; i += pageSize) {
        result.push(array.slice(i, i + pageSize));
    }
    return result;
};

let totalPages = 0;

function renderPagination(array) {
    if (array === "No project found") {
        let pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        return;
    }

    let pages = divideArray(array, itemsPerPage);
    totalPages = pages.length;
    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    html = `<li class="page-item" id="prevPage">
                <a class="page-link" href="#" onclick="changePage(currentPage - 1)">&laquo;</a>
            </li>`;
    pages.forEach((_, index) => {
        html += `<li class="page-item ${index === 0 ? "active" : ""}">
                    <a class="page-link" href="#" onclick="changePage(${index + 1})">${index + 1}</a>
                 </li>`;
    });
    html += `<li class="page-item" id="nextPage">
                <a class="page-link" href="#" onclick="changePage(currentPage + 1)">&raquo;</a>
             </li>`;
    pagination.innerHTML = html;

    document.getElementById("prevPage").classList.add("disabled");
    if (totalPages <= 1) {
        document.getElementById("nextPage").classList.add("disabled");
    }
}
renderPagination(projects = userLogIn.toLowerCase() === "admin" ? allProjects : yourAllProject());
changePage(1);

function changePage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;

    let projectsShow = userLogIn.toLowerCase() === "admin" ? allProjects : yourAllProject();
    renderProject(divideArray(projectsShow, itemsPerPage)[page - 1]);
    // renderProject(divideArray(currentProjects, itemsPerPage)[page - 1]);

    let paginationItems = document.querySelectorAll(".page-item");
    paginationItems.forEach(item => item.classList.remove("active"));
    paginationItems[page].classList.add("active");

    document.getElementById("prevPage").classList.toggle("disabled", page === 1);
    document.getElementById("nextPage").classList.toggle("disabled", page === totalPages);
}


document.getElementById("logOutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("userLogIn");
    sessionStorage.removeItem("idProjectDetail");
    sessionStorage.removeItem("isLogIn");

    location.href = '../pages/login.html';
});