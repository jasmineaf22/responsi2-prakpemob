<!-- src/components/InputModal.vue -->
<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? 'Edit' : 'Add' }} Recipe List</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="cancel"><ion-icon :icon="close"></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input v-model="localRecipe.title" label="Title" label-placement="floating"
                    placeholder="Enter the Name of Your Creation"></ion-input>
            </ion-item>
            <ion-item>
                <ion-textarea v-model="localRecipe.description" label="Description" label-placement="floating"
                    placeholder="Step-by-step to make it..." :autogrow="true" :rows="3"></ion-textarea>
            </ion-item>
            <ion-row>
                <ion-col>
                    <ion-button type="button" @click="input" shape="round" color="primary" expand="block">
                        {{ editingId ? 'Edit' : 'Add' }} Recipe
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>
<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonInput, IonRow, IonCol, IonItem, IonContent, IonTextarea } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Recipe } from '@/utils/firestore';
import { ref } from 'vue';
import { watch } from 'vue';

const props = defineProps<{
    isOpen: boolean,
    editingId: string | null,
    recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'status'>
}>();

const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:editingId': [value: string | null],
    'submit': [item: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'status'>]
}>();

const localRecipe = ref({ ...props.recipe });

const cancel = () => {
  emit('update:isOpen', false);
  emit('update:editingId', null);
  localRecipe.value = { title: '', description: '' };
};

const input = () => {
  emit('submit', localRecipe.value);
  cancel();
};

watch(
  () => props.recipe,
  (newRecipe) => {
    localRecipe.value = { ...newRecipe };
  }
);

</script>