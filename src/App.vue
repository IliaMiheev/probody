<script setup>
import {ref, onMounted, h} from "vue";
import izitoast from "@/shared/izitoast";
import {useEventListener} from "@vueuse/core";
import MyDialog from "@/components/MyDialog.vue";
import MyDropMenu from "@/components/MyDropMenu.vue";
import copyToclipboard from "@/shared/copyToclipboard";
import ContextMenu from "@imengyu/vue3-context-menu";
import CustomButton from '@/components/UI/CustomButton.vue'
import CodeView from "@/components/CodeView.vue";

import emergencyAndNavigate from './shablons/emergency_and_navigate.js'
import color from './shablons/color.js'
import qr from './shablons/qr.js'


const numbers = ref([]); // Инициализируем массив с пустыми строками
const clickCount = ref(1); // Счетчик нажатий
const listOfTrips = ref([]);
const isModalVisible = ref(false);
const isCodeViewVisible = ref(false);
const finallyText = ref("");

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
    //если в клетке нет числа, то оно поставится
    if (valueOfMarker === "") {
        item.variable.push(String(clickCount.value));
        listOfTrips.value.push(item);
        clickCount.value++;
    } else {
        //если нажимаем на ранее отмеченную клетку, то выводится ошибка
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

async function saveResult() {
    finallyText.value = "";
    const mainCode = ref("");
    const colorDetectClass = ref("");
    const QRDetectClass = ref("");
    const colorDetectCode = ref("");
    const QRDetectCode = ref("");
    const isUsedPlatform = listOfTrips.value.some(item => item.isPlatform);
    const isUsedQR = listOfTrips.value.some(item => item.isQR);

    isModalVisible.value = true;
    if (!listOfTrips.value.length) {
        return
    }
    if (isUsedPlatform) {
        let textOfCode = color
        textOfCode = textOfCode.split('<<separator>>')
        colorDetectClass.value = textOfCode[0]
        colorDetectCode.value += `\t${textOfCode[1].trim()}\n`;
    }

    if (isUsedQR) {
        let textOfCode = qr
        textOfCode = textOfCode.split('<<separator>>')
        QRDetectClass.value = textOfCode[0]
        QRDetectCode.value += `\t${textOfCode[1].trim()}\n`;
    }

    for (const item of listOfTrips.value) {
        mainCode.value += `\tnavigate_wait(${item.x}, ${item.y})\n`;
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

function cancel() {
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

function cleanResult() {
    clickCount.value = 1;
    numbers.value.forEach(item => {
        item.isPlatform = false;
        item.isQR = false;
        item.variable = [];
        item.BgImg = 'images/ArUco-marker.jpg'
    })
    izitoast.info({
        title: 'Поле очищено',
        message: 'Поле очищено. Можно строить маршрут заново',
    })
}

// Обрабатываем нажатие Ctrl + Z
const handleKeydown = (event) => {
    if (event.ctrlKey && event.code === "KeyZ" && listOfTrips.value.length) {
        event.preventDefault();
        cancel();
    } else if (event.ctrlKey && event.code === "KeyS") {
        event.preventDefault();
        saveResult();
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
    // Создание файла
    const downloadUrl = ref('');
    const blob = new Blob([finallyText.value], {type: 'text/plain'});
    downloadUrl.value = URL.createObjectURL(blob);
    // Задержка для избежания ошибок в некоторых браузерах
    setTimeout(() => {
        // Загрузка
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
                        icon: createIcon('icons/trash.webp'),
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
                        icon: createIcon('icons/trash.webp')

                    },
                ],
            },
            {
                label: "Удалить",
                icon: createIcon('icons/trash.webp'),
                onClick: () => deletePointMap(item),
            },
        ]
    });
}
</script>

<template>
    <div v-if="!isCodeViewVisible" class="wraper">
        <div class="grid">
            <div class="square" v-for="(item, index) in numbers" :data-key="index" :key="index" @click="setNumber(item)"
                 @contextmenu.prevent="onContextMenu($event, item)" :style="{ backgroundImage: `url(${item.BgImg})` }">
                {{ numbers[index].variable.join(", ") }}
            </div>
        </div>

        <div class="actions">
            <custom-button @click="saveResult">Сохранить</custom-button>
            <custom-button @click="cleanResult">Очистить</custom-button>
            <custom-button @click="cancel">Отменить</custom-button>
        </div>
        <MyDropMenu/>
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
                <div v-if="listOfTrips.length">
                    <button @click="isCodeViewVisible = true">Предпросмотр</button>
                    <button @click="handleDownloadBtn">Скачать код</button>
                    <button @click="copyAndToast(finallyText)">Скопировать код</button>
                </div>
            </template>
        </MyDialog>
    </div>
    <CodeView v-model:show="isCodeViewVisible" :code="finallyText" :show="isCodeViewVisible"/>
</template>

<style>
* {
    font-family: 'Courier New', Courier, monospace;
}

html {
    background-image: radial-gradient(#23aae3e2, #222222);
    font-size: 18px;
}

body {
    margin: 0;
}

:root {
    --side: 75px;
}

.wraper {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    //padding: 20% 0;
    //TODO: рассмотреть вариант
}

.grid {
    display: grid;
    padding: 3px;
    grid-template-columns: repeat(10, var(--side));
    gap: 5px;
    user-select: none;
}

.square {
    width: var(--side);
    height: var(--side);
    background-size: cover;
    border: 3px solid rgb(251, 251, 251);
    cursor: pointer;
    overflow-y: scroll;

    background-blend-mode: multiply;
    background-color: transparent;
    transition: background-color 0.3s ease;

    color: white;
    text-shadow: -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    1px 1px 0 black;
    box-sizing: border-box;
}

.square:hover {
    background-color: rgb(166, 162, 162);
}

.square:active {
    background-color: rgb(164, 162, 162);
}

.square::-webkit-scrollbar {
    display: none;
}

.square[data-key="90"] {
    background-color: rgba(0, 2, 0, 0.638);
}

.actions {
    margin: 3px 0 0 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 150px;
}

.actions button {
    padding: 20px 35px;
    /* background-color: red; */
}
</style>
