export const loadData = (key) => {
    try {
        const serialized = localStorage.getItem(key);
        return JSON.parse(serialized);
    } catch (e) {
        return {};
        console.log("Error : ", e);
    }
}

export const saveData = (key, payload) => {
    try {
        const serialized = JSON.stringify(payload);
        localStorage.setItem(key, serialized);
    } catch (e) {
        console.log("Error: ", e);
    }
}