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