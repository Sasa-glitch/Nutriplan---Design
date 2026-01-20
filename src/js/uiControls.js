// selecting sections buttons
const sectionsButtons = document.querySelectorAll(".nav-link");
// selecting toggle menu button and its salatat and babaqno
const headerMenuButton = document.getElementById("header-menu-btn");
const sidebarCloseButton = document.getElementById("sidebar-close-btn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
// applodadin overlay
const appLoadingOverlay = document.getElementById("app-loading-overlay");

// hide loading when page loads
setTimeout(() => {
    appLoadingOverlay.classList.add("hidden");
}, 500);

// giving sections buttons some magic
sectionsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        sectionsButtons.forEach((innerButton) => {
            const theCondition = e.currentTarget === innerButton;
            innerButton.classList.toggle("bg-emerald-50", theCondition);
            innerButton.classList.toggle("text-emerald-700", theCondition);
            innerButton.classList.toggle("text-gray-600", !theCondition);
            innerButton.classList.toggle("hover:bg-gray-50", !theCondition);
            document
                .getElementById(innerButton.getAttribute("data-info"))
                .classList.toggle("hidden", !theCondition);
        });
    });
});

// making toggle function for sidebar
function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
    document.body.style.overflow = "hidden";
}

// apply it to the buttons
headerMenuButton.addEventListener("click", toggleSidebar);
sidebarCloseButton.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);
