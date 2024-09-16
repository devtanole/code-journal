interface FormElements extends HTMLFormControlsCollection {
  photoUrl: HTMLInputElement;
  title: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

const $formElement = document.querySelector('#entry-form') as HTMLFormElement;
const $entryImage = document.querySelector('#entry-image') as HTMLImageElement;
if ($formElement == null || $entryImage == null)
  throw new Error('image has failed');
const formControls = $formElement.elements as FormElements;
const $photoUrlElement = formControls.photoUrl;
// const placeholderImage = $entryImage.getAttribute('src') || ''; //

$photoUrlElement.addEventListener('input', (event: Event) => {
  const photoUrl = (event.target as HTMLInputElement).value;
  if (photoUrl != null) {
    $entryImage.setAttribute('src', photoUrl);
  }
});
