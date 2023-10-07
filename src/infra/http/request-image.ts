export const requestImages = async () => {
  try {
    const response = await fetch('http://localhost:8100/image/download');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}