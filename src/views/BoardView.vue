<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import Card from '@/components/cards/TicketCard.vue';
import * as bootstrap from 'bootstrap';
import { useGlobalStore } from '@/stores/store';

export interface ITicket {
    id: number;
    title: string;
    description: string;
    list: string;
}
const store = useGlobalStore();
const items = ref<ITicket[]>([]);
const title = ref<string>('');
const description = ref<string>('');

onMounted(async () => {
    await store.getColumns();

    await store.getTickets();
    items.value = [...store.tickets];
});

function getTicketsByColumnName(colName: string): ITicket[] {
    return items.value.filter((ticket) => ticket.list === colName);
}

async function onAdd(event: any) {
    if (event.from.dataset['col'] != event.to.dataset['col']) {
        const id: number = event.item.dataset['id'];
        const item = items.value.filter((x) => x.id == id)[0];
        item.list = event.to.dataset['col'];

        items.value = [...items.value.filter((x) => x.id != id), item];

        await store.updateTask(item.id, item.list);

        await store.getTickets();
        items.value = [...store.tickets];
    }
}

async function addTask() {
    await store.addTask(title.value, description.value);

    await store.getTickets();
    items.value = [...store.tickets];

    const modalElement = document.getElementById('modal') as HTMLElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
}

async function deleteTicket(ticketId: number) {
    await store.deleteTicket(ticketId);

    await store.getTickets();
    items.value = [...store.tickets];
}
</script>

<template>
    <div class="row">
        <div class="col" v-for="column in store.columns" :key="column">
            <h2>{{ column }}</h2>
            <draggable
                :model-value="getTicketsByColumnName(column)"
                :data-col="column"
                tag="div"
                :group="{ name: column, pull: true, put: true }"
                item-key="id"
                :multi-drag="true"
                @add="onAdd"
            >
                <template #item="{ element: item }">
                    <div :data-id="item.id">
                        <Card
                            :id="item.id"
                            :title="item.title"
                            :description="item.description"
                            @delete="deleteTicket"
                        />
                    </div>
                </template>
            </draggable>

            <button
                v-if="column == 'TO DO'"
                class="btn btn-primary w-100 mt-4"
                data-bs-toggle="modal"
                data-bs-target="#modal"
            >
                <i class="bi bi-plus"></i>
            </button>
        </div>
    </div>

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
