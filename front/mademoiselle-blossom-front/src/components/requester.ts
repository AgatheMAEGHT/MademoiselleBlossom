export function requester<T>(url: string, method: string, body?: any): Promise<T> {
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
        .then(res => res.json())
}