export function burgerHeader() {
    let headerDisplay = document.getElementById('header-buttons-mobile')?.style.display;
    console.log(headerDisplay);

    if (headerDisplay === "none") {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: flex");
        document.getElementById('app')?.setAttribute("style", "height: 100vh; overflow: hidden");
    } else {
        document.getElementById('header-buttons-mobile')?.setAttribute("style", "display: none");
        document.getElementById('app')?.setAttribute("style", "");
    }
}