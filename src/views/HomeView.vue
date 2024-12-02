<script setup lang="ts">
import Card from '@/components/cards/TicketCard.vue';
import { useGlobalStore } from '@/stores/store';
import { onMounted, ref } from 'vue';
import type { ITicket } from './BoardView.vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
ChartJS.register(ArcElement, Tooltip, Legend);
const store = useGlobalStore();
const itemsToDisplay = ref<ITicket[]>([]);
const allItems = ref<ITicket[]>([]);

const data = ref({});
const options = ref({
    responsive: true,
    maintainAspectRatio: false,
});

onMounted(async () => {
    await store.getColumns();

    await store.getTickets();
    const tickets = [...store.tickets] as ITicket[];
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
});
</script>

<template>
    <div class="row">
        <div class="col-md-6">
            <div v-if="!itemsToDisplay.length">No tasks</div>
            <div v-else>
                <span>Last three created tasks:</span>
                <Card
                    v-for="item in itemsToDisplay"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                    :description="item.description"
                    :hide-close-button="true"
                />
            </div>
        </div>
        <div class="col-md-6">
            <div v-if="allItems.length">
                <Pie :data="data" :options="options" />
            </div>
        </div>
    </div>
</template>
