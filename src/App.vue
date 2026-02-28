<script setup>
import {ref, onMounted} from "vue";
import izitoast from "./izitoast";
import {useEventListener} from "@vueuse/core";
import MyDialog from "./components/MyDialog.vue";
import MyDropMenu from "./components/MyDropMenu.vue";
import copyToclipboard from "./copyToclipboard";

const numbers = ref([]); // Инициализируем массив с пустыми строками
const clickCount = ref(1); // Счетчик нажатий
const listOfTrips = ref([]);
const isModalVisible = ref(false);
let finallyText = "";

onMounted(() => {
    for (let i = 0; i < 100; i++) {
        numbers.value.push({
            variable: [],
            x: i % 10,
            y: 9 - Math.floor(i / 10),
            index: i,
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
        //если нажимаем на ранее отмеченную клетку (не последнюю), то выводится ошибка
        listOfTrips.value.push(item);
        if (numbers.value[item.index].variable.at(-1) === clickCount.value - 1) {
            izitoast.error({
                title: "Ошибка",
                message: "Нельзя выбирать один и тот же aruco маркер 2 раза подряд",
            });
            return;
        }
        numbers.value[item.index].variable.push(clickCount.value);
        clickCount.value++;
    }
}

function saveResult() {
    let navigate_waites = "";
    for (const item of listOfTrips.value) {
    navigate_waites += `\tnavigate_wait(${item.x}, ${item.y})\n`;
    }
    fetch("/shablons/emergency_and_navigate.txt")
        .then((response) => response.text())
        .then((textOfCode) => {
            finallyText = textOfCode.replace("<<navigate_wait>>", navigate_waites);
        });
    isModalVisible.value = true;
}

function cancel() {
    numbers.value[listOfTrips.value.at(-1).index].variable.pop();
    listOfTrips.value.pop();

    if (clickCount.value === 1) {
        return;
    } else {
        clickCount.value--;
    }
}

function cleanResult() {
    clickCount.value = 1;
    numbers.value = [];
    listOfTrips.value = [];
    for (let i = 0; i < 100; i++) {
        numbers.value.push({
            variable: [],
            x: i % 10,
            y: 9 - Math.floor(i / 10),
            index: i,
        });
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
    console.log(finallyText)
    // Создание файла
    const downloadUrl = ref('');
    const blob = new Blob([finallyText], {type: 'text/plain'});
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
</script>

<template>
    <div class="wraper">
        <div class="grid">
            <div
                class="square"
                v-for="(item, index) in numbers"
                :data-key="index"
                :key="index"
                @click="setNumber(item)"
            >
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


    <MyDialog
        v-show="isModalVisible"
        @close="isModalVisible = false"
        class="dialogWindow"
        :is-success=listOfTrips.length
    >
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
                <button type="button" @click="handleDownloadBtn">Скачать код</button>
                <button type="button" @click="copyAndToast(finallyText)">Скопировать код</button>
                <button type="button" @click="isModalVisible = false">ОК</button>
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
    width: var(--side); /* Ширина квадрата */
    height: var(--side); /* Высота квадрата */
    background-image: url("images/image.jpg");
    background-size: cover;
    border: 3px solid rgb(251, 251, 251);
    background-color: #e0e0e0;
    cursor: pointer;
    transition: background-color 0.3s;
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
