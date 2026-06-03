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
                    <el-sub-menu
                        v-for="group in menuGroups"
                        :key="group.source"
                        :index="group.source"
                    >
                        <template #title>
                            <span class="menu-content__group-title">{{ group.name }}</span>
                        </template>
                        <el-menu-item
                            v-for="item in group.items"
                            :key="`${group.source}-${item.id}`"
                            :index="`${group.source}-${item.id}`"
                            class="menu-list-item"
                            @click="openTopic(group.source, item.id)"
                        >
                            <ListCard
                                :title="item.title"
                                :subtitle="item.subtitle"
                                :image="item.image"
                                :active="isTopicActive(group.source, item.id)"
                            />
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </aside>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListCard from '@/components/UI/ListCard.vue'
import { getMenuGroups } from '@/data/index.js'
import { useEventListener } from "@vueuse/core";

const route = useRoute()
const router = useRouter()

const isOpen = ref(false);
const menuGroups = ref([])

function isTopicActive(source, id) {
    return route.name === 'topic'
        && route.params.source === source
        && Number(route.params.id) === id
}

function openTopic(source, id) {
    isOpen.value = false
    router.push({ name: 'topic', params: { source, id } })
}

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const closeMenu = () => {
    isOpen.value = false;
};

const handleKeydown = (event) => {
    if (event.code === "Escape" && isOpen.value) {
        event.preventDefault();
        closeMenu();
    }
};
useEventListener("keydown", handleKeydown);

onMounted(() => {
    menuGroups.value = getMenuGroups()
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
    padding-bottom: 30px;
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

.menu-list-item {
    height: auto;
    line-height: normal;
    padding: 0;
    margin-bottom: 4px;
    white-space: normal;
}

.menu-list-item :deep(.list-card) {
    margin: 0;
    width: 100%;
}

.menu-list-item:hover,
.menu-content :deep(.el-menu-item.menu-list-item:hover) {
    background-color: transparent !important;
}

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
