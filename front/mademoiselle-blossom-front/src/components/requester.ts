export function requester<T>(url: string, method: string, body?: any): Promise<T> {
    let token = localStorage.getItem('token') ?? '';
    let headers = {};

    token ? headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : headers = {
        'Content-Type': 'application/json'
    }

    console.log("URL : " + process.env.REACT_APP_API_URL + url);
    console.log("\nMethod : " + method);
    console.log("\nHeaders : " + JSON.stringify(headers));
    console.log("\nBody : " + JSON.stringify(body));

    return fetch(process.env.REACT_APP_API_URL + url, {
        method,
        headers: headers,
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}