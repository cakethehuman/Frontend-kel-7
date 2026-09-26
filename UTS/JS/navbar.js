$(document).ready(function() {
    $("#nav-placeholder").load("navbar.html .custom-navbar", function(response, status, xhr) {
        if (status === "error") {
            const errorMsg = "Navigasi gagal dimuat: " + xhr.status + " " + xhr.statusText;
            $("#nav-placeholder").html("<div class='p-3 text-center text-danger fw-bold'>" + errorMsg + "</div>");
        }
    });
});