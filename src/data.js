


const separator = "/";

//// LAB264 STATIC
let Lab07Data = [
  {
    type: "Button",
    name: "Light Control",
    path: "LightControl",
    cumulativePath: "",
    category: "Lights",
    state: false,
    params: {
      onMessage: "LightOn",
      offMessage: "LightOff",
    },
  },
  {
    type: "Button",
    name: "Fan Control",
    path: "Fan",
    cumulativePath: "",
    category: "Fans",
    state: false,
    params: {
      onMessage: "FanOn",
      offMessage: "FanOff",
    },
  },
  {
    type: "Slider",
    name: "Pressure Control",
    path: "PressureControl",
    cumulativePath: "",
    category: "Pressure",
    state: 0,
    params: {
      minValue: 0,
      maxValue: 10,
    },
  },{
    type: "Button",
    name: "Door Control",
    path: "Door",
    cumulativePath: "",
    category: "Doors",
    state: false,
    params: {
      onMessage: "DoorOpen",
      offMessage: "DoorClose",
    },
  },
]

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
let Lab264Data = [
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
  {
    type: "container",
    name: "Lab07",

    path: "Lab07",
    cumulativePath: "",
    Data: Lab07Data,
  },
];
let EnigData = [
  {
    type: "container",
    name: "Lab264",

    path: "Lab264",
    cumulativePath: "",
    Data: Lab264Data,
  },
  {
    type: "container",
    name: "Lab256",

    path: "Lab256",
    cumulativePath: "",
    Data: [],
  },
];


let Lab264StaticData = [
  {
    type: "container",
    name: "Lab02",
    path: "Lab02",
    cumulativePath: "",
    Data: [],
    redirect:true,
  },
  {
    type: "container",
    name: "Lab07",
    path: "Lab07",
    cumulativePath: "",
    Data: [],
    redirect:true,
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
    {
      type: "container",
      name: "Lab264 : static labs",
      path: "ENIG/Lab264",
      Data: Lab264StaticData,
      redirect:true,
    },
  ],
};




