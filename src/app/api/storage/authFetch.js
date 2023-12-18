import {load } from '../storage/index'
export function headers() {
  const token = load("token");
  console.log("Token:", token); // Add this line to log the token
  

  return {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  
}
export async function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: headers(),
  });
}
