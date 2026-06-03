<template>
    <div class="navigation-wrapper">
        <button class="burger-btn" @click="toggleMenu" :class="{ 'is-active': isOpen }" aria-label="Menu">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </button>

        <transition name="fade">
            <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
        </transition>

        <transition name="slide">
            <aside v-show="isOpen" class="side-panel scroll-strip">
                <div class="menu-header">
                    <h1>SkyVue</h1>
                </div>

                <el-menu
                    class="menu-content"
                    background-color="transparent"
                    text-color="#ffffff"
                    active-text-color="#23aae3"
                >
                    <el-sub-menu index="parts">
                        <template #title>
                            <span class="menu-content__group-title">Компоненты дрона</span>
                        </template>
                        <el-menu-item
                            v-for="part in parts"
                            :key="part.id"
                            :index="`part-${part.id}`"
                            class="menu-list-item"
                            @click="openPart(part)"
                        >
                            <ListCard
                                :title="part.name"
                                :subtitle="part.category"
                                :image="part.image"
                                :active="isPartActive(part.id)"
                            />
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="terms">
                        <template #title>
                            <span class="menu-content__group-title">Термины</span>
                        </template>
                        <el-menu-item
                            v-for="(item, index) in informationForDirectory"
                            :key="item.title"
                            :index="`term-${index}`"
                            class="menu-list-item"
                            @click="openInfoCard(item)"
                        >
                            <ListCard
                                :title="item.title"
                                :subtitle="getSubtitle(item.body)"
                                :active="isModalVisible && infoCard.title === item.title"
                            />
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
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
                    <custom-button :to="infoCard.hrefToDoc" title="Посмотреть в официальной документации">Документация</custom-button>
                    <custom-button @click="handleOkBtn">ОК</custom-button>
                </div>
            </template>
        </MyDialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MyDialog from "@/components/MyDialog.vue";
import CustomButton from '@/components/UI/CustomButton.vue'
import ListCard from '@/components/UI/ListCard.vue'
import informationForDirectory from "../data/informationForDirectory";
import { useEventListener } from "@vueuse/core";
import { usePartsCatalog } from '@/composables/usePartsCatalog';

const route = useRoute()
const router = useRouter()
const { parts, loadParts } = usePartsCatalog()

const isOpen = ref(false);
const isModalVisible = ref(false);
const infoCard = ref({})

function getSubtitle(body) {
    if (!body) return ''
    return body.length > 72 ? `${body.slice(0, 72)}…` : body
}

function isPartActive(partId) {
    return route.name === 'topic'
        && route.params.source === 'parts'
        && Number(route.params.id) === partId
}

function openPart(part) {
    isOpen.value = false
    router.push({ name: 'topic', params: { source: 'parts', id: part.id } })
}

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

onMounted(() => {
    loadParts()
})

defineExpose({ open: () => (isOpen.value = true), close: closeMenu });
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
    border-right: none;
}

.menu-content__group-title {
    font-size: 16px;
    font-weight: 600;
}

.menu-content :deep(.el-sub-menu__title) {
    border-radius: 10px;
}

.menu-content :deep(.el-sub-menu__title:hover) {
    background-color: rgba(255, 255, 255, 0.1);
}

.terms-menu-item,
.menu-list-item {
    height: auto;
    line-height: normal;
    padding: 0;
    margin-bottom: 4px;
    white-space: normal;
}

.terms-menu-item :deep(.list-card),
.menu-list-item :deep(.list-card) {
    margin: 0;
    width: 100%;
}

.terms-menu-item.is-active,
.menu-list-item.is-active {
    background-color: transparent !important;
}

.line {
    width: 100%;
    height: 4px;
    background-color: #383838;
    transition: all 0.3s ease;
}

.is-active .line:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
}

.is-active .line:nth-child(2) {
    opacity: 0;
}

.is-active .line:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
}

.side-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 25%;
    min-width: 280px;
    height: 100%;
    background-image: radial-gradient(#23aae3e2, #222222);
    color: white;
    z-index: 2;
    padding: 0 12px 20px;
    border-right: white 2px solid;
}

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
