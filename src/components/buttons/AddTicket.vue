<script setup lang="ts">
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';
import { useGlobalStore } from '@/stores/store';

const store = useGlobalStore();

const title = ref<string>('');
const description = ref<string>('');

const emit = defineEmits(['item-added']);

async function addTask() {
    await store.addTask(title.value, description.value);

    await store.getTickets();

    const modalElement = document.getElementById('modal') as HTMLElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
    emit('item-added');
}
</script>
<template>
    <button class="btn btn-primary w-100 mt-4" data-bs-toggle="modal" data-bs-target="#modal">
        <i class="bi bi-plus"></i>
    </button>

    <div id="modal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter une tâcher</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="titre" class="form-label">Titre</label>
                            <input type="text" class="form-control" id="titre" v-model="title" />
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input
                                type="text"
                                class="form-control"
                                id="description"
                                v-model="description"
                            />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" @click="addTask">Ajouter</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.w-100 {
    width: 100%;
}
</style>
