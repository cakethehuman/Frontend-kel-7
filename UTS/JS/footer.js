$(document).ready(function() {
    $("#footer-placeholder").load("footer.html .custom-footer", function(response, status, xhr) {
        if (status === "error") {
            const errorMsg = "Footer gagal dimuat: " + xhr.status + " " + xhr.statusText;
            $("#footer-placeholder").html("<div class='p-3 text-center text-danger fw-bold'>" + errorMsg + "</div>");
        }
    });
});