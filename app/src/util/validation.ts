import { IonInputCustomEvent } from '@ionic/core';

export const resetValidationAndMarkTouched = (event: IonInputCustomEvent<FocusEvent>) => {
  const element = event.currentTarget as HTMLElement;
  removeInvalid(element);
  markTouched(event);
};

const markTouched = (event: IonInputCustomEvent<FocusEvent>) => {
  const element = event.currentTarget as HTMLElement;
  element.classList.add('ion-touched');
};

export const markInvalid = (e: HTMLElement) => {
  e.classList.add('ion-invalid');
};

export const removeInvalid = (e: HTMLElement) => {
  e.classList.remove('ion-invalid');
};
