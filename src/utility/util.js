export const sheetDataToObject=(sheetData)=> {
    const headers = sheetData[0];
    const dataRows = sheetData.slice(1);
    const objects = dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    return objects;
  }

  export const bubbleColor = [
    "#1565C0",
    "#AD1457",
    "#2E7D32",
    "#6A1B9A",
    "#F9A825",
    "#283593",
    "#C62828",
    "#558B2F",
    "#4527A0",
    "#E65100",
    "#0277BD",
    "#9C27B0",
    "#689F38",
    "#FF6F00",
    "#00838F",
    "#7B1FA2",
    "#3E2723",
    "#00695C",
    "#5D4037",
    "#D84315",
  ];

  export const generateColorFromLetters = (letters) => {
    const sum = letters
      .toUpperCase()
      .split('')
      .reduce((accumulator, letter) => accumulator + letter.charCodeAt(0), 0);
  
    const hue = (sum * 57) % 360;
    const saturation = 60;
    const lightness = 40;
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  export const colorFromNumber = (number) => {
    const hue = (number * 64) % 360;
    const saturation = 80;
    const lightness = 40;
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

export const businessTypes = [
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Small Business', value: 'sme' },
    { label: 'Investment', value: 'investment', disabled: true },
];

export const projectTypes = [
  { label: 'Sprint', value: 'sprint' },
  { label: 'Fixed Cost', value: 'fixed', disabled: false },
  { label: 'Creative Capital', value: 'capital', disabled: true },
];

export const travelTypes = [
  { label: 'None added', value: 'none' },
  { label: 'Per Sprint', value: 'sprint' },
  { label: 'Lump Sum', value: 'lumpsum' },
];

export const phaseTravelTypes = [
  { label: 'None added', value: 'none' },
  { label: 'Per Phase', value: 'sprint' },
  { label: 'Lump Sum', value: 'lumpsum' },
];

export const billCycleTypes = [
  { label: 'Sprint Start', value: 'start' },
  { label: 'Sprint End', value: 'end' },
];

export const discountTypes = [
  { label: 'none', value: false },
  { label: 'To Team Costs only', value: 'team' },
  { label: 'To Team Costs & Travel + Research', value: 'total' },
];

export const sprintDuration = 14;
export const sprintWorkDuration = 10;
export const dateFormat = 'DD/MM/YYYY';

export const range = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export const currencies = [
  {label: 'Australian Dollar (AUD)', value: 'USDAUD'},
  {label: 'British Pound (GBP)', value: 'USDGBP'},
  {label: 'Canadian Dollar (CAD)', value: 'USDCAD'},
  {label: 'New Zealand Dollar (NZD)', value: 'USDNZD'},
  {label: 'United States Dollar (USD)', value: 'USDUSD'},
];

export const currencySYmbols = {
USDUSD:  '$',
USDGBP: '£',
USDCAD: 'C$',
USDNZD: '$NZ',
USDAUD: 'A$'
}