<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" v-if="show" @click.stop="onClose">
            <div class="modal" @click.stop>
                <header :class="['modal-header', isSuccess ? 'modal-header-success' : 'modal-header-error']">
                    <slot name="header">
                        <strong>Заголовок по умолчанию</strong>
                    </slot>
                    <button class="modal-btn-close" @click.stop="onClose"
                        aria-label="Закрыть модальное окно">
                        ×
                    </button>
                </header>
                <section class="modal-body">
                    <slot>Тело по умолчанию</slot>
                </section>
                <footer :class="['modal-footer', isSuccess ? 'modal-footer-success' : 'modal-footer-error']">
                    <slot name="footer">
                        <button @click.stop="onClose">Закрыть</button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script setup>
import {defineEmits} from 'vue'

const emit = defineEmits({
    close: null,
    'update:show': false,
})
defineProps({
    isSuccess: {
        type: Boolean,
        default: true,
    },
    show: {
        type: Boolean,
        default: false
    }
})

function onClose() {
    emit('update:show')
    emit('close')
}
</script>

<style>
:root {
    --successColor: #4ee882
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 998;
}

.modal {
    background: #2f2f2f;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    width: 90%;
    border-radius: 5px;
}

.modal-header,
.modal-footer {
    padding: 10px;
    display: flex;
}

.modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
}

.modal-header-success {
    color: var(--successColor);
}

.modal-header-error {
    color: red;
}

.modal-header button {
    color: red;
    font-size: 25px;
}

.modal-footer {
    justify-content: flex-end;
    border-top: 1px solid white;

}

.modal-footer button {
    justify-content: flex-end;
    border-top: 1px solid white;
    padding: 5px;
    color: rgb(0, 0, 0);
}

.modal-footer-success button {
    background-color: var(--successColor);
    border: none;
    margin: 3px;
}

.modal-footer-error button {
    background: red;
    border: none;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
    color: white
}

.modal-btn-close {
    border: none;
    font-size: 20px;
    padding: 0;
    cursor: pointer;
    font-weight: bold;
    color: red;
    background: transparent;
}

/* Начало появления: ниже и прозрачный */
.modal-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
/* Конец появления: на месте и видим */
.modal-fade-enter-to {
    opacity: 1;
    transform: translateY(0);
}
/* Начало исчезания: на месте и видим */
.modal-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
/* Конец исчезания: выше и прозрачный */
.modal-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Общие настройки анимации (скорость + плавность) */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: transform 0.7s cubic-bezier(.22,.9,.31,1), opacity 0.7s ease;
    will-change: transform, opacity;
}
</style>