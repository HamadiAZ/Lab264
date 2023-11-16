const separator = "/";
let Lab01Data = [
  {
    type: "Button",
    name: "Button 1",

    path: "Button01",
    cumulativePath: "",
    category: "ButtonX",
    state: false,
    params: {
      onMessage: "On",
      offMessage: "Off",
    },
  },
  {
    type: "Button",
    name: "Button 2",

    path: "Button02",
    cumulativePath: "",
    category: "ButtonY",
    state: false,
    params: {
      onMessage: "On",
      offMessage: "Off",
    },
  },
  {
    type: "Slider",
    name: "Slider 1",

    path: "Slider01",
    cumulativePath: "",
    category: "ButtonY",
    state: 10,
    params: {
      minValue: 1,
      maxValue: 200,
    },
  },
  {
    type: "Custom",
    name: "custom with params",

    path: "Custom01",
    cumulativePath: "",
    category: "ButtonY",
    state: 10,
    params: {
      AcceptedValues: [],
    },
  },
  {
    type: "Custom",
    name: "custom 2",

    path: "Custom02",
    cumulativePath: "",
    category: "ButtonY",
    state: 10,
    params: {},
  },
  {
    type: "Custom",
    name: "custom 3",

    path: "Custom03",
    cumulativePath: "",
    category: "ButtonY",
    state: 10,
    params: {},
  },
  {
    type: "Custom",
    name: "custom 2",

    path: "Custom02",
    cumulativePath: "",
    category: "ButtonY",
    state: 10,
    params: {},
  },
];
let Lab260Data = [
  {
    type: "container",
    name: "Lab01",

    path: "Lab01",
    cumulativePath: "",
    Data: Lab01Data,
  },
  {
    type: "container",
    name: "Lab02",

    path: "Lab02",
    cumulativePath: "",
    Data: [],
  },
];
let EnigData = [
  {
    type: "container",
    name: "Lab260",

    path: "Lab260",
    cumulativePath: "",
    Data: Lab260Data,
  },
  {
    type: "container",
    name: "Lab256",

    path: "Lab256",
    cumulativePath: "",
    Data: [],
  },
];
export let test = {
  type: "container",
  path: "",
  cumulativePath: "",
  separator:"",
  Data: [
    {
      type: "container",
      name: "Enig",
      path: "ENIG",
      Data: EnigData,
    },
  ],
};
export function getCategories(obj = test) {
  return _getCategories(obj);
}
function _getCategories(obj, categories = {}, path = "") {
  let newCumulativePath = path + separator + obj.path; // trying not to update the state so often
  if (obj.cumulativePath != newCumulativePath)
    obj.cumulativePath = newCumulativePath;

  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      categories = _getCategories(element, categories, newCumulativePath);
    });
  } else {
    console.log(obj.cumulativePath);
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
function _getTypes(obj, Types = {}, path = "") {
  let newCumulativePath = path + separator + obj.path; // trying not to update the state so often
  if (obj.cumulativePath != newCumulativePath)
    obj.cumulativePath = newCumulativePath;
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      Types = _getTypes(element, Types, obj.cumulativePath);
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

function updateCumulativePath(obj, path = "") {
  let newCumulativePath = path + separator + obj.path; // trying not to update the state so often
  if (obj.cumulativePath != newCumulativePath)
    obj.cumulativePath = newCumulativePath; // trying not to update the state so often
  if (obj.type == "container") {
    obj.Data.forEach((element) => {
      updateCumulativePath(element, newCumulativePath);
    });
  }
  return obj;
}

function getElementByPath(cumulativePath = "", obj = test.Data[0]) {
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
    searchedPart = cumulativePath.substring(length(separator));

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
    const x = getElementByPath(searchedPart, newObj);
    if (x !== undefined) {
      result = x;
      return;
    }
  });

  return result;
}

function getAllDevices(obj) {
  return _getAllDevices({ ...obj });
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
