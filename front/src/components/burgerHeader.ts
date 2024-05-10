export function burgerHeader(forceDisplayNone: boolean = false) {
    let headerDisplay = document.getElementById('header-buttons-mobile')?.style.display;

    if (headerDisplay === "none" && !forceDisplayNone) {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: flex");
        document.getElementById('header-buttons-mobile-admin')?.setAttribute("style", "display: initial");
        document.getElementById('app')?.setAttribute("style", "height: 100vh; overflow: hidden");
    } else {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: none");
        document.getElementById('header-buttons-mobile-admin')?.setAttribute("style", "display: none");
        document.getElementById('app')?.setAttribute("style", "");
    }
}