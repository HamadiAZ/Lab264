const Lab01Data = [
  {
    type: "Button",
    name: "Button 1",
    separator: "/",
    path: "Button01",
    category: "ButtonX",
    Params: {
      onMessage: "On",
      offMessage: "Off",
    },
  },
  {
    type: "Button",
    name: "Button 2",
    separator: "/",
    path: "Button02",
    category: "ButtonY",
    Params: {
      onMessage: "On",
      offMessage: "Off",
    },
  },
  {
    type: "Slider",
    name: "Slider 1",
    separator: "/",
    path: "Slider01",
    category: "ButtonY",
    Params: {
      value: 10,
      minValue: 1,
      maxValue: 200,
    },
  },
];
const Lab260Data = [
  {
    type: "container",
    name: "Lab01",
    separator: "/",
    path: "Lab01",
    Data: Lab01Data,
  },
  {
    type: "container",
    name: "Lab02",
    separator: "/",
    path: "Lab02",
    Data: [],
  },
];
const EnigData = [
  {
    type: "container",
    name: "Lab260",
    separator: "/",
    path: "Lab260",
    Data: Lab260Data,
  },
  {
    type: "container",
    name: "Lab256",
    separator: "/",
    path: "Lab256",
    Data: [],
  },
];
export const test = {
  type: "container",
  path: "",
  separator: "",
  Data: [
    {
      type: "container",
      name: "Enig",
      separator: "/",
      path: "ENIG",
      Data: EnigData,
    },
  ],
};
export function getCategories(obj){
    var newObj={...test};
    return _getCategories(newObj);
}
 function _getCategories(obj, categories = {},path="") {
    if (obj.type == "container") {
        path+=obj.separator+obj.path;
      obj.Data.forEach((element) => {
        categories = _getCategories(element, categories,path);
      });
    } else {
        obj.path=path+obj.separator+obj.path
      if (categories[obj.category] == undefined) {
        categories[obj.category] = [obj];
      } else {
        categories[obj.category].push(obj);
      }
    }
    return categories;
  }

  export function getTypes(obj){
    return _getTypes(obj);
  }
  function _getTypes(obj, Types = {},path="") {
    if (obj.type == "container") {
        path+=obj.separator+obj.path;
      obj.Data.forEach((element) => {
        Types = _getTypes(element, Types,path);
      });
    } else {
        obj.path=path+obj.separator+obj.path
      if (Types[obj.type] == undefined) {
        Types[obj.type] = [obj];
      } else {
        Types[obj.type].push(obj);
      }
    }
    return Types;
  }
