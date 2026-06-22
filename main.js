class Router {
  constructor(routes) {
    this.routes = routes;

    window.addEventListener("popstate", () => {
      this.loadRoute(location.pathname);
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");

      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute("href"));
      }
    });
  }

  async loadRoute(path) {
    const page = this.routes[path] || this.routes["/404"];

    const html = await fetch(page).then(res => res.text());

    document.getElementById("app").innerHTML = html;
  }

  navigate(path) {
    history.pushState({}, "", path);
    this.loadRoute(path);
  }

  start() {
    this.loadRoute(location.pathname);
  }
}
