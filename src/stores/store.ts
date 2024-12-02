// stores/counter.js
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useGlobalStore = defineStore('global', {
    state: () => {
        return {
            tickets: [],
            columns: ref([]) as Ref<string[]>,
        };
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        async getColumns() {
            const response = await fetch('http://localhost:5246/api/Status');
            this.columns = await response.json();
        },

        async getTickets() {
            const response = await fetch('http://localhost:5246/api/Ticket');
            this.tickets = await response.json();
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
