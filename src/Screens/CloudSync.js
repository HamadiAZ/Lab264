import { useNavigation } from "@react-navigation/core";
import { getAuth, getReactNativePersistence, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setData, updateCumulativePaths } from "../Store/dataSlice";
import { readObject, storeObject } from "../Utils/asyncStorage";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const firebaseConfig = {
  apiKey: "AIzaSyCaENsDDIVdz7erHN05N6VpTdHkdUlntCU",
  authDomain: "enig-lab264.firebaseapp.com",
  projectId: "enig-lab264",
  storageBucket: "enig-lab264.appspot.com",
  messagingSenderId: "912828525384",
  appId: "1:912828525384:web:53558e05b9d170b6a3217d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
function CloudSync() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  dispatch = useDispatch();
  const firestore = getFirestore(app);
  const data = useSelector((state) => state.data);

  async function signIn() {
    setLoading(true);
    try {
      storeObject("syncCredentials", { email, password });
      //const response = await signInWithEmailAndPassword(auth, "gcrpromo2024@enig.tn", "Lab264MrRidhaHamdi");
      //const response = await signInWithEmailAndPassword(auth, "gcrpromo2024@lab264.enig.tn", "Lab264");
      const response = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      //updateUserInfo("USER");
      if (response.user.displayName === "ADMIN") setIsAdmin(true);
      console.log(response.user.displayName);
    } catch (error) {
      console.log(error);

      // just to hide the "firebase" word in the alert shown to the user :D
      let errorToShow = error.message;
      if (errorToShow.startsWith("Firebase")) errorToShow = errorToShow.substring("Firebase".length + 2);
      alert("Sign in failed: " + errorToShow);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserInfo(role) {
    const user = auth.currentUser;
    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: role,
        photoURL: role,
      });
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signOutHandler() {
    setLoading(true);
    await signOut(auth);
    isAdmin && setIsAdmin(false);
    setIsLoggedIn(false);
    setLoading(false);
  }

  async function uploadData() {
    setLoading(true);
    try {
      const documentRef = doc(firestore, "data", "data");
      await updateDoc(documentRef, data);
      console.log("Data uploaded successfully");
      alert("Data uploaded successfully");
    } catch (error) {
      console.error("Error uploading data:", error.message);
      alert("Error uploading data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getData() {
    setLoading(true);
    try {
      const documentRef = doc(firestore, "data", "data");
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        console.log("Data from Firestore:", data);
        alert("Data retrieved successfully");
        await storeObject("data", data);
        dispatch(setData(data));
        dispatch(updateCumulativePaths());
      } else {
        console.log("Document does not exist");
        alert("Error getting data: " + "Document does not exist");
      }
    } catch (error) {
      console.error("Error getting data:", error.message);
      alert("Error getting data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Sync application Data", // Set the new title for the navigation bar
    });

    readObject("syncCredentials").then((credential) => {
      if (credential != undefined) {
        setEmail(credential.email != undefined ? credential.email : "");
        setPassword(credential.password != undefined ? credential.password : "");
      } else {
        console.log("got empty syncCredentials in loading");
        setPassword("");
        setEmail("");
      }
    });
  }, []);

  const exportToJson = async () => {
    try {
      setLoading(true);
      const jsonString = JSON.stringify({ a: "t" });
      // Let the user pick a directory to save the file
      const directoryUri = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (directoryUri.granted) {
        // Create a new file in the selected directory
        const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri.directoryUri, "exportedData.json", "application/json");
        // Write the JSON string to the new file
        await FileSystem.writeAsStringAsync(newFileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
        alert("JSON file exported. Path: " + newFileUri);
        console.log("JSON file exported successfully. Path:", newFileUri);
      } else {
        alert("Exporting error: Directory permissions were denied");
        console.log("Directory permissions were denied");
      }
    } catch (error) {
      console.error("Error exporting JSON file:", error.message);
      alert("Error exporting JSON file:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const importFromJson = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({ type: "application/json" });

      // Check if the document picker was not cancelled and assets are available
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0]; // Get the URI of the selected file
        const jsonString = await FileSystem.readAsStringAsync(uri);
        const importedData = JSON.parse(jsonString);
        const validation = validateJsonStructure(importedData);
        if (validation.isValid) {
          await storeObject("data", importedData);
          dispatch(setData(importedData));
          dispatch(updateCumulativePaths());
          console.log("The JSON object has the correct form and can be used.");
          alert("JSON file imported successfully");
        } else {
          console.error("The JSON object does not match the required form:", validation.errorMessage);
          alert("JSON file is not valid : " + validation.errorMessage);
        }
        console.log("JSON file imported successfully:", importedData);
      } else {
        console.log("Document picker was cancelled or no file was selected");
        alert("Importing error: operation cancelled or no file was selected");
      }
    } catch (error) {
      console.error("Error importing JSON file:", error.message);
      alert("Error importing JSON file:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn)
    return (
      <View className="flex-1 flex justify-center items-center gap-7">
        <View>
          <View className="flex flex-row gap-2  justify-start mb-2 ">
            <Text className="text-xl w-4/12">UserName :</Text>
            <TextInput className="pr-2 text-xl w-fit overflow-auto border-b-2 p-0" style={{ maxWidth: "60%" }} placeholder={"enter email"} value={email} autoCapitalize={"none"} onChangeText={setEmail} />
          </View>
          <View className="flex flex-row gap-2 justify-start">
            <Text className="text-xl w-1/3">Password :</Text>
            <TextInput className="text-xl w-fit overflow-auto border-b-2 p-0" secureTextEntry={true} placeholder={"enter password"} style={{ maxWidth: "60%" }} value={password} autoCapitalize={"none"} onChangeText={setPassword} />
          </View>
        </View>
        <TouchableOpacity onPress={signIn} className={"flex justify-center items-center w-40 h-12 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
          <Text className="text-xl text-white font-bold">Sign in</Text>
        </TouchableOpacity>

        <Text className="text-xl text-black font-bold pt-16">Offline data management</Text>

        <TouchableOpacity onPress={exportToJson} className={"flex justify-center items-center w-44 h-12 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
          <Text className="text-xl text-white font-bold">Export as JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={importFromJson} className={"flex justify-center items-center w-44 h-12 mb-48 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
          <Text className="text-xl text-white font-bold">Import JSON</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View className="flex-1 flex justify-center items-center gap-4">
      <Text className="text-xl"> you are connected as {isAdmin ? "Admin" : "User"}</Text>

      <TouchableOpacity onPress={getData} className={"flex justify-center items-center w-64 h-12 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
        <Text className="text-xl text-white font-bold">Get Data from the cloud</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={uploadData} className={"flex justify-center items-center w-64 h-12 " + (loading ? "bg-gray-300" : isAdmin ? "bg-rose-600" : "bg-gray-300")} disabled={loading || !isAdmin}>
        <Text className="text-xl text-white font-bold">Upload data to the cloud</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOutHandler} className={"flex justify-center items-center w-64 h-12 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
        <Text className="text-xl text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CloudSync;

const validateJsonStructure = (jsonObject) => {
  let isValid = true;
  let errorMessage = "";

  if (!jsonObject.hasOwnProperty("type")) {
    errorMessage += 'Property "type" is missing.\n';
    isValid = false;
  } else if (jsonObject.type !== "container") {
    errorMessage += 'Property "type" must be "container".\n';
    isValid = false;
  }

  if (!jsonObject.hasOwnProperty("path")) {
    errorMessage += 'Property "path" is missing.\n';
    isValid = false;
  } else if (typeof jsonObject.path !== "string") {
    errorMessage += 'Property "path" must be a string.\n';
    isValid = false;
  }

  if (!jsonObject.hasOwnProperty("cumulativePath")) {
    errorMessage += 'Property "cumulativePath" is missing.\n';
    isValid = false;
  } else if (typeof jsonObject.cumulativePath !== "string") {
    errorMessage += 'Property "cumulativePath" must be a string.\n';
    isValid = false;
  }

  if (!jsonObject.hasOwnProperty("separator")) {
    errorMessage += 'Property "separator" is missing.\n';
    isValid = false;
  } else if (jsonObject.separator !== false) {
    errorMessage += 'Property "separator" must be false.\n';
    isValid = false;
  }

  if (!jsonObject.hasOwnProperty("Data")) {
    errorMessage += 'Property "Data" is missing.\n';
    isValid = false;
  } else if (!Array.isArray(jsonObject.Data) || jsonObject.Data.length === 0) {
    errorMessage += 'Property "Data" must be a non-empty array.\n';
    isValid = false;
  }

  return { isValid, errorMessage };
};
