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
                    <custom-button :to="infoCard.hrefToDoc"
                        title="Посмотреть в официальной документации">Документация</custom-button>
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
        title: 'ROS',
        body: 'ROS (Robot Operating System) — экосистема для программирования роботов. В приложении через ROS дрон получает команды, передает телеметрию и данные с камеры.',
        hrefToDoc: 'https://www.ros.org/',
        hrefToCourse: 'https://stepik.org/lesson/2260739/step/1?unit=2294748'
    },
    {
        title: 'OpenCV',
        body: 'OpenCV (Open Source Computer Vision Library) — библиотека компьютерного зрения. С её помощью дрон распознает цвета платформ и считывает QR-коды.',
        hrefToDoc: 'https://opencv.org/',
        hrefToCourse: 'https://stepik.org/lesson/2272700/step/1?unit=2306893'
    },
    {
        title: 'navigate_wait',
        body: 'Navigate_wait — функция из библиотеки Clover. Отправляет дрон в точку и ждёт, пока он туда долетит, и только потом выполняет следующую команду. Это важно, потому что обычная команда navigate не ждет: дрон ещё летит, а скрипт уже бежит дальше — из-за этого следующие команды могут выполняться раньше времени.',
        hrefToDoc: 'https://clover.coex.tech/ru/snippets.html',
        hrefToCourse: 'https://stepik.org/lesson/2264712/step/1?unit=2298803'
    },
    {
        title: 'Нода (Node)',
        body: 'Нода (Node/узел) в ROS - исполняемая программа, которая выполняет одну конкретную задачу. В сгенерированном коде вся логика полета и обработки камеры находится внутри одной ноды. Это позволяет запускать, останавливать и отлаживать программу как единое целое. ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2261765/step/1?unit=2295758'
    },
    {
        title: 'Топик (Topic)',
        body: 'Топик (Topic) в ROS — канал обмена данными. Например, камера публикует изображение в топик, а ваш скрипт подписывается на него и получает кадры.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Издатель (Publisher)',
        body: 'Издатель (Publisher) в ROS — часть программы, которая отправляет данные в топик. Например, если нужно передать команду другому узлу или опубликовать координаты дрона — создается издатель, который публикует сообщения в нужный канал. Подписчики других узлов могут эти данные получать. ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Подписчик (Subscriber)',
        body: 'Подписчик (Subscriber) в ROS — часть программы, которая получает данные из топика. Например, чтобы дрон "видел" изображение с камеры или считывал свои координаты, создаётся подписчик на соответствующий топик. Как только в топике появляются новые данные, подписчик автоматически их обрабатывает.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866'
    },
    {
        title: 'Сервис',
        body: 'Сервис в ROS - способ вызвать функцию робота и сразу получить ответ. В отличие от топика, где данные идут постоянно, сервис работает по принципу "запрос — ответ". Например, команда navigate — это сервис: вы отправляете координаты, а робот отвечает "команда принята". Команда get_telemetry возвращает текущие координаты дрона.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2263182/step/1?unit=2297206'
    },
    {
        title: 'Системы координат',
        body: 'Определяют, откуда отсчитывать координаты дрона. body — относительно самого дрона (вперед/назад/влево/вправо). aruco_map — относительно карты с ArUco-метками, где координаты привязаны к неподвижным маркерам. Выбор правильной системы координат позволяет дрону точно выполнять команды: лететь относительно себя для коротких маневров или по глобальной карте для точной навигации.',
        hrefToCourse: 'https://stepik.org/lesson/2264336/step/1?unit=2298407',
        hrefToDoc: 'https://clover.coex.tech/ru/frames.html'
    },
    {
        title: 'ArUco-маркер',
        body: 'ArUco-маркер — квадратный визуальный маркер, который камера дрона может распознавать. Используется для навигации: по положению маркера дрон определяет свои координаты в пространстве.',
        hrefToCourse: 'https://stepik.org/lesson/2264336/step/1?unit=2298407',
        hrefToDoc: 'https://klever-doc.tech/ROS1/ru/aruco.html'
    },
    {
        title: 'Симулятор (Gazebo)',
        body: 'Симулятор (Gazebo) — виртуальная среда, где дрон ведет себя как в реальности. Позволяет безопасно тестировать полетные задания перед запуском на реальном дроне.',
        hrefToCourse: 'https://stepik.org/lesson/2278310/step/1?unit=2312564',
        hrefToDoc: 'https://klever-doc.tech/ROS1/ru/simulation.html'
    },
    {
        title: 'unregister()',
        body: 'unregister() — метод, который отключает подписчика от топика. Используется, чтобы перестать получать данные, когда они больше не нужны (например, после сканирования QR-кода).',
        hrefToCourse: 'https://stepik.org/lesson/2272845/step/1?unit=2307058',
        hrefToDoc: 'https://docs.ros.org/en/diamondback/api/rospy/html/rospy.topics.Subscriber-class.html'
    },
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
    overflow: auto;
    border-right: white 2px solid;
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
