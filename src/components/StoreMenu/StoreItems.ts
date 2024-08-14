export type StoreItemType = {
  id: number;
  category: string;
  name: string;
  description: string;
  prerequisite: string[];
  cost: number[];
  acquired: number;
};

export const StoreItems: StoreItemType[] = [
  // ---------- CLIMODULE ----------
  {
    id: 0,
    category: "CLIMODULECLIMODULE",
    name: "Basic Movement",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "CLIMODULE",
    name: "Auto Complete",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "CLIMODULE",
    name: "Help Command",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "CLIMODULE",
    name: "Command History",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  // ---------- GUI ----------
  {
    id: 0,
    category: "GUI",
    name: "Basic Buttons",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  // ---------- SENSOR ----------
  {
    id: 0,
    category: "Sensor",
    name: "Radius",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Sensor",
    name: "Auto Refresh Rate",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Sensor",
    name: "Detect Objects",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  // ---------- MAP ----------
  {
    id: 0,
    category: "Map",
    name: "Current Location",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Map",
    name: "Direction",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Map",
    name: "Add Wall on Click",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Map",
    name: "Auto add Wall on Wall Bump",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  // ---------- CAMERA ----------
  {
    id: 0,
    category: "Camera",
    name: "Number of Rays",
    description: "",
    prerequisite: [],
    cost: [100, 200, 300],
    acquired: 0,
  },
  {
    id: 0,
    category: "Camera",
    name: "FoV",
    description: "",
    prerequisite: [],
    cost: [100, 200],
    acquired: 0,
  },
  {
    id: 0,
    category: "Camera",
    name: "Distance",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Camera",
    name: "Color",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Camera",
    name: "Auto Refresh Rate",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "Camera",
    name: "KB+M Integration",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  // ---------- ROB-I ----------
  {
    id: 0,
    category: "ROB-I",
    name: "Move Speed",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "ROB-I",
    name: "Turn Speed",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "ROB-I",
    name: "Durability",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
  {
    id: 0,
    category: "ROB-I",
    name: "Fuel Capacity",
    description: "",
    prerequisite: [],
    cost: [100],
    acquired: 0,
  },
];

bruh: for (let i = 0; i < StoreItems.length - 1; i++) {
  for (let j = i + 1; j < StoreItems.length - 1; j++) {
    if (StoreItems[i].id == StoreItems[j].id) {
      console.error("bruh (there are duplicate ids on StoreItems)");
      break bruh;
    }
  }
}

export enum Categories {
  CLIModule,
}

export const getCurrentUpgrade = (
  upgradeCategory: Categories,
  upgradeName: string
): number => {
  //console.log(upgradeCategory + " " + upgradeName);

  return 0;
};
