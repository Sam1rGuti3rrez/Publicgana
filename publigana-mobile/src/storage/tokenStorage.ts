import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

async function setItem(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }

  return await SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function saveAccessToken(token: string) {
  await setItem(ACCESS_TOKEN, token);
}

export async function getAccessToken() {
  return await getItem(ACCESS_TOKEN);
}

export async function removeAccessToken() {
  await deleteItem(ACCESS_TOKEN);
}

export async function saveRefreshToken(token: string) {
  await setItem(REFRESH_TOKEN, token);
}

export async function getRefreshToken() {
  return await getItem(REFRESH_TOKEN);
}

export async function removeRefreshToken() {
  await deleteItem(REFRESH_TOKEN);
}

export async function clearSession() {
  await removeAccessToken();
  await removeRefreshToken();
}