
export function translateCarousel(direction: number, width: number, imgNumber: number, previousTr: number, setTr: React.Dispatch<React.SetStateAction<number>>) {
    if (getWindowSize() < 768) {
        width = 60;
    }

    let newTr = previousTr + (width * direction);

    if (newTr < (-width * (imgNumber - 1))) {
        newTr = 0;
    } else if (newTr > 0) {
        newTr = (-width * (imgNumber - 1));
    }

    setTr(newTr);
    document.getElementById('home-carousel-list')?.setAttribute("style", "transform: translate(" + newTr + "vw)");
}

export function columnImagesTranslateCarousel(index: number, width: number, imgNumber: number, previousTr: number, setTr: React.Dispatch<React.SetStateAction<number>>) {
    if (getWindowSize() < 768) {
        width = 60;
    }
    let prevImg = Math.abs(Math.floor(previousTr / width));
    let direction: number;
    let diff: number = Math.abs(prevImg - index);
    if (prevImg === index) {
        return;
    } else if (prevImg < index) {
        direction = -1;
    } else {
        direction = 1;
    }

    let newTr = previousTr + (width * direction * diff);

    if (newTr < (-width * (imgNumber - 1))) {
        newTr = 0;
    } else if (newTr > 0) {
        newTr = (-width * (imgNumber - 1));
    }

    setTr(newTr);
    document.getElementById('home-carousel-list')?.setAttribute("style", "transform: translate(" + newTr + "vw)");
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return innerWidth;
}
