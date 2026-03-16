<template>
    <div class="navigation-wrapper">
        <!-- Кнопка Бургер -->
        <button class="burger-btn" @click="toggleMenu" :class="{ 'is-active': isOpen }" aria-label="Menu">
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
        <MyDialog isSuccess v-model:show="isModalVisible">
            <template #header>
                <strong>{{ infoCard.title }}</strong>
            </template>
            <main>
                <p>{{ infoCard.body }}</p>
            </main>
            <template #footer>
                <div class="navigation-wrapper__footer">
                    <custom-button :to="infoCard.hrefToCourse" title="Посмотреть на Stepik">Курс</custom-button>
                    <custom-button :to="infoCard.hrefToDoc" title="Посмотреть в официальной документации">Документация</custom-button>
                    <custom-button @click="isModalVisible = false">ОК</custom-button>
                </div>
            </template>
        </MyDialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
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
        body: 'ROS (Robot Operating System) — экосистема для программирования роботов с открытым исходным кодом',
        hrefToDoc: 'https://www.ros.org/',
        hrefToCourse: 'https://stepik.org/lesson/2260739/step/1?unit=2294748'
    },
    {
        title: 'Что такое нода?',
        body: 'Нода в ROS - исполняемая программа, которая выполняет одну задачу. ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2261765/step/1?unit=2295758'
    },
    {
        title: 'Что такое topic?',
        body: 'Топик (Topic) в ROS — это именованный канал передачи данных, через который ноды обмениваются сообщениями.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Что такое издатель?',
        body: 'Издатель (Publisher) в ROS — это узел, который производит данные. Он может публиковать сообщения определённого типа в заданной теме и делать их доступными для других узлов (подписчиков). ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Что такое подписчик?',
        body: 'Подписчик (Subscriber) в ROS — это узел, который получает сообщения и информацию, публикуемые в определённой теме (канале) ROS.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Что такое сервис?',
        body: 'Сервис в ROS - это функция, которую мы можем вызвать, чтобы либо дать команду роботу,либо получить от него какую-то информацию.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2263182/step/1?unit=2297206'
    },
    {
        title: 'navigate_wait',
        body: 'Navigate_wait — функция в библиотеке CLOVER, которая ожидает, пока дрон долетит до целевой точки, перед выполнением следующей команды. Это полезно, так как функция navigate сразу возвращает управление: скрипт продолжает выполняться, даже если дрон ещё летит к цели. ',
        hrefToDoc: 'https://clover.coex.tech/ru/snippets.html',
        hrefToCourse: 'https://stepik.org/lesson/2264712/step/1?unit=2298803'
    },
    {
        title: 'Системы координат',
        body: 'Системы координат в Clover позволяют определять местоположение дрона относительно разных точек отсчёта, что важно для автономного полёта, навигации и других задач. Наиболее часто используемые: aruco_map и body',
        hrefToCourse: 'https://stepik.org/lesson/2264336/step/1?unit=2298407',
        hrefToDoc: 'https://clover.coex.tech/ru/frames.html'
    },
    {
        title: 'OpenCV',
        body: 'OpenCV (Open Source Computer Vision Library) — библиотека алгоритмов компьютерного зрения, обработки изображений и численных алгоритмов общего назначения с открытым кодом.',
        hrefToDoc: 'https://opencv.org/',
        hrefToCourse: 'https://stepik.org/lesson/2272700/step/1?unit=2306893'
    }
]

// Экспортируем методы, если захотим управлять меню извне
defineExpose({ open: () => (isOpen.value = true), close: closeMenu });
</script>

<style scoped>
.burger-btn {
    position: fixed;
    /* Она всегда на одном месте при скролле */
    top: 20px;
    left: 20px;
    z-index: 9999;
    /* Максимальный приоритет, чтобы быть ПОВЕРХ всего */
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

.menu-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.line {
    width: 100%;
    height: 4px;
    background-color: #383838;
    /* Ярко-красный цвет для теста */
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
    background-image: radial-gradient(#23aae3e2, #222222);
    color: white;
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
    background-color: #333333;
    opacity: 90%;
    display: flex;
}

.navigation-wrapper__footer {
    display: flex;
    gap: 10px;
    width: 100%;
}

/* Анимации появления */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
