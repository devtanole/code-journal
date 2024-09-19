'use strict';
const $formElement = document.querySelector('#entry-form');
const $entryImage = document.querySelector('#entry-image');
if ($formElement == null || $entryImage == null)
  throw new Error('image has failed');
const formControls = $formElement.elements;
const $photoUrlElement = formControls.photoUrl;
const placeholderImage = $entryImage.getAttribute('src') || '';
const $noEntriesText = document.querySelector('#none');
const $entryListElement = document.querySelector('.entry-list');
const $entryFormViewElement = document.querySelector(
  'div[data-view="entry-form"]',
);
if ($formElement == null || $entryImage == null || $entryListElement == null)
  throw new Error('failed');
$photoUrlElement.addEventListener('input', (event) => {
  const photoUrl = event.target.value;
  if (photoUrl != null) {
    $entryImage.setAttribute('src', photoUrl);
  }
});
$formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const newEntry = {
    entryId: data.nextEntryId++,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  data.entries.unshift(newEntry);
  writeData();
  $entryImage.setAttribute('src', placeholderImage);
  $formElement.reset();
});
// issue 2
document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    $entryListElement.appendChild(renderEntry(entry));
  }
  // toggleNoEntries();
  //viewSwap(data.view);
});
function renderEntry(entry) {
  const $entry = document.createElement('li');
  $entry.setAttribute('data-entry-id', entry.entryId.toString());
  const $entryRow = document.createElement('div');
  $entryRow.className = 'row';
  const $leftColumn = document.createElement('div');
  $leftColumn.className = 'column-half';
  const $listImageDiv = document.createElement('div');
  $listImageDiv.className = 'image';
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
