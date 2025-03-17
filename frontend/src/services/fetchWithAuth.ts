export const fetchWithAuth = async ({url, token}: { url: string, token: string }) => {
    const data = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }).then((data) => data.json())

    return data
}