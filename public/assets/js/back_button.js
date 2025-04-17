document.addEventListener("DOMContentLoaded", function () {
    let backButton = document.getElementById("back_button");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.history.back();
        });
    }
});
