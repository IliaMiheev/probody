<script setup>
import { computed } from 'vue'

const APP_LOGO = '/images/drone.png'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    active: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['click'])

const imageSrc = computed(() => props.image || APP_LOGO)
</script>

<template>
    <div
        class="list-card"
        :class="{ 'list-card--active': active }"
        :title="title"
        @click="$emit('click')"
    >
        <div class="list-card__media">
            <img
                :src="imageSrc"
                :alt="title"
                :title="title"
                class="list-card__image"
            />
        </div>
        <div class="list-card__body">
            <span class="list-card__title">{{ title }}</span>
            <span v-if="subtitle" class="list-card__subtitle">{{ subtitle }}</span>
        </div>
    </div>
</template>

<style scoped>
.list-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.05);
    box-sizing: border-box;
}

.list-card:hover {
    background: rgba(35, 170, 227, 0.2);
}

.list-card--active {
    background: linear-gradient(135deg, #23aae3, #1a6d8f);
    box-shadow: 0 4px 15px rgba(35, 170, 227, 0.3);
}

.list-card__media {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
}

.list-card__image {
    width: 100%;
    height: 100%;
    background-size: initial;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.list-card__body {
    flex: 1;
    min-width: 0;
}

.list-card__title {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-card__subtitle {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
