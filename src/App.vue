<script setup>
import {ref, onMounted} from "vue";
import izitoast from "./shared/izitoast";
import {useEventListener} from "@vueuse/core";
import MyDialog from "./components/MyDialog.vue";
import MyDropMenu from "./components/MyDropMenu.vue";
import copyToclipboard from "./shared/copyToclipboard";
import onContextMenu from './shared/ContextMenu'

const numbers = ref([]); // Инициализируем массив с пустыми строками
const clickCount = ref(1); // Счетчик нажатий
const listOfTrips = ref([]);
const isModalVisible = ref(false);
let finallyText = ref("");

onMounted(() => {
    for (let i = 0; i < 100; i++) {
        numbers.value.push({
            variable: [],
            x: i % 10,
            y: 9 - Math.floor(i / 10),
            index: i,
            isPlatform: false,
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
        if (numbers.value[item.index].variable.at(-1) === clickCount.value - 1) {
            izitoast.error({
                title: "Ошибка",
                message: "Нельзя выбирать один и тот же aruco маркер 2 раза подряд",
            });
            return;
        }
        listOfTrips.value.push(item);
        numbers.value[item.index].variable.push(clickCount.value);
        clickCount.value++;
    }
}

async function saveResult() {
    finallyText.value = "";
    const mainCode = ref("");
    const colorDetectClass = ref("");
    const colorDetectCode = ref("");
    const isUsedPlatform = listOfTrips.value.some(item => item.isPlatform);

    if (isUsedPlatform) {
        const response = await fetch("/shablons/color.txt")
        let textOfCode = await response.text()
        textOfCode = textOfCode.split('<<separator>>')
        colorDetectClass.value = textOfCode[0]
        colorDetectCode.value += `\t${textOfCode[1].trim()}\n`;
    }

    for (const item of listOfTrips.value) {
        mainCode.value += `\tnavigate_wait(${item.x}, ${item.y})\n`;
        if (isUsedPlatform) {
            mainCode.value += colorDetectCode.value + '\n'
        }
    }
    const response = await fetch("/shablons/emergency_and_navigate.txt")
    let textOfCode = await response.text()
    finallyText.value = textOfCode.replace("<<main>>", mainCode.value);
    if (isUsedPlatform) {
        finallyText.value = finallyText.value.replace("<<ColorDetect>>", colorDetectClass.value);
    }
    isModalVisible.value = true;
}

function cancel() {

    if (clickCount.value === 1) {
        return;
    } else {
        numbers.value[listOfTrips.value.at(-1).index].variable.pop();
        listOfTrips.value.pop();
        clickCount.value--;
    }
}

function cleanResult() {
    clickCount.value = 1;
    listOfTrips.value = [];
    for (let i = 0; i < 100; i++) {
        numbers.value[i].variable = [];
        numbers.value[i].BgImg = 'images/ArUco-marker.jpg'
    }
}

// Обрабатываем нажатие Ctrl + Z
const handleKeydown = (event) => {
    if (event.ctrlKey && event.code === "KeyZ" && listOfTrips.value.length) {
        event.preventDefault();
        cancel();
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
    if (!item.isPlatform) {
        listOfTrips.value.push(item)
        numbers.value[item.index].variable.push(clickCount.value);
    }
    item['isPlatform'] = true
    numbers.value[item.index].BgImg = `images/${color}-platform.jpg`
    clickCount.value++
}

function deletePlatform(item) {
    item['isPlatform'] = false
    const index = listOfTrips.value.indexOf(item);
    if (index !== -1) {
        listOfTrips.value.splice(index, 1);
    }
    numbers.value[item.index].BgImg = 'images/ArUco-marker.jpg'
    clickCount.value--
}

</script>

<template>
    <div class="wraper">
        <div class="grid">
            <div class="square" v-for="(item, index) in numbers" :data-key="index" :key="index"
                 @click="setNumber(item)" @contextmenu.prevent="onContextMenu($event, item)"
                 :style="{backgroundImage: `url(${item.BgImg})`}">
                {{ numbers[index].variable.join(", ") }}
            </div>
        </div>

        <div class="actions">
            <button @click="saveResult">Сохранить</button>
            <button @click="cleanResult">Очистить</button>
            <button @click="cancel">Отменить</button>
        </div>
        <MyDropMenu/>
    </div>


    <MyDialog v-show="isModalVisible" @close="isModalVisible = false" class="dialogWindow"
              :is-success=Boolean(listOfTrips.length)>
        <template #header>
            <strong v-if="listOfTrips.length">Код готов!</strong>
            <strong v-else>Код не готов!</strong>
        </template>
        <template #body>
            <p v-if="listOfTrips.length">Скопируйте или скачайте ваш код</p>
            <p v-else>Выстройте маршрут перед сохранением кода.</p>
        </template>
        <template #footer>
            <div v-if="listOfTrips.length">
                <button @click="handleDownloadBtn">Скачать код</button>
                <button @click="copyAndToast(finallyText)">Скопировать код</button>
                <button @click="isModalVisible = false">ОК</button>
            </div>
        </template>
    </MyDialog>
</template>

<style>
html {
    background-image: radial-gradient(#383838e2, #222222);
}

:root {
    --side: 70px;
}

.wraper {
    display: flex;
    justify-content: center;
}

.grid {
    display: grid;
    padding: 3px;
    grid-template-columns: repeat(10, var(--side));
    gap: 10px;
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
    margin-left: 10px;
    display: flex;
    flex-direction: column;
}

.actions button {
    border: 2px solid rgb(251, 251, 251);
    padding: 15px 30px;
    font-size: 15px;
    background-color: #383838;
    color: white;
    cursor: pointer;
    margin: 5px;
    transition: 0.3s;
}
</style>
