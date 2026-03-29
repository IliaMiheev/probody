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
                    <custom-button
                        @click="openInfoCard(item)"
                        v-for="item in informationForDirectory"
                    >
                        {{ item.title }}
                    </custom-button>
                </nav>
            </aside>
        </transition>
        <MyDialog isSuccess v-model:show="isModalVisible" @close="handleOkBtn">
            <template #header>
                <strong>{{ infoCard.title }}</strong>
            </template>
            <main>
                <p>{{ infoCard.body }}</p>
            </main>
            <template #footer>
                <div class="navigation-wrapper__footer">
                    <custom-button :to="infoCard.hrefToCourse" title="Посмотреть на Stepik">Курс</custom-button>
                    <custom-button :to="infoCard.hrefToDoc" title="Посмотреть в официальной документации">Документация
                    </custom-button>
                    <custom-button @click="handleOkBtn">ОК</custom-button>
                </div>
            </template>
        </MyDialog>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import MyDialog from "@/components/MyDialog.vue";
import CustomButton from '@/components/UI/CustomButton.vue'
import informationForDirectory from "../data/informationForDirectory";
import {useEventListener} from "@vueuse/core";

const isOpen = ref(false);
const isModalVisible = ref(false);
const infoCard = ref({})

function handleOkBtn() {
    isModalVisible.value = false
    isOpen.value = true
}

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const closeMenu = () => {
    isOpen.value = false;
};

function openInfoCard(obj) {
    isModalVisible.value = true
    isOpen.value = false
    infoCard.value = obj
}

const handleKeydown = (event) => {
    if (event.code === "Escape" && isOpen.value) {
        event.preventDefault();
        closeMenu();
    }
};
useEventListener("keydown", handleKeydown);

// Экспортируем методы, если захотим управлять меню извне
defineExpose({open: () => (isOpen.value = true), close: closeMenu});
</script>

<style scoped>
.burger-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 3;
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
    width: 25%;
    height: 100%;
    background-image: radial-gradient(#23aae3e2, #222222);
    color: white;
    z-index: 2;
    padding: 0 20px 20px;
    overflow-y: scroll;
    overflow: auto;
    border-right: white 2px solid;

    //background: rgba(255, 255, 255, 0.2);
    //backdrop-filter: blur(10px);
    //-webkit-backdrop-filter: blur(10px);
    //box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    //border-right: 2px solid rgba(255, 255, 255, 0.18);
    /*
        Эффект жидкого стекла
        Оставил для обсуждения
        Не удалять!
    */
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

main {
    text-align: justify;
}

.navigation-wrapper__footer {
    display: flex;
    gap: 10px;
    width: 100%;
}

/* Анимации появления */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.39s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.39s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
