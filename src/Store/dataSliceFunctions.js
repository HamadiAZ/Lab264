import { useDispatch, useSelector } from "react-redux";
import { readObject } from "../Utils/asyncStorage";
import { setData, updateCumulativePaths } from "./dataSlice";

const separator = "/";


export function setStateOfDevice(state, newState) {
  let oldElementState = getElementByPath(newState.cumulativePath, state);
  oldElementState.state = newState.state;
}
export function getDeviceFromState(cumulativePath) {
  const reduxData = useSelector((state) => state.data);
  return getElementByPath(cumulativePath, reduxData);
}

export function getListDeviceFromState(cumulativePath) {
  const reduxData = useSelector((state) => state.data);
  return getListElementByPath(cumulativePath, reduxData);
}

export function updateCumulativePath(obj, path = "") {
  let newSeparator = obj.separator === false ? "" : separator;
  let newCumulativePath = path + newSeparator + obj.path; // trying not to update the state so often

  if (obj.cumulativePath != newCumulativePath) obj.cumulativePath = newCumulativePath; // trying not to update the state so often
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      updateCumulativePath(element, newCumulativePath);
    });
  }
  return obj;
}

export function getAllDevices(obj, devices = []) {
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      getAllDevices(element, devices);
    });
  } else {
    devices.push(obj);
  }
  return devices;
}

export function getCategories(obj = test, categories = {}) {
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      categories = getCategories(element, categories);
    });
  } else {
    if (categories[obj.category] == undefined) {
      categories[obj.category] = [obj];
    } else {
      categories[obj.category].push(obj);
    }
  }
  return categories;
}

export function getTypes(obj, Types = {}) {
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      Types = getTypes(element, Types);
    });
  } else {
    if (Types[obj.type] == undefined) {
      Types[obj.type] = [obj];
    } else {
      Types[obj.type].push(obj);
    }
  }
  return Types;
}

function getElementByPath(cumulativePath = "", obj) {
  let foundElement;
  obj.Data.forEach((element) => {
    let result = _getElementByPath(cumulativePath, element);
    if (result != undefined) foundElement = result;
  });
  return foundElement;
}
function _getElementByPath(cumulativePath = "", obj) {
  if (obj.type != "container" || !obj.hasOwnProperty("Data")) {
    if (obj.path == cumulativePath) {
      return obj;
    }
    return undefined;
  }
  // container
  searchedPart = cumulativePath;

  //remove left part
  if (cumulativePath.startsWith(separator)) searchedPart = cumulativePath.substring(separator.length);
  let rightPartRemoved = searchedPart;

  //remove right Part
  if (obj.Data.length > 0) {
    rightPartRemoved = searchedPart.split(separator)[0];
  }

  if (rightPartRemoved != obj.path) return undefined;

  searchedPart = searchedPart.substring(rightPartRemoved.length + separator.length);

  let result;
  //console.log("searchedPart ") ;console.log(searchedPart) ;
  obj.Data.forEach((newObj) => {
    const x = _getElementByPath(searchedPart, newObj);
    if (x !== undefined) {
      result = x;
      return;
    }
  });
  return result;
}

function getListElementByPath(cumulativePath = "", obj) {
  let foundList = [];
  obj.Data.forEach((element) => {
    let result = _getListElementByPath(cumulativePath, element);
    if (result != undefined) foundList.push(...result);
  });
  return foundList;
}
function _getListElementByPath(cumulativePath = "", obj) {
  if (obj.type != "container" || !obj.hasOwnProperty("Data")) {
    if (obj.path.includes(cumulativePath)) {
      return [obj];
    }
    return undefined;
  }

  // container
  searchedPart = cumulativePath;

  //left part

  if (cumulativePath.startsWith(separator)) searchedPart = cumulativePath.substring(separator.length);

  let rightPartRemoved = searchedPart;

  //remove right Part
  if (obj.Data.length > 0) {
    rightPartRemoved = searchedPart.split(separator)[0];
  }

  if (rightPartRemoved != obj.path) return undefined;

  searchedPart = searchedPart.substring(rightPartRemoved.length + separator.length);

  let result = [];
  /* console.log("searchedPart ")
  console.log(searchedPart) */
  obj.Data.forEach((newObj) => {
    const x = _getListElementByPath(searchedPart, newObj);
    if (x !== undefined) {
      result.push(...x);
    }
  });

  return result;
}
