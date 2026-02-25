<script setup>
import { ref, onMounted } from "vue";
import izitoast from "./izitoast";
import { useEventListener } from "@vueuse/core";
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
  } else if (valueOfMarker === clickCount.value - 1) {
    //если мы нажимаем на последнюю выбранную клетку, то у неё удаляется число
    item.variable.splice(0, 1);
    const index = listOfTrips.value.indexOf(item);
    if (index !== -1) {
      listOfTrips.value.splice(index, 1);
    }
    clickCount.value--;
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
    navigate_waites += `navigate_wait(${item.x}, ${item.y})\n\t`;
  }
  fetch("/shablons/emergency_and_navigate.txt")
    .then((response) => response.text())
    .then((textOfCode) => {
      finallyText = textOfCode.replace("<<navigate_wait>>", navigate_waites);
    });
  isModalVisible.value = true;
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
    numbers.value[listOfTrips.value.at(-1).index].variable.pop();
    listOfTrips.value.pop();

    if (clickCount.value === 1) {
      return;
    } else {
      clickCount.value--;
    }
  }
};
useEventListener("keydown", handleKeydown);

function copyAndToast(text) {
  copyToclipboard(text);
  izitoast.success({
    title: "Успешно",
    message: "Код скопирован в буфер обмена",
  });
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
      <button @click="cleanResult">Отменить</button>
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
      <p v-if="listOfTrips.length">
        Скопируйте или скачайте ваш код
      </p>
      <p v-else>Выстройте маршрут перед сохранением кода.</p>
    </template>
    <template #footer>
      <div v-if="listOfTrips.length">
        <button type="button" @click="isModalVisible = false">
          Скачать код
        </button>
        <button
          type="button"
          @click="copyAndToast(finallyText)"
        >
          Скопировать код
        </button>
      </div>
      <button type="button"@click="isModalVisible = false">
        ОК
      </button>
    </template>
  </MyDialog>
</template>

<style>
html {
  background-image: radial-gradient(#383838e2, #222222);
  color: white;
}

:root {
  --side: 70px;
}

.wraper {
  display: flex;
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

  color:white;
  text-shadow: 
    -1px -1px 0 black,
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

.modal {
  background-color: #2f2f2f;
}

.modal-body{
  size: 20px;
  font-size: 20px;
}

.btn-green :hover {
  background-color: rgb(229, 67, 67);
}
</style>
