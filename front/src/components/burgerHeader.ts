export function burgerHeader() {
    let headerDisplay = document.getElementById('header-buttons-mobile')?.style.display;

    if (headerDisplay === "none") {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: flex");
        document.getElementById('header-buttons-mobile-admin')?.setAttribute("style", "display: initial");
        document.getElementById('app')?.setAttribute("style", "height: 100vh; overflow: hidden");
    } else {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: none");
        document.getElementById('header-buttons-mobile-admin')?.setAttribute("style", "display: none");
        document.getElementById('app')?.setAttribute("style", "");
    }
}