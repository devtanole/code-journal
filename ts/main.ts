interface FormElements extends HTMLFormControlsCollection {
  photoUrl: HTMLInputElement;
  title: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

const $formElement = document.querySelector('#entry-form') as HTMLFormElement;
const $entryImage = document.querySelector('#entry-image') as HTMLImageElement;
const $entryListElement = document.querySelector('.entry-list');
const formControls = $formElement.elements as FormElements;
const $photoUrlElement = formControls.photoUrl;
const placeholderImage = $entryImage.getAttribute('src') || '';
const $noEntriesText = document.querySelector('#none');
const $entryFormViewElement = document.querySelector(
  'div[data-view="entry-form"]',
);
const $headerLinks = document.querySelectorAll('.head-links');

if ($formElement == null || $entryImage == null || $entryListElement == null)
  throw new Error('failed');

$photoUrlElement.addEventListener('input', (event: Event) => {
  const photoUrl = (event.target as HTMLInputElement).value;
  if (photoUrl != null) {
    $entryImage.setAttribute('src', photoUrl);
  }
});

$formElement.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const newEntry: JournalEntry = {
    entryId: data.nextEntryId++,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  data.entries.unshift(newEntry);
  writeData();
  $entryImage.setAttribute('src', placeholderImage);
  $formElement.reset();
  $entryListElement.prepend(renderEntry(newEntry));
  if (data.entries.length === 1) toggleNoEntries();
  viewSwap('entries');
});

// issue 2

document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    $entryListElement.appendChild(renderEntry(entry));
  }
  toggleNoEntries();
  viewSwap(data.view);
});

if (!$headerLinks) throw new Error('$headLinks is null');
for (const $headerLink of $headerLinks) {
  $headerLink.addEventListener('click', (event: Event) => {
    const $eventTarget = event.target as HTMLElement;
    const viewName = $eventTarget.dataset.view;
    if (viewName === 'entries' || viewName === 'entry-form') {
      viewSwap(viewName);
    }
  });
}

function renderEntry(entry: JournalEntry): HTMLLIElement {
  const $entry = document.createElement('li');
  $entry.setAttribute('data-entry-id', entry.entryId.toString());

  const $entryRow = document.createElement('div');
  $entryRow.className = 'row';

  const $leftColumn = document.createElement('div');
  $leftColumn.className = 'column-half';

  const $listImageDiv = document.createElement('div');
  $listImageDiv.className = 'image-wrap';

  const $entryImage = document.createElement('img');
  $entryImage.setAttribute('src', entry.photoUrl);

  const $rightColumn = document.createElement('div');
  $rightColumn.className = 'column-half';

  const $entryTitle = document.createElement('h2');
  $entryTitle.textContent = entry.title;

  const $entryNotes = document.createElement('p');
  $entryNotes.textContent = entry.notes;

  $entry.append($entryRow);
  $entryRow.append($leftColumn, $rightColumn);
  $leftColumn.append($listImageDiv);
  $listImageDiv.append($entryImage);
  $rightColumn.append($entryTitle, $entryNotes);

  return $entry;
}

function toggleNoEntries(): void {
  if ($noEntriesText == null) throw new Error('failed');

  if (data.entries.length > 0) $noEntriesText.classList.add('hidden');
  else $noEntriesText.classList.remove('hidden');
}

function viewSwap(viewName: 'entries' | 'entry-form'): void {
  if (!$entryFormViewElement || !$entryListElement) {
    throw new Error('$entryFormView or $entriesView is null');
  }

  if (viewName === 'entries') {
    $entryListElement.classList.remove('hidden');
    $entryFormViewElement.classList.add('hidden');
  } else if (viewName === 'entry-form') {
    $entryFormViewElement.classList.remove('hidden');
    $entryListElement.classList.add('hidden');
  }
  data.view = viewName;
}
