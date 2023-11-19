
import init from "react_native_mqtt";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export let client = new Paho.MQTT.Client("", 1, "");

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




