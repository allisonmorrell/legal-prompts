
document.addEventListener("DOMContentLoaded", function() {
    var sidebarContainer = document.getElementById("sidebar");
    if (sidebarContainer) {
        var sidebarContent = `
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="analysis-template.html">Analysis Template</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="prompts.html">Prompts</a>
            </li>
            <!-- Add more navigation links as needed -->
        </ul>
        `;
        sidebarContainer.innerHTML = sidebarContent;
    }
});
