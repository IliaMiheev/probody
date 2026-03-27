<template>
    <div class="movement-buttons">
        <button @click="scrollToTop" class="up">↑</button>
        <button @click="scrollToBottom" class="down">↓</button>
    </div>
</template>

<script setup>

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Плавная прокрутка
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

</script>

<style scoped>
:root {
    --btnHeight: 50px;
}
.movement-buttons {
    display: flex;
    gap: 2px;
    flex-direction: column;
    position: fixed;
    right: 15px;
    bottom: calc(50% - 50px);
}

.movement-buttons > button {
    width: auto;
    font-size: 15px;
    border: 2px solid #d0d0d0;
    color: white;
    background-color: #383838;
    height: 50px;
}

@media (max-width: 900px) {
    .movement-buttons > button {
        width: 30px;
        font-size: 15px;
    }
}

.up {
    border-radius: 10px 10px 0 0;
}

.down {
    border-radius: 0 0 10px 10px;
}
</style>