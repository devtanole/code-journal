interface JournalEntry {
  title: string;
  photoUrl: string;
  notes: string;
  entryId: number;
}

interface Data {
  view: 'entries' | 'entry-form';
  entries: JournalEntry[];
  editing: null | JournalEntry;
  nextEntryId: number;
}

const dataKey = 'code-journal-data';

const data = readData();

function readData(): Data {
  let data: Data;
  const localData = localStorage.getItem(dataKey);
  if (localData) {
    data = JSON.parse(localData) as Data;
  } else {
    data = {
      view: 'entry-form',
      entries: [],
      editing: null,
      nextEntryId: 1,
    };
  }
  return data;
}

function writeData(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(dataKey, dataJSON);
}
