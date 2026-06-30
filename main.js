class Router {
  constructor(routes) {
    this.routes = routes;

    window.addEventListener("popstate", () => {
      this.loadRoute(this.normalizePath(location.pathname));
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");

      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute("href"));
      }
    });
  }

  normalizePath(path) {
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path === "" || path === "/index.html") return "/";
    if (path.endsWith("/index.html")) {
      const base = path.slice(0, -"/index.html".length);
      return base || "/";
    }
    if (path === "/blog.html" || path.endsWith("/blog.html")) return "/blog";
    return path;
  
    if (path === "/projects.html" || path.endsWith("/projects.html")) return "/projects";
    return path;
  }

  async loadRoute(path) {
    const normalizedPath = this.normalizePath(path);
    const page = this.routes[normalizedPath] || this.routes["/404"];
    if (!page) return false;

    const res = await fetch(new URL(page, location.href));
    if (!res.ok) return false;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const pageEl = doc.querySelector(".page");
    const app = document.getElementById("app");

    if (!pageEl || !app) return false;

    app.innerHTML = pageEl.outerHTML;
    app.dataset.route = normalizedPath;
    document.title = doc.title;
    return true;
  }

  async navigate(path) {
    const normalizedPath = this.normalizePath(path);
    const previousPath = this.normalizePath(location.pathname);
    history.pushState({}, "", normalizedPath);

    const loaded = await this.loadRoute(normalizedPath);
    if (!loaded) history.replaceState({}, "", previousPath);
  }

  start() {
    const redirect = sessionStorage.getItem("spa-path");
    if (redirect) {
      sessionStorage.removeItem("spa-path");
      history.replaceState({}, "", redirect);
    }

    const path = this.normalizePath(location.pathname);
    const app = document.getElementById("app");

    if (path !== location.pathname && this.routes[path]) {
      history.replaceState({}, "", path);
    }

    if (!app) return;

    const onHomePage =
      path === "/" &&
      (location.pathname === "/" || location.pathname === "/index.html");

    if (onHomePage) {
      app.dataset.route = path;
      return;
    }

    if (this.routes[path]) {
      this.loadRoute(path);
    }
  }
}
