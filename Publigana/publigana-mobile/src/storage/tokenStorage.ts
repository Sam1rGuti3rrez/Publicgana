import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export async function saveAccessToken(token: string) {
  return SecureStore.setItemAsync(ACCESS_TOKEN, token);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN);
}

export async function removeAccessToken() {
  console.log("SecureStore object:", SecureStore);
  await SecureStore.deleteItemAsync(ACCESS_TOKEN);
}

export async function saveRefreshToken(token: string) {
  return SecureStore.setItemAsync(REFRESH_TOKEN, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN);
}

export async function removeRefreshToken() {
  return SecureStore.deleteItemAsync(REFRESH_TOKEN);
}

export async function clearSession() {
  await Promise.all([
    removeAccessToken(),
    removeRefreshToken(),
  ]);
}