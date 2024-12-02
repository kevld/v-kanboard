<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true, // La prop est obligatoire
    },
    id: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hideCloseButton: {
        type: Boolean,
        required: false,
        default: false,
    },
});

defineEmits(['delete']);
</script>

<template>
    <div class="card mt-4">
        <div class="card-header">
            <div class="d-flex justify-content-between">
                <div class="align-middle">
                    <h3 class="cursor-pointer">{{ id }}</h3>
                </div>
                <div class="">
                    <button
                        v-if="!hideCloseButton"
                        class="btn btn-danger"
                        @click="$emit('delete', id)"
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">{{ title }}</h5>
            <p class="card-text">
                {{ description }}
            </p>
        </div>
    </div>
</template>
<style>
.cursor-pointer {
    cursor: pointer;
}
.title {
    font-weight: bold;
}
</style>
