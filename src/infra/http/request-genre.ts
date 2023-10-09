import { Genre } from "../../domain/entities/ genre/genre";

export const getGenres = async (): Promise<Genre[]> => {
  const response = await fetch("http://localhost:8100/genre/all", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  });
  const data = await response.json();
  return data;
}