export function resfreshToken() {
    if (!localStorage.getItem('refresh_token')) return;
    if (new Date(parseInt(localStorage.getItem('expire_date') ?? '0')).getTime() > new Date().getTime()) return;

    let token = localStorage.getItem('refresh_token') ?? '';
    console.log(token);
    return fetch(process.env.REACT_APP_API_URL + '/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token })
    })
        .then(res => {
            if (res.status !== 200) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('expire_date');
                localStorage.removeItem('logged');
                localStorage.removeItem('pseudo');
                alert("Vous avez été déconnecté.");
            } else if (res.status !== 200) {
                console.log("Err: " + res.status);
                res.json().then(res => {
                    console.log(res);
                });

                return;
            }

            return res.json();
        })
        .then(res => {
            localStorage.setItem('access_token', res.access_token);
            let d = new Date().setSeconds(new Date().getSeconds() + parseInt(res.expires_in) ?? 0);
            localStorage.setItem('expire_date', d.toString());
        });
}

export function requester<T>(url: string, method: string, body?: any): Promise<T> {
    if (localStorage.getItem("refresh_token") !== null) {
        try {
            resfreshToken();
        }
        catch (e) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expire_date');
            localStorage.removeItem('logged');
            localStorage.removeItem('pseudo');
        }
    }

    let token = localStorage.getItem('access_token') ?? '';
    let headers = {};

    token ? headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : headers = {
        'Content-Type': 'application/json'
    };

    return fetch(process.env.REACT_APP_API_URL + url, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined
    })
        .then(res => {
            if (res.status === 401 && token) {
                alert("Action non authorisée.");
            } else if (res.status === 418) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('expire_date');
                localStorage.removeItem('logged');
                localStorage.removeItem('pseudo');
                alert("Vous avez été déconnecté.");
            } else if (res.status !== 200) {
                console.log("Err: " + res.status);
            }

            return res.json();
        });
}

export function requesterFile<T>(url: string, method: string, file: File, contentType?: string): Promise<T> {
    if (contentType && !contentType.includes('image')) {
        return postFile(url, method, file.stream(), contentType);
    }

    // Compress images before sending them to the server
    let p = new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = img.width;
                elem.height = img.height;
                const ctx = elem.getContext('2d');
                ctx?.drawImage(img, 0, 0, img.width, img.height);
                ctx?.canvas.toBlob((blob) => {
                    const compressedFile = new File([blob as Blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', 0.7);
            };
        };
    });

    return p.then((compressedFile: any) => {
        if (compressedFile === undefined) return;

        return postFile(url, method, compressedFile.stream(), contentType);
    });
}

function postFile(url: string, method: string, body: ReadableStream<Uint8Array>, contentType?: string) {
    resfreshToken();

    let token = localStorage.getItem('access_token') ?? '';
    let headers = {};

    token ? headers = {
        'Content-Type': contentType ?? 'application/json',
        'Authorization': `Bearer ${token}`
    } : headers = {
        'Content-Type': 'application/json'
    };

    let requestStream = new ReadableStream({
        start(controller) {
            const reader = body.getReader();

            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    read();
                });
            }

            read();
        }
    });

    let content = new Uint8Array();
    let reader = requestStream.getReader();

    return reader.read().then(function processText({ done, value }): any {
        if (done) {
            return content;
        }

        let tmp = new Uint8Array(content.length + value.length);
        tmp.set(content);
        tmp.set(value, content.length);
        content = tmp;

        return reader.read().then(processText);
    }).then(content => {
        return fetch(process.env.REACT_APP_API_URL + url, {
            method,
            headers: headers,
            body: content
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('expire_date');
                    localStorage.removeItem('logged');
                    localStorage.removeItem('email');
                    localStorage.removeItem('phone');
                    localStorage.removeItem('firstName');
                    localStorage.removeItem('lastName');

                    throw new Error('Session expired');
                }
                return res.json();
            });
    });
}
