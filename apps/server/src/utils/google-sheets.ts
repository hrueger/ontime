import { GoogleSpreadsheet } from 'google-spreadsheet';
import { config } from 'dotenv';
import { OntimeRundown, SheetsSyncSettings } from 'ontime-types';
config();

const idStart = 0x4f7b15;

const genId = (i: number) => {
  return (idStart + i * 70).toString(16).toLowerCase();
};

export async function getSheetRundownData(settings: SheetsSyncSettings) {
  const doc = new GoogleSpreadsheet(settings.sheetId, { apiKey: settings.apiKey });

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[settings.sheetName];
  await sheet.loadCells('A1:Z1000');

  const fieldIdRow = 3;
  const fieldIdRowIndex = fieldIdRow - 1;

  type FieldTypes = {
    cue: number | string;
    subtitle: number | string;
    timeStart: Date;
    timeEnd: Date;
    duration: Date;
    presenter: string;
    title: string;
    note: string;
    colour: string;
    department: string;
    user0: string;
    user1: string;
    user2: string;
    user3: string;
    user4: string;
    user5: string;
    user6: string;
    user7: string;
    user8: string;
    user9: string;
  };

  const fieldNames = [];

  const columnCount = sheet.columnCount;
  for (let i = 0; i < columnCount; i++) {
    const cell = sheet.getCell(fieldIdRowIndex, i);
    const value = cell.value;
    fieldNames[i] = value;
  }

  const contentStartingAtRow = 5;
  const contentStartingAtRowIndex = contentStartingAtRow - 1;

  const data: FieldTypes[] = [];

  for (let i = contentStartingAtRowIndex; i < sheet.rowCount; i++) {
    const row = {} as FieldTypes;
    for (let j = 0; j < columnCount; j++) {
      const cell = sheet.getCell(i, j);
      const value = cell.value;
      const fieldName = fieldNames[j];
      const convertValue = (value: any) => {
        if (['timeStart', 'timeEnd', 'duration'].includes(fieldName)) {
          return new Date(value * 24 * 60 * 60 * 1000);
        }
        return value;
      };
      row[fieldNames[j]] = convertValue(value);
    }
    data.push(row);
  }

  const departments = ['Licht', 'Ton', 'Video', 'Bühne'];
  const departmentFields = ['subtitle', 'notes'];

  const allDepartmentFieldKeys = departments
    .map((department) => departmentFields.map((field) => `${department}[${field}]`))
    .flat();

  const newData: FieldTypes[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.department === '-') {
      item.department = '';
    }
    newData.push(item);
    if (!item.department) {
      for (const department of departments) {
        for (const field of departmentFields) {
          const key = `${field}[${department}]`;
          if (item[key]) {
            newData.push({
              ...item,
              department,
              subtitle: item[key],
              note: item[key],
              ...allDepartmentFieldKeys.reduce((acc, key) => {
                acc[key] = null;
                return acc;
              }, {}),
            });
          }
        }
      }
    }
  }

  for (const department of departments) {
    const events = newData.filter((item) => item.department === department);
    // order by timeStart and cut off end when next event starts
    const orderedEvents = events.sort((a, b) => a.timeStart.getTime() - b.timeStart.getTime());
    for (let i = 0; i < orderedEvents.length; i++) {
      const event = orderedEvents[i];
      const nextEvent = orderedEvents[i + 1];
      if (nextEvent && event.timeEnd.getTime() > nextEvent.timeStart.getTime()) {
        event.timeEnd = nextEvent.timeStart;
        event.duration = new Date(event.timeEnd.getTime() - event.timeStart.getTime());
      }
    }
  }

  return newData.map((item, i) => {
    return {
      id: genId(i),
      cue: item.cue?.toString() || '',
      title: item.title,
      subtitle: item.subtitle?.toString(),
      presenter: item.presenter,
      department: item.department,
      note: item.note,
      endAction: 'none',
      timerType: 'count-down',
      timeStart: item.timeStart.getTime(),
      timeEnd: item.timeEnd.getTime(),
      duration: item.duration.getTime(),
      skip: false,
      colour: item.colour,
      user0: item.user0,
      user1: item.user1,
      user2: item.user2,
      user3: item.user3,
      user4: item.user4,
      user5: item.user5,
      user6: item.user6,
      user7: item.user7,
      user8: item.user8,
      user9: item.user9,
      type: 'event',
      revision: 0,
    };
  }) as OntimeRundown;
}
