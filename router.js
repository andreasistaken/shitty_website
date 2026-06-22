const routes = {
    "/": " ",
};

function render() {
    const path = window.location.pathname;

    document.getElementById("app").innerHTML =
        routes[path] || "<h1>404 Not Found</h1>";
}

function navigate(path) {
    history.pushState({}, "", path);
    render();
}

document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigate(e.target.getAttribute("href"));
    }
});

window.addEventListener("popstate", render);

render();