<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import TicketCard from '@/components/cards/TicketCard.vue';
import { useGlobalStore } from '@/stores/store';
import AddTicket from '@/components/buttons/AddTicket.vue';

const store = useGlobalStore();

onMounted(async () => {
    await store.getColumns();

    await store.getTickets();
});

async function onAdd(event: any) {
    if (event.from.dataset['col'] != event.to.dataset['col']) {
        const id: number = event.item.dataset['id'];
        const item = store.tickets[event.from.dataset['col']].filter((x) => x.id == id)[0];
        item.list = event.to.dataset['col'];

        await store.updateTask(item.id, item.list);

        await store.getTickets();
    }
}

async function deleteTicket(ticketId: number) {
    await store.deleteTicket(ticketId);

    await store.getTickets();
}
</script>

<template>
    <div class="row">
        <div class="col" v-for="column in store.columns" :key="column">
            <h2>{{ column }}</h2>
            <draggable
                :model-value="store.tickets[column]"
                :data-col="column"
                tag="div"
                :group="{ name: column, pull: true, put: true }"
                item-key="id"
                :multi-drag="true"
                @add="onAdd"
            >
                <template #item="{ element: item }">
                    <div :data-id="item.id">
                        <TicketCard
                            :id="item.id"
                            :title="item.title"
                            :description="item.description"
                            @delete="deleteTicket"
                        />
                    </div>
                </template>
            </draggable>
            <AddTicket v-if="column == 'TO DO'"></AddTicket>
        </div>
    </div>
</template>
