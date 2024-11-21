<template>
  <ion-page>
    <ion-content>
      <div class="flex flex-col justify-center h-[80%]">
        <div class="flex justify-center w-full">
          <ion-icon class="text-[64px]" :icon="personAddOutline" />
        </div>
        <ion-card>
          <ion-card-content>
            <ion-card-subtitle>
              <ion-back-button class="w-fit mb-2 font-normal" default-href="/login" />
            </ion-card-subtitle>
            <ion-card-title> Create an Account </ion-card-title>
            <form>
              <ion-input
                ref="emailInput"
                v-model="email"
                label="Email"
                label-placement="stacked"
                type="email"
                inputmode="email"
                helper-text=" "
                :error-text="emailErrorText"
                @ion-blur="resetValidationAndMarkTouched"
              />
              <ion-input
                ref="passwordInput"
                v-model="password"
                label="Password"
                label-placement="stacked"
                type="password"
                inputmode="text"
                helper-text=" "
                :error-text="passwordErrorText"
                @ion-blur="resetValidationAndMarkTouched"
              />
              <ion-input
                ref="passwordConfirmInput"
                v-model="passwordConfirm"
                label="Confirm Password"
                label-placement="stacked"
                type="password"
                inputmode="text"
                helper-text=" "
                :error-text="passwordConfirmErrorText"
                @ion-blur="resetValidationAndMarkTouched"
              />
            </form>
            <ion-button class="mt-2" expand="block" @click="handleSubmit"> Submit </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import pb from '@/util/pocketbase';
import { markInvalid, resetValidationAndMarkTouched } from '@/util/validation';
import {
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonPage,
  loadingController,
  toastController,
  useIonRouter
} from '@ionic/vue';
import { personAddOutline } from 'ionicons/icons';
import { ref } from 'vue';

const router = useIonRouter();

const emailInput = ref({} as InstanceType<typeof IonInput>);
const passwordInput = ref({} as InstanceType<typeof IonInput>);
const passwordConfirmInput = ref({} as InstanceType<typeof IonInput>);

const email = ref('');
const emailErrorText = ref('');

const password = ref('');
const passwordErrorText = ref('');

const passwordConfirm = ref('');
const passwordConfirmErrorText = ref('');

const handleSubmit = async () => {
  const loading = await loadingController.create({ message: 'Loading' });
  loading.present();

  pb.collection('users')
    .create({ email: email.value, password: password.value, passwordConfirm: passwordConfirm.value })
    .then(async () => {
      router.back();
      const toast = await toastController.create({
        message: 'Account successfully created!',
        duration: 1500,
        color: 'success',
        position: 'bottom'
      });

      await toast.present();
    })
    .catch((err) => {
      if (err.data.code != 400) return;

      const errorFields = err.data.data;

      if (errorFields.email) {
        emailErrorText.value = errorFields.email.message;
        markInvalid(emailInput.value.$el);
      }

      if (errorFields.password) {
        passwordErrorText.value = errorFields.password.message;
        markInvalid(passwordInput.value.$el);
      }

      if (errorFields.passwordConfirm) {
        passwordConfirmErrorText.value = errorFields.passwordConfirm.message;
        markInvalid(passwordConfirmInput.value.$el);
      }
    })
    .finally(() => {
      loadingController.dismiss();
    });
};
</script>
