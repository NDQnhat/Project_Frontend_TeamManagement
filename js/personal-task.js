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
    tasksOfUser = project.tasks.filter(task => task.assignedId === findUserIdByEmail(emailLogin));
});
console.log(tasksOfUser);



//copy code
function findUserIdByEmail(email) {
    let userFound = accounts.find(account => account.email === email);
    return userFound ? userFound.id : undefined;
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