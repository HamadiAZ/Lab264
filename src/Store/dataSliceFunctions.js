import { useSelector, useDispatch } from 'react-redux';



const separator = "/";
export function getAllDevices(data){
    return _getAllDevices(data);
  }
  function _getAllDevices(obj, devices = [], path = "") {
    if (obj.type == "container") {
      path += (obj.separator == undefined ? separator : obj.separator) + obj.path;
      obj.Data.forEach((element) => {
        _getAllDevices(element, devices, path);
      });
    } else {
      let newCumulativePath = path + separator + obj.path; // trying not to update the state so often
      if (obj.cumulativePath != newCumulativePath)
        obj.cumulativePath = newCumulativePath;
  
      devices.push(obj);
    }
    return devices;
  }
  

  export function setStateOfDevice(state,cumulativePath,newState){
    let oldElementState=getElementByPath(cumulativePath,state)
    console.log(oldElementState);
    oldElementState.state=newState.state;
  }
  export function getDeviceFromState(cumulativePath){
    const reduxData = useSelector((state) => state.data)
    return getElementByPath(cumulativePath,reduxData)
  }

  export function updateCumulativePath(obj, path = "") {
    let newSeparator=obj.separator == undefined ? separator : obj.separator;
    let newCumulativePath = path + newSeparator + obj.path; // trying not to update the state so often

    if (obj.cumulativePath != newCumulativePath)
      obj.cumulativePath = newCumulativePath; // trying not to update the state so often
    if (obj.type == "container") {
      obj.Data.forEach((element) => {
        updateCumulativePath(element, newCumulativePath);
      });
    }
    return obj;
  }

  export function getCategories(obj = test) {
    return _getCategories(obj);
  }
  function _getCategories(obj, categories = {},) {
    if (obj.type == "container") {
      obj.Data.forEach((element) => {
        categories = _getCategories(element, categories);
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
  
  export function getTypes(obj) {
    return _getTypes(obj);
  }
  function _getTypes(obj, Types = {}) {
    if (obj.type == "container") {
      obj.Data.forEach((element) => {
        Types = _getTypes(element, Types);
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

  function getElementByPath(cumulativePath = "", obj){
    let foundElement;
    obj.Data.forEach(element => {
      let result=_getElementByPath(cumulativePath,element);
      if(result!=undefined) foundElement=result;
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
  
    //left part
  
    if (cumulativePath.startsWith(separator))
      searchedPart = cumulativePath.substring(separator.length);
  
    let rightPartRemoved = searchedPart;
    //remove right Part
    if (obj.Data.length > 0) {
        
      rightPartRemoved = searchedPart.split(separator)[0];
    }

    if (rightPartRemoved != obj.path) return undefined;
  
    searchedPart = searchedPart.substring(
      rightPartRemoved.length + separator.length
    );
  
    let result;
  
    obj.Data.forEach((newObj) => {
      const x = _getElementByPath(searchedPart, newObj);
      if (x !== undefined) {
        result = x;
        return;
      }
    });
  
    return result;
  }