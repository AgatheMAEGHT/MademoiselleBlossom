
export function translateCarousel(direction: number, width: number, imgNumber: number, previousTr: number, setTr: React.Dispatch<React.SetStateAction<number>>, id: string, float?: boolean) {
    if (getWindowSize() < 768 && !float) {
        width = 60;
    }

    let newTr = previousTr + (width * direction);

    if (newTr < (-width * (imgNumber - 1))) {
        newTr = 0;
    } else if (newTr > 0) {
        newTr = (-width * (imgNumber - 1));
    }

    setTr(newTr);
    if (float) {
        let dir = window.innerHeight < window.innerWidth ? "vh" : "vw";
        document.getElementById(id)?.setAttribute("style", "transform: translate(" + newTr + dir + ")");
    } else {
        document.getElementById(id)?.setAttribute("style", "transform: translate(" + newTr + "vw)");
    }
}

export function columnImagesTranslateCarousel(index: number, width: number, imgNumber: number, previousTr: number, setTr: React.Dispatch<React.SetStateAction<number>>, id: string) {
    console.log("index: " + index + " width: " + width + " imgNumber: " + imgNumber + " previousTr: " + previousTr + " id: " + id);
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
    document.getElementById(id)?.setAttribute("style", "transform: translate(" + newTr + "vw)");
}

function getWindowSize() {
    const { innerWidth } = window;
    return innerWidth;
}
