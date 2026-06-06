<script setup>
import { ref, watch, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resolveTopic } from '@/composables/useTopicResolver'
import MyDropMenu from "@/components/MyDropMenu.vue";
import CustomButton from '@/components/UI/CustomButton.vue'
import { publicPath } from '@/shared/publicPath'

const APP_LOGO = 'images/drone.png'

const route = useRoute()
const router = useRouter()
const topic = ref(null)
const dropMenu = ref(null);
provide('dropMenu', dropMenu);

const topicImage = computed(() => publicPath(topic.value?.image || APP_LOGO))

async function loadTopic() {
    topic.value = await resolveTopic(route.params.source, route.params.id)

    if (!topic.value) {
        router.replace({ name: 'planner' })
    }
}

watch(
    () => [route.params.source, route.params.id],
    loadTopic,
    { immediate: true }
)

function goBack() {
    router.push({ name: 'planner' })
}
</script>

<template>
    <MyDropMenu ref="dropMenu" />
    <div v-if="topic" class="topic-view scroll-strip">
        <article class="topic-view__card">
            <button class="topic-view__back" @click="goBack">
                ← Назад
            </button>

            <div class="topic-view__image">
                <img :src="topicImage" :alt="topic.title" />
            </div>

            <div class="topic-view__header">
                <h1 class="topic-view__title">{{ topic.title }}</h1>
                <p v-if="topic.subtitle" class="topic-view__subtitle">{{ topic.subtitle }}</p>
            </div>

            <p class="topic-view__description">{{ topic.description }}</p>

            <div
                v-if="topic.hrefToCourse || topic.hrefToDoc"
                class="topic-view__links"
            >
                <CustomButton
                    v-if="topic.hrefToCourse"
                    :to="topic.hrefToCourse"
                    title="Посмотреть на Stepik"
                >
                    Курс
                </CustomButton>
                <CustomButton
                    v-if="topic.hrefToDoc"
                    :to="topic.hrefToDoc"
                    title="Посмотреть в официальной документации"
                >
                    Документация
                </CustomButton>
            </div>
        </article>
    </div>
</template>

<style scoped>
.topic-view {
    min-height: 100vh;
    padding: 40px 20px;
    box-sizing: border-box;
}

.topic-view__back {
    margin-bottom: 24px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #ff6b6b, #c92a2a);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

.topic-view__back:hover {
    transform: scale(1.02);
}

.topic-view__card {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 24px;
    padding: 30px;
    backdrop-filter: blur(5px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.topic-view__image {
    text-align: center;
    margin-bottom: 30px;
}

.topic-view__image img {
    max-width: 100%;
    max-height: 350px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.topic-view__header {
    text-align: center;
    margin-bottom: 24px;
}

.topic-view__subtitle {
    margin: 0 0 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
}

.topic-view__title {
    margin: 0;
    font-size: 28px;
    color: #fff;
}

.topic-view__description {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    white-space: pre-wrap;
}

.topic-view__links {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
