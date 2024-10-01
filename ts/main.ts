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
const $entriesViewElement = document.querySelector('div[data-view="entries"]');

const $headerLinks = document.querySelectorAll('.head-links');
const $headerEntry = document.querySelector('.header-entries') as HTMLElement;
const $deleteButton = document.querySelector('.delete-button');
const $modalElement = document.querySelector('dialog');
const $cancelModal = document.querySelector('.cancel-modal');
const $confirmModal = document.querySelector('.confirm-modal');

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
  const entryToSave: JournalEntry = {
    entryId: 0,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  if (data.editing === null) {
    entryToSave.entryId = data.nextEntryId++;
    data.entries.unshift(entryToSave);
    const $newLiElement = renderEntry(entryToSave);
    $entryListElement.prepend($newLiElement);
  } else {
    const entryItem: JournalEntry = data.editing;
    const entryId = entryItem.entryId;
    entryToSave.entryId = entryId;
    let entryIndex: number = -1;
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].entryId === entryId) {
        entryIndex = i;
        break;
      }
    }
    if (entryIndex >= 0) {
      data.entries[entryIndex] = entryToSave;
      const $newLiElement = renderEntry(entryToSave);
      const $liEntryReplace = document.querySelector(
        'li[data-entry-id="' + entryId + '"]',
      );
      $liEntryReplace?.replaceWith($newLiElement);
    } else {
      throw new Error('entry to edit not found');
    }
    data.editing = null;
  }
  writeData();
  resetForm();
  toggleNoEntries();
  viewSwap('entries');
});

function resetForm(): void {
  $formElement.reset();
  $entryImage.setAttribute('src', placeholderImage);
  $headerEntry.textContent = 'New Entry';
}

$deleteButton?.addEventListener('click', () => {
  $modalElement?.showModal();
});

$cancelModal?.addEventListener('click', () => {
  $modalElement?.close();
});

$confirmModal?.addEventListener('click', () => {
  if (data.editing === null) return;
  const entryItem: JournalEntry = data.editing;
  const entryId = entryItem.entryId;
  let entryIndex: number = -1;
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryId === entryId) {
      entryIndex = i;
      break;
    }
  }
  if (entryIndex >= 0) {
    data.entries.splice(entryIndex, 1);
    const $liEntryToRemove = document.querySelector(
      'li[data-entry-id="' + entryId + '"]',
    );
    $liEntryToRemove?.remove();
    data.editing = null;
    writeData();
    resetForm();
    $modalElement?.close();
    toggleNoEntries();
    viewSwap('entries');
  } else {
    throw new Error('Entry could not be found!');
  }
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

  const $editIcon = document.createElement('i');
  $editIcon.className = 'edit fa-solid fa-pencil';

  const $entryNotes = document.createElement('p');
  $entryNotes.textContent = entry.notes;

  $entry.append($entryRow);
  $entryRow.append($leftColumn, $rightColumn);
  $leftColumn.append($listImageDiv);
  $listImageDiv.append($entryImage);
  $rightColumn.append($entryTitle, $entryNotes, $editIcon);

  return $entry;
}

$entryListElement.addEventListener('click', (event: Event) => {
  const $eventTarget = event?.target as HTMLElement;
  if ($eventTarget.tagName === 'I') {
    const $clickedEntry = $eventTarget.closest('li') as HTMLElement;
    if ($clickedEntry !== null) {
      const $clickedEntryId = Number($clickedEntry.dataset.entryId);
      for (const entry of data.entries) {
        if (entry.entryId === $clickedEntryId) {
          data.editing = entry;
          // $headerEntry.textContent = 'Entries';
          prepopulateFormForEntryEdit(entry);
          viewSwap('entry-form');
          break;
        }
      }
    }
  }
});

function prepopulateFormForEntryEdit(entry: JournalEntry): void {
  formControls.title.value = entry.title;
  formControls.photoUrl.value = entry.photoUrl;
  formControls.notes.value = entry.notes;
  $entryImage.setAttribute('src', entry.photoUrl);
  $headerEntry.textContent = 'Edit Entry';
}

function toggleNoEntries(): void {
  if ($noEntriesText == null) throw new Error('failed');

  if (data.entries.length > 0) $noEntriesText.classList.add('hidden');
  else $noEntriesText.classList.remove('hidden');
}

function viewSwap(viewName: 'entries' | 'entry-form'): void {
  if (!$entryFormViewElement || !$entriesViewElement) {
    throw new Error('$entryFormView or $entriesView is null');
  }

  if (viewName === 'entries') {
    $entriesViewElement.classList.remove('hidden');
    $entryFormViewElement.classList.add('hidden');
  } else if (viewName === 'entry-form') {
    $entryFormViewElement.classList.remove('hidden');
    $entriesViewElement.classList.add('hidden');
  }
  if (data.view !== viewName) {
    data.view = viewName;
    writeData();
  }
  data.view = viewName;
}
