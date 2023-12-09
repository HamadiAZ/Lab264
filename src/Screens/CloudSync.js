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
      let errorToShow=error.message;
      if(errorToShow.startsWith("Firebase")) errorToShow=errorToShow.substring("Firebase".length +2);
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

  if (!isLoggedIn)
    return (
      <View className="flex-1 flex justify-center items-center gap-6">
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
