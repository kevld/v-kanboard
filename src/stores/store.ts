// stores/counter.js
import type { ITicket } from '@/views/BoardView.vue';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useGlobalStore = defineStore('global', {
    state: () => {
        return {
            tickets: ref<Record<string, ITicket[]>>({}),
            columns: ref<string[]>([]),
        };
    },
    actions: {
        async getColumns() {
            const response = await fetch('http://localhost:5246/api/Status');
            this.columns = await response.json();
        },

        async getTickets() {
            const response = await fetch('http://localhost:5246/api/Ticket');
            const tickets: ITicket[] = await response.json();

            this.tickets = this.columns.reduce(
                (acc, column) => {
                    acc[column] = tickets.filter((ticket) => ticket.list === column);
                    return acc;
                },
                {} as Record<string, ITicket[]>,
            );
        },

        async addTask(title: string, description: string) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Title: title,
                    Description: description,
                    StatusId: 1,
                }),
            };
            await fetch('http://localhost:5246/api/Ticket', requestOptions);
        },

        async updateTask(id: number, colName: string) {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Id: id,
                    NewStatus: colName,
                }),
            };

            await fetch('http://localhost:5246/api/Ticket', requestOptions);
        },

        async deleteTicket(id: number) {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };

            await fetch(`http://localhost:5246/api/Ticket/${id}`, requestOptions);
        },
    },
});
