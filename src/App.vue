<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

let isFullScreen: boolean = false;
const screenWidth: Ref<string> = ref('container');

function changeScreenWidth(): void {
    isFullScreen = !isFullScreen;
    if (isFullScreen) {
        screenWidth.value = 'container-fluid';
    } else {
        screenWidth.value = 'container';
    }
}
</script>

<template>
    <nav class="py-2 bg-light border-bottom">
        <div :class="[screenWidth, 'd-flex', 'flex-wrap']">
            <ul class="nav me-auto">
                <li class="nav-item">
                    <RouterLink to="/" class="nav-link link-dark px-2 active" aria-current="page"
                        >Overview</RouterLink
                    >
                </li>
                <li class="nav-item">
                    <RouterLink to="/board" class="nav-link link-dark px-2">Board</RouterLink>
                </li>
            </ul>
            <ul class="nav">
                <li class="nav-item">
                    <div
                        class="form-check form-switch d-flex justify-content-center align-items-center h100"
                    >
                        <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            :checked="isFullScreen"
                            @change="changeScreenWidth"
                        />
                    </div>
                </li>
            </ul>
        </div>
    </nav>
    <main>
        <div :class="[screenWidth]">
            <RouterView />
        </div>
    </main>
</template>

<style scoped>
.h100 {
    height: 100%;
}
</style>
