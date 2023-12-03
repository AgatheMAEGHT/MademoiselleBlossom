
export function translateCarousel(direction: number, width: number, imgNumber: number, previousTr: number, setTr: React.Dispatch<React.SetStateAction<number>>) {
    let newTr = previousTr + (width * direction);

    if (newTr < (-width * (imgNumber - 1))) {
        newTr = 0;
    } else if (newTr > 0) {
        newTr = (-width * (imgNumber - 1));
    }

    setTr(newTr);
    document.getElementById('home-carousel-list')?.setAttribute("style", "transform: translate(" + newTr + "vw)");
}