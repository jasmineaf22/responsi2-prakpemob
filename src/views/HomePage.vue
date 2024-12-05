<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Toys List</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="toys in activeToyss"
            :key="toys.id"
            ref="setItemRef(toys.id)"
          >
            <ion-item>
              <div class="clickable-zone" @click="showToysDetail(toys)">
                <ion-card class="full-width-card">
                  <ion-card-header>
                    <ion-card-title>{{ toys.nama }}</ion-card-title>
                    <ion-card-subtitle>{{
                      toys.cerita
                    }}</ion-card-subtitle>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-badge color="primary">{{
                      getRelativeTime(toys.updatedAt)
                    }}</ion-badge>
                  </ion-card-content>
                </ion-card>
              </div>
            </ion-item>

            <!-- Slide Right to Edit -->
            <ion-item-options side="start">
              <ion-item-option color="primary" @click="handleEdit(toys)">
                <ion-icon :icon="create" slot="start"></ion-icon>
                Edit
              </ion-item-option>
            </ion-item-options>

            <!-- Slide Left to Delete -->
            <ion-item-options side="end">
              <ion-item-option color="danger" @click="confirmDelete(toys)">
                <ion-icon :icon="trash" slot="start"></ion-icon>
                Delete
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item v-if="activeToyss.length === 0" class="ion-text-center">
            <ion-label
              >There's nothing yet, start to add your own toys!</ion-label
            >
          </ion-item>
        </ion-list>

        <!-- Detail Modal -->
        <ion-modal
          :is-open="isDetailModalOpen"
          @didDismiss="isDetailModalOpen = false"
        >
          <ion-header>
            <ion-toolbar>
              <ion-title>{{ selectedToys?.nama }}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="isDetailModalOpen = false">
                  <ion-icon :icon="close"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ selectedToys?.nama }}</ion-card-title>
                <ion-card-subtitle>{{
                  selectedToys?.cerita
                }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p>
                  Last updated: {{ getRelativeTime(selectedToys?.updatedAt) }}
                </p>
              </ion-card-content>
            </ion-card>
          </ion-content>
        </ion-modal>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :toys="toys"
        @submit="handleSubmit"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline,
} from "ionicons/icons";
import InputModal from "@/components/InputModal.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { firestoreService, type Toys } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";
import { alertController } from "@ionic/vue";
import { IonModal, IonButtons, IonButton } from "@ionic/vue";

const isDetailModalOpen = ref(false); // Controls modal visibility
const selectedToys = ref<Toys | null>(null); // Stores the selected toys

const showToysDetail = (toys: Toys) => {
  selectedToys.value = toys;
  isDetailModalOpen.value = true;
};

const confirmDelete = async (toys: Toys) => {
  const alert = await alertController.create({
    header: "Confirm Delete",
    message: `Are you sure you want to delete the toys ${toys.nama}`,
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
        handler: () => {
          console.log("Delete canceled");
        },
      },
      {
        text: "Delete",
        role: "destructive",
        handler: async () => {
          await handleDelete(toys);
        },
      },
    ],
  });
  await alert.present();
};

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const toyss = ref<Toys[]>([]);
const toys = ref<Omit<Toys, "id" | "createdAt" | "updatedAt" | "status">>({
  nama: "",
  cerita: ""
});
const activeToyss = computed(() =>
  toyss.value.filter((toys) => !toys.status)
);
const completedToyss = computed(() =>
  toyss.value.filter((toys) => toys.status)
);
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// mendapatkan value dari item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// toast notifikasi
const showToast = async (
  message: string,
  color: string = "success",
  icon: string = checkmarkCircle
) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "top",
    icon,
  });
  await toast.present();
};

// mendapatkan perbedaan waktu
const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

const loadToyss = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: "Loading...",
    });
    await loading.present();
  }

  try {
    toyss.value = await firestoreService.getGlobalToyss();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// dijalankan setiap halaman diload, load data dan set interval update 1 menit
onMounted(() => {
  loadToyss();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

// reset interval update
onUnmounted(() => {
  clearInterval(intervalId);
});

// handle swipe refresher
const handleRefresh = async (event: any) => {
  try {
    await loadToyss(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

// handle submit add/edit pada modal
const handleSubmit = async (
  toys: Omit<Toys, "id" | "createdAt" | "updatedAt" | "status">
) => {
  if (!toys.nama) {
    await showToast("Title is required", "warning", warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateToys(editingId.value, toys as Toys);
      await showToast(
        "Toys updated successfully",
        "success",
        checkmarkCircle
      );
    } else {
      await firestoreService.addToysGlobal(toys as Toys);
      await showToast("Toys added successfully", "success", checkmarkCircle);
    }
    loadToyss();
  } catch (error) {
    await showToast("An error occurred", "danger", closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

const handleEdit = async (editToys: Toys) => {
  const slidingItem = itemRefs.value.get(editToys.id!);
  await slidingItem?.close();

  editingId.value = editToys.id!;
  toys.value = {
    nama: editToys.nama,
    cerita: editToys.cerita
  };
  isOpen.value = true;
};

// handle delete click/swipe
const handleDelete = async (deleteToys: Toys) => {
  try {
    await firestoreService.deleteToys(deleteToys.id!);
    await showToast("Toys deleted successfully", "success", checkmarkCircle);
    loadToyss();
  } catch (error) {
    await showToast("Failed to delete toys", "danger", closeCircle);
    console.error(error);
  }
};

const handleStatus = async (statusToys: Toys) => {
  const slidingItem = itemRefs.value.get(statusToys.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusToys.id!, !statusToys.status);
    await showToast(
      `Toys marked as ${!statusToys.status ? "completed" : "active"}`,
      "success",
      checkmarkCircle
    );
    loadToyss();
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
</script>

<!-- modifikasi src/views/HomePage.vue tambahkan keseluruhan style -->
<style scoped>
ion-accordion-group {
  width: 100%;
}

ion-card {
  margin: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

ion-card-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #000;
}

ion-card-subtitle {
  color: #666;
  font-size: 0.9em;
}

ion-badge {
  margin-top: 8px;
  font-size: 0.8em;
  padding: 6px;
  border-radius: 12px;
}

ion-fab {
  margin: 25px;
}

.limited-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

ion-card-title.limited-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

ion-card-subtitle.limited-text {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.full-width-card {
  width: 100%;
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

ion-item {
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --padding-start: 0;
}

.scrollable-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-container {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
