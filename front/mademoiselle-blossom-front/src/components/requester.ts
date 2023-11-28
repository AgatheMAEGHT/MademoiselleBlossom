export function resfreshToken() {
    if (!localStorage.getItem('refresh_token')) return;
    if (new Date(localStorage.getItem('expire_date') ?? '').getTime() > new Date().getTime()) return;

    let token = localStorage.getItem('refresh_token') ?? '';
    return fetch(process.env.REACT_APP_API_URL + '/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token })
    })
        .then(res => res.json())
        .then(res => {
            localStorage.setItem('access_token', res.access_token);
        })
}

export function requester<T>(url: string, method: string, body?: any): Promise<T> {
    resfreshToken();

    let token = localStorage.getItem('access_token') ?? '';
    let headers = {};

    token ? headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : headers = {
        'Content-Type': 'application/json'
    }

    return fetch(process.env.REACT_APP_API_URL + url, {
        method,
        headers: headers,
        body: JSON.stringify(body)
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
            return res.json()
        })
}