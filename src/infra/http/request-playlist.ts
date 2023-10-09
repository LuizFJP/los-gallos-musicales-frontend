import { ListSongs } from "../../domain/entities/playlist/playlist";

export const getSongs = async (name: string): Promise<ListSongs[]> => {
  const response = await fetch(`http://localhost:8100/playlist?name=${name}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  });
  const data = await response.json();
  return data;
}