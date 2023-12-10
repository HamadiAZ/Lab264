import React from "react";
import { Text, View } from "react-native";

import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { setData, updateCumulativePaths } from "../Store/dataSlice";
import { storeObject } from "../Utils/asyncStorage";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
const OfflineDataImpExp = ({ loading, setLoading }) => {
  const dispatch = useDispatch();
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
  return (
    <View className="flex justify-center items-center gap-7">
      <Text className="text-xl text-black font-bold pt-16">Offline data management</Text>

      <TouchableOpacity onPress={exportToJson} className={"flex justify-center items-center w-44 h-12 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
        <Text className="text-xl text-white font-bold">Export as JSON</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={importFromJson} className={"flex justify-center items-center w-44 h-12 mb-48 " + (loading ? "bg-gray-300" : "bg-rose-600")} disabled={loading}>
        <Text className="text-xl text-white font-bold">Import JSON</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineDataImpExp;

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
