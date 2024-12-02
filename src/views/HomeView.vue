<script setup lang="ts">
import { useGlobalStore } from '@/stores/store';
import { onMounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
import type { ITicket } from '@/interfaces/ITicket';
import TicketCard from '@/components/cards/TicketCard.vue';
import AddTicket from '@/components/buttons/AddTicket.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const store = useGlobalStore();
const itemsToDisplay = ref<ITicket[]>([]);
const allItems = ref<ITicket[]>([]);

const data = ref({});

// Chart js options
const options = ref({
    responsive: true,
    maintainAspectRatio: false,
});

onMounted(async () => {
    await setData();
});

async function setData(): Promise<void> {
    await store.getColumns();
    await store.getTickets();

    const tickets: ITicket[] = Object.values(store.tickets).flat();
    allItems.value = tickets;
    const ticketsToDisplay = tickets
        .filter((x) => x.list == 'TO DO')
        .reverse()
        .slice(0, 3);
    itemsToDisplay.value = ticketsToDisplay;

    data.value = {
        labels: ['TO DO', 'Doing', 'Done'],
        datasets: [
            {
                backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                data: [
                    tickets.filter((x) => x.list == 'TO DO').length,
                    tickets.filter((x) => x.list == 'Doing').length,
                    tickets.filter((x) => x.list == 'Done').length,
                ],
            },
        ],
    };
}
</script>

<template>
    <div class="row">
        <div class="col-md-6">
            <div v-if="!itemsToDisplay.length">No tasks</div>
            <div v-else>
                <span>Last three created tasks:</span>
                <TicketCard
                    v-for="item in itemsToDisplay"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                    :description="item.description"
                    :hide-close-button="true"
                />
            </div>
            <AddTicket @item-added="setData"></AddTicket>
        </div>
        <div class="col-md-6">
            <div v-if="allItems.length">
                <Pie :data="data" :options="options" />
            </div>
        </div>
    </div>
</template>
