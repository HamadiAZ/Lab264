import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeObject(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log("storeObject from async storage : Error for key : " + key + " || " + e);
  }
}

export async function storeItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("storeItem from async storage : Error for key : " + key + " || " + e);
  }
}

export async function readItem(key, setFunction = undefined) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return undefined;

    if (setFunction != undefined) setFunction(value);
    return value;
  } catch (e) {
    console.log("readItem from async storage : Error for key : " + key + " || " + e);
    return undefined;
  }
}

export async function readObject(key, setFunction = undefined) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    jsonValue != null ? JSON.parse(jsonValue) : null;
    if (jsonValue == null) return undefined;

    const newValue = JSON.parse(jsonValue);
    if (setFunction != undefined) setFunction(newValue);
    return newValue;
  } catch (e) {
    console.log("readObject from async storage : Error for key : " + key + " || " + e);
    return undefined;
  }
}

export async function removeItem(key) {
  try {
     await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("readObject from async storage : Error for key : " + key + " || " + e);
    return undefined;
  }
}
