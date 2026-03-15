<template>
    <div class="navigation-wrapper">
        <!-- Кнопка Бургер -->
        <button
            class="burger-btn"
            @click="toggleMenu"
            :class="{ 'is-active': isOpen }"
            aria-label="Menu"
        >
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </button>

        <!-- Затемнение заднего фона (Overlay) -->
        <transition name="fade">
            <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
        </transition>

        <!-- Выпадающая панель -->
        <transition name="slide">
            <aside v-if="isOpen" class="side-panel">
                <div class="menu-header">
                    <h1>SkyVue</h1>
                </div>

                <nav class="menu-content">
                    <custom-button @click="openInfoCard(link)" v-for="link in links">{{ link.title }}</custom-button>
                </nav>
            </aside>
        </transition>
        <MyDialog
            isSuccess
            v-model:show="isModalVisible"
        >
            <template #header>
                <strong>{{ infoCard.title }}</strong>
            </template>
            <main>
                <p>{{ infoCard.body }}</p>
            </main>
            <template #footer>
                <custom-button title="Посмотреть на stepike">Курс</custom-button>
                <custom-button title="Посмотреть в официальной документации">Документация</custom-button>
                <custom-button>ОК</custom-button>
            </template>
        </MyDialog>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import MyDialog from "@/components/MyDialog.vue";
import CustomButton from '@/components/UI/CustomButton.vue'

const isOpen = ref(false);
const isModalVisible = ref(false);
const infoCard = ref({})

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const closeMenu = () => {
    isOpen.value = false;
};

function openInfoCard(obj) {
    isModalVisible.value = true
    infoCard.value = obj
}

const links = [
    {
        title: 'Что такое ROS?',
        body: 'ROS — переводится как robot operation system',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '2',
        body: 'Информация для учащихся 2',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '3',
        body: 'Информация для учащихся 3',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '4',
        body: 'Информация для учащихся 4',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '5',
        body: 'Информация для учащихся 5',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '6',
        body: 'Информация для учащихся 6',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '7',
        body: 'Информация для учащихся 7',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '8',
        body: 'Информация для учащихся 8',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '9',
        body: 'Информация для учащихся 9',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
    {
        title: '0',
        body: 'Информация для учащихся 0',
        hrefToDoc: 'https://clover.coex.tech/ru/simple_offboard.html',
        hrefToCourse: 'https://stepic.org'
    },
]

// Экспортируем методы, если захотим управлять меню извне
defineExpose({open: () => (isOpen.value = true), close: closeMenu});
</script>

<style scoped>
.burger-btn {
    position: fixed; /* Она всегда на одном месте при скролле */
    top: 20px;
    left: 20px;
    z-index: 9999; /* Максимальный приоритет, чтобы быть ПОВЕРХ всего */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 40px;
    height: 30px;
    background: rgba(255, 255, 255, 0.508);
    border: 1px solid #383838;
    cursor: pointer;
    padding: 5px;
}

h1 {
    text-align: center;
}

.line {
    width: 100%;
    height: 4px;
    background-color: #383838; /* Ярко-красный цвет для теста */
    transition: all 0.3s ease;
}

/* Анимация бургера в крестик */
.is-active .line:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
}

.is-active .line:nth-child(2) {
    opacity: 0;
}

.is-active .line:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
}

/* Боковая панель */
.side-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100%;
    background: white;
    z-index: 1000;
    padding: 0 20px 20px;
    overflow-y: scroll;
}

/* Затемнение фона */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
}

/* Анимации появления */
.slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
