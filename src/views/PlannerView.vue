<script setup>
import { ref, onMounted, h, inject, provide } from "vue";
import { useRouter } from "vue-router";
import izitoast from "@/shared/izitoast";
import { useEventListener } from "@vueuse/core";
import MyDialog from "@/components/MyDialog.vue";
import MyDropMenu from "@/components/MyDropMenu.vue";
import copyToclipboard from "@/shared/copyToclipboard";
import ContextMenu from "@imengyu/vue3-context-menu";
import emergencyAndNavigate from '@/shablons/emergency_and_navigate.js'
import color from '@/shablons/color.js'
import qr from '@/shablons/qr.js'
import Preview from "@/components/UI/svg/Preview.vue";
import Save from "@/components/UI/svg/Save.vue";
import Trash from "@/components/UI/svg/Trash.vue";
import Back from "@/components/UI/svg/Back.vue";
import { NTooltip } from 'naive-ui'
import { useFlightCode } from '@/composables/useFlightCode'


const router = useRouter()
const { finallyText } = useFlightCode()

const numbers = ref([]);
const clickCount = ref(1);
const listOfTrips = ref([]);
const isModalVisible = ref(false);
const dropMenu = ref(null);
provide('dropMenu', dropMenu);

onMounted(() => {
    for (let i = 0; i < 100; i++) {
        numbers.value.push({
            variable: [],
            x: i % 10,
            y: 9 - Math.floor(i / 10),
            index: i,
            isPlatform: false,
            isQR: false,
            BgImg: 'images/ArUco-marker.jpg'
        });
    }
});

function setNumber(item) {
    let valueOfMarker = item.variable[0];
    if (valueOfMarker === "") {
        item.variable.push(String(clickCount.value));
        listOfTrips.value.push(item);
        clickCount.value++;
    } else {
        if (item.variable.at(-1) === clickCount.value - 1) {
            izitoast.error({
                title: "Ошибка",
                message: "Нельзя выбирать один и тот же aruco маркер 2 раза подряд",
            });
            return;
        }
        listOfTrips.value.push(item);
        item.variable.push(clickCount.value);
        clickCount.value++;
    }
}

function generateCode() {
    finallyText.value = "";
    const mainCode = ref("");
    const colorDetectClass = ref("");
    const QRDetectClass = ref("");
    const colorDetectCode = ref("");
    const QRDetectCode = ref("");
    const isUsedPlatform = listOfTrips.value.some(item => item.isPlatform);
    const isUsedQR = listOfTrips.value.some(item => item.isQR);

    if (!listOfTrips.value.length) {
        return
    }
    if (isUsedPlatform) {
        let textOfCode = color
        textOfCode = textOfCode.split('<<separator>>')
        colorDetectClass.value = textOfCode[0]
        colorDetectCode.value += `    ${textOfCode[1].trim()}\n`;
    }

    if (isUsedQR) {
        let textOfCode = qr
        textOfCode = textOfCode.split('<<separator>>')
        QRDetectClass.value = textOfCode[0]
        QRDetectCode.value += `    ${textOfCode[1].trim()}\n`;
    }

    for (const item of listOfTrips.value) {
        mainCode.value += `    navigate_wait(${item.x}, ${item.y})\n`;
        if (item.isPlatform) {
            mainCode.value += colorDetectCode.value + '\n'
        }
        if (item.isQR) {
            mainCode.value += QRDetectCode.value + '\n'
        }
    }
    let textOfCode = emergencyAndNavigate
    finallyText.value = textOfCode.replace("<<main>>", mainCode.value);
    if (isUsedPlatform) {
        finallyText.value = finallyText.value.replace("<<ColorDetect>>", colorDetectClass.value);
    } else {
        finallyText.value = finallyText.value.replace("<<ColorDetect>>", '');
    }
    if (isUsedQR) {
        finallyText.value = finallyText.value.replace("<<qr_function>>", QRDetectClass.value);
    } else {
        finallyText.value = finallyText.value.replace("<<qr_function>>", '');
    }
}

function openPreview(event) {
    event.currentTarget.blur()
    generateCode()
    if (!listOfTrips.value.length) {
        izitoast.error({
            title: 'Ошибка',
            message: 'Для предпросмотра нужно создать маршрут'
        })
        return
    }
    router.push({ name: 'preview' })
}

function openPreviewFromModal() {
    isModalVisible.value = false
    router.push({ name: 'preview' })
}

function saveResult(event) {
    isModalVisible.value = true;
    event.currentTarget.blur()
    generateCode()
}

function cancel(event) {
    event.currentTarget.blur()
    if (clickCount.value === 1) {
        return;
    }
    if (listOfTrips.value.at(-1).variable.length === 1) {
        listOfTrips.value.at(-1).BgImg = 'images/ArUco-marker.jpg'
    }
    listOfTrips.value.at(-1).variable.pop();
    listOfTrips.value.pop();
    clickCount.value--;
}

function cleanResult(event) {
    event.currentTarget.blur()
    clickCount.value = 1;
    numbers.value.forEach(item => {
        item.isPlatform = false;
        item.isQR = false;
        item.variable = [];
        item.BgImg = 'images/ArUco-marker.jpg'
    })
    listOfTrips.value = []
    izitoast.info({
        title: 'Поле очищено',
        message: 'Поле очищено. Можно строить маршрут заново',
    })
}

const handleKeydown = (event) => {
    if (event.ctrlKey && event.code === "KeyZ" && listOfTrips.value.length) {
        event.preventDefault();
        cancel();
    } else if (event.ctrlKey && event.code === "KeyS") {
        event.preventDefault();
        saveResult();
    } else if (event.ctrlKey && event.code === "KeyN") {
        event.preventDefault();
        dropMenu.value?.open();
    } else if (event.code === "Delete") {
        event.preventDefault();
        cleanResult();
    }
};
useEventListener("keydown", handleKeydown);

function copyAndToast(text) {
    copyToclipboard(text);
    izitoast.success({
        title: 'Успешно',
        message: 'Код скопирован в буфер обмена'
    })
    isModalVisible.value = false
}

function handleDownloadBtn() {
    const downloadUrl = ref('');
    const blob = new Blob([finallyText.value], { type: 'text/plain' });
    downloadUrl.value = URL.createObjectURL(blob);
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = downloadUrl.value;
        link.download = 'itinerary.py';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 0);

    izitoast.success({
        title: 'Успешно',
        message: 'Загрузка файла уже началась'
    })
    isModalVisible.value = false
}

function createPlatform(item, color) {
    if (!item.variable.length) {
        item.variable.push(clickCount.value);
        listOfTrips.value.push(item)
        clickCount.value++
    }
    item.isPlatform = true;
    item.isQR = false;
    item.BgImg = `images/${color}-platform.jpg`
}

function deletePlatform(item) {
    if (item.isPlatform) {
        item.BgImg = 'images/ArUco-marker.jpg'
        item.isPlatform = false
    }
}

function createQR(item) {
    if (!item.variable.length) {
        item.variable.push(clickCount.value);
        listOfTrips.value.push(item)
        clickCount.value++
    }
    item.isPlatform = false;
    item.isQR = true;
    item.BgImg = `images/qr.jpg`
}

function deleteQR(item) {
    if (item.isQR) {
        item.BgImg = 'images/ArUco-marker.jpg'
        item.isQR = false
    }
}

function deletePointMap(item) {
    const index = listOfTrips.value.indexOf(item);
    if (index !== -1) {
        const deletedIndex = item.variable.at(-1)
        listOfTrips.value.forEach(square => {
            square.variable.map(itemVariable => {
                if (itemVariable === deletedIndex) {
                    square.variable = []
                }
                if (itemVariable > deletedIndex) {
                    square.variable[square.variable.indexOf(itemVariable)]--
                }
            })
        })
        listOfTrips.value.splice(index, 1);
        clickCount.value--
        item.isQR = false
        item.isPlatform = false
        item.BgImg = 'images/ArUco-marker.jpg'
    }
}

function createIcon(src) {
    return h('img', {
        src: src,
        style: {
            width: '20px',
            height: '20px',
        }
    })
}

function onContextMenu(e, item) {
    ContextMenu.showContextMenu({
        theme: 'mac dark',
        x: e.x,
        y: e.y,
        items: [
            {
                label: "Платформа",
                icon: createIcon('icons/base_square.webp'),
                children: [
                    {
                        label: "Белая",
                        onClick: () => createPlatform(item, 'white'),
                        icon: createIcon('icons/white_square.webp'),
                    },
                    {
                        label: "Синяя",
                        onClick: () => createPlatform(item, 'blue'),
                        icon: createIcon('icons/blue_square.webp'),
                    },
                    {
                        label: "Красная",
                        onClick: () => createPlatform(item, 'red'),
                        icon: createIcon('icons/red_square.webp'),
                    },
                    {
                        label: "Удалить",
                        onClick: () => deletePlatform(item),
                        icon: h(Trash),
                    },
                ]
            },
            {
                label: "QR код",
                icon: createIcon('icons/qr_code.png'),
                children: [
                    {
                        label: "Добавить",
                        onClick: () => createQR(item),
                        icon: createIcon('icons/plus.webp')
                    },
                    {
                        label: "Удалить",
                        onClick: () => deleteQR(item),
                        icon: h(Trash)

                    },
                ],
            },
            {
                label: "Удалить",
                icon: h(Trash),
                onClick: () => deletePointMap(item),
            },
        ]
    });
}
</script>

<template>
    <MyDropMenu ref="dropMenu" />
    <div class="wraper">
        <div class="grid">
            <div class="square" v-for="(item, index) in numbers" :data-key="index" :key="index" @click="setNumber(item)"
                @contextmenu.prevent="onContextMenu($event, item)" :style="{ backgroundImage: `url(${item.BgImg})` }">
                {{ numbers[index].variable.join(", ") }}
            </div>
        </div>

        <div class="actions">
            <n-tooltip trigger="hover">
                <template #trigger>
                    <Save @click="saveResult" />
                </template>
                Сохранить
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <Trash @click="cleanResult" />
                </template>
                Удалить
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                     <Back @click="cancel" />
                </template>
                Отменить
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <Preview @click="openPreview" />
                </template>
                Превью
            </n-tooltip>
        </div>
        <MyDialog v-model:show="isModalVisible" class="dialogWindow" :is-success=Boolean(listOfTrips.length)>
            <template #header>
                <strong v-if="listOfTrips.length">Код готов!</strong>
                <strong v-else>Код не готов!</strong>
            </template>
            <main>
                <p v-if="listOfTrips.length">Скопируйте или скачайте ваш код</p>
                <p v-else>Выстройте маршрут перед сохранением кода.</p>
            </main>
            <template #footer>
                <template v-if="listOfTrips.length">
                    <button @click="openPreviewFromModal">Предпросмотр</button>
                    <button @click="handleDownloadBtn">Скачать код</button>
                    <button @click="copyAndToast(finallyText)">Скопировать код</button>
                </template>
            </template>
        </MyDialog>
    </div>
</template>

<style>
:root {
    --side: 8vh;
    --sizeActions: 5vh;
}

.wraper {
    display: flex;
    justify-content: center;
    padding: 20px 0 80px 0;
}

.grid {
    display: grid;
    padding: 3px;
    grid-template-columns: repeat(10, var(--side));
    grid-template-rows: repeat(10, var(--side));
    gap: 5px;
    user-select: none;
}

.square {
    width: 100%;
    height: 100%;
    text-align: center;
    background-size: cover;
    border: 3px solid #ffffff;
    cursor: pointer;
    overflow-y: scroll;

    background-blend-mode: multiply;
    background-color: #ffffff;
    transition: background-color 0.3s ease;

    color: #2267fce2;
    text-shadow: -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff;
    box-sizing: border-box;
    font-size: 1.1rem;
    font-weight: bold
}

.square:hover {
    background-color: #949494;
}

.square:active {
    background-color: #747474;;
}

.square::-webkit-scrollbar {
    display: none;
}

.square[data-key="90"] {
    background-color: rgba(0, 2, 0, 0.638);
}

.actions {
    position: fixed;
    bottom: 10px;
    display: flex;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #2f2f2f;


    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 2px solid rgba(255, 255, 255, 0.18);
}

.actions svg {
    width: var(--sizeActions);
    height: var(--sizeActions);
    transition: color 0.4s;
}

.actions svg:hover {
    color: rgba(20, 104, 140, 0.89);
}

.actions svg:active {
    transition: color 0s;
    color: #23aae3e2;
}

path {
    fill: currentColor;
}

.actions button {
    padding: 20px 35px;
}
</style>
