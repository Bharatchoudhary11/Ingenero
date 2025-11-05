export type ElectrolyzerMeta = {
  id: number;
  tag: string;
  status: string;
  location: string;
  installed: string;
};

export type ElementPart = {
  position: number;
  id: string;
  name: string;
  criticality: "High" | "Medium" | "Low";
};

export const electrolyzers: ElectrolyzerMeta[] = [
  {
    id: 6310,
    tag: "ELY-6310",
    status: "Idle • Awaiting inspection",
    location: "Assembly Line A",
    installed: "09 Feb 2024"
  },
  {
    id: 6345,
    tag: "ELY-6345",
    status: "In diagnostics loop",
    location: "Assembly Line B",
    installed: "12 Mar 2024"
  },
  {
    id: 6350,
    tag: "ELY-6350",
    status: "Assembly pending",
    location: "Assembly Line C",
    installed: "18 Mar 2024"
  },
  {
    id: 6388,
    tag: "ELY-6388",
    status: "Repair backlog • 2 items",
    location: "Maintenance Bay",
    installed: "26 Mar 2024"
  },
  {
    id: 6392,
    tag: "ELY-6392",
    status: "Quality check next",
    location: "QA Cell",
    installed: "31 Mar 2024"
  }
];

export const elementParts: ElementPart[] = [
  { position: 1, id: "TC080", name: "Thermal Coupler Clamp", criticality: "High" },
  { position: 2, id: "1869", name: "Cathode Housing Ring", criticality: "High" },
  { position: 3, id: "BR307", name: "Buffer Rod", criticality: "Medium" },
  { position: 4, id: "2765", name: "Hydrogen Gasket", criticality: "High" },
  { position: 5, id: "BR-165", name: "Buffer Rod (Short)", criticality: "Medium" },
  { position: 6, id: "1716", name: "Alignment Stud", criticality: "Low" },
  { position: 7, id: "2013", name: "Seal Spacer", criticality: "Medium" },
  { position: 8, id: "2015", name: "Seal Spacer (Wide)", criticality: "Medium" },
  { position: 9, id: "2329", name: "Hydrogen Channel Plate", criticality: "High" },
  { position: 10, id: "2341", name: "Hydrogen Box Cover", criticality: "High" },
  { position: 11, id: "1863", name: "Catholyte Valve Insert", criticality: "High" },
  { position: 12, id: "BR-201", name: "Buffer Rod (Long)", criticality: "Medium" },
  { position: 13, id: "TA-134", name: "Torque Adapter", criticality: "Low" }
];

export const repairChecklistItems: string[] = [
  "Anolyte Leaker",
  "Catholyte Leaker",
  "1-1.5\" Nozzle",
  "2\" Nozzle",
  "4\" Nozzle",
  "8\" Nozzle",
  "Cathode screens",
  "Cathode perimeter screens",
  "Gasket surface",
  "Dye-Check Coupling",
  "Outside Steel",
  "Hydrogen Chamber",
  "Hydrogen Box",
  "Hydrogen Channel",
  "Anode Studs / Alignment"
];
