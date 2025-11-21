import { api } from "./client.js";

export async function fetchGames() {
    const { data } = await api.get("/api/getGames");
    return data;
}
export async function createGame(payload) {
    const {data} = await api.post("/api/addGame", payload);
    return data;
}
export async function updateGame(id, payload) {
    const { data } = await api.patch(`/api/updateGame/${id}`, payload);
    return data;
}
export async function deleteGame(id) {
    const { data } = await api.delete(`/api/deleteGame/${id}`);
    return data;
}
