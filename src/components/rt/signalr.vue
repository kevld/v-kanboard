<script setup lang="ts">
import hub from '@/services/signalr';
import { onMounted, onUnmounted, ref } from 'vue';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const data = ref({});

const dataArr: number[] = [];
const labelArr: number[] = [];
let currentReceived: number = 0;

// Chart js options
const options = ref({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1, // Durée de l'animation en millisecondes (ici 1 seconde)
        easing: 'linear', // Fonction d'easing (autres options: 'linear', 'easeInOutQuad', etc.)
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
});

function setChartData(): void {
    if (hub.connectionId) {
        hub.on('ReceiveRandomNumber', (n: number) => {
            console.log(n);

            dataArr.push(n);
            currentReceived++;
            labelArr.push(currentReceived);

            data.value = {
                legend: {
                    display: false,
                },
                labels: labelArr.slice(-20),
                datasets: [
                    {
                        label: 'Received data',
                        backgroundColor: '#6f42c1',
                        data: dataArr.slice(-20),
                    },
                ],
            };
        });
    }
}

onMounted(() => {
    if (!hub || !hub.connectionId) {
        hub.start()
            .then(() => {
                console.log('SignalR connected');
                setChartData();
            })
            .catch((error) => console.error('Error SignalR :', error));
    }
});

onUnmounted(() => {
    if (hub.connectionId) {
        hub.stop();
    }
});
</script>

<template>
    <h3>Receiving real time data</h3>
    <div v-if="data.labels">
        <Line :data="data" :options="options" />
    </div>
    <!-- <Bar :data="data" :options="options" /> -->
</template>
