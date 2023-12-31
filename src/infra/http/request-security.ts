export const encryptUsername = async (username: string, roomName: string) => {
  const request =  await fetch(`http://localhost:8100/security/encrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username, roomName })
  });
  return await request.json();
}

export const decryptUsername = async (encryptedUsername: string ) => {
  const request =  await fetch(`http://localhost:8100/security/decrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username: encryptedUsername })
  });
  return await request.json();
}