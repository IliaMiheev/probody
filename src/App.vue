<script setup>
import { ref, onMounted } from 'vue';
import izitoast from "./izitoast";
import { useEventListener } from '@vueuse/core';
import MyDialog from './components/MyDialog.vue';
import copyToclipboard from './copyToclipboard';


const numbers = ref([]); // Инициализируем массив с пустыми строками
const clickCount = ref(1); // Счетчик нажатий
const listOfTrips = ref([])
const isModalVisible = ref(false)
let finallyText = '';

onMounted(()=>{
  for (let i = 0; i < 100; i++) {
    numbers.value.push({
      variable: [],
      x: i % 10,
      y: 9 - Math.floor(i / 10),
      index: i
    });
  }
})

function setNumber(item) {
  let valueOfMarker = item.variable[0];
  //если в клетке нет числа, то оно поставится
  if (valueOfMarker === '') {
    item.variable.push(String(clickCount.value));
    listOfTrips.value.push(item);
    clickCount.value++;
  } else if (valueOfMarker === clickCount.value - 1) {
    //если мы нажимаем на последнюю выбранную клетку, то у неё удаляется число
    item.variable.splice(0, 1) ;
    const index = listOfTrips.value.indexOf(item);
    if (index !== -1) {
      listOfTrips.value.splice(index, 1);
    }
    clickCount.value--;
  } else {
    //если нажимаем на ранее отмеченную клетку (не последнюю), то выводится ошибка
    listOfTrips.value.push(item)
    if (numbers.value[item.index].variable.at(-1) === clickCount.value-1) {
      izitoast.error({
        title:'Ошибка', 
        message:'Нельзя выбирать один и тот же aruco маркер 2 раза подряд'
      })
      return 
    }
    numbers.value[item.index].variable.push(clickCount.value)
    clickCount.value++;

  }
}

function saveResult() {
  let navigate_waites = ''
  for (const item of listOfTrips.value) {
    navigate_waites += `navigate_wait(${item.x}, ${item.y})\n\t`;
  }
  fetch('/shablons/emergency_and_navigate.txt')
    .then(response => response.text())
    .then(textOfCode => {
      finallyText = textOfCode.replace('<<navigate_wait>>', navigate_waites);
    });
  isModalVisible.value = true
}

function cleanResult() {
  clickCount.value = 1
  numbers.value = []
  listOfTrips.value = []
  for (let i = 0; i < 100; i++) {
    numbers.value.push({
      variable: [],
      x: i % 10,
      y: 9 - Math.floor(i / 10),
      index: i
    });
  }
}
// Обрабатываем нажатие Ctrl + Z
const handleKeydown = (event) => {
  if (event.ctrlKey && event.code === 'KeyZ' && listOfTrips.value.length ) {
    event.preventDefault();
    numbers.value[listOfTrips.value.at(-1).index].variable.pop();
    listOfTrips.value.pop();
    
    if (clickCount.value === 1) {
      return
    } else{
      clickCount.value--;
    }
  }
};
useEventListener('keydown', handleKeydown);

function copyAndToast(text){
  copyToclipboard(text)
  izitoast.success({
        title:'Успешно', 
        message:'Код скопирован в буфер обмена'
      })
}
</script>

<template>
  <div class="grid">
    <div
        class="square"
        v-for="(item, index) in numbers"
        :data-key="index"
        :key="index"
        @click="setNumber(item)"
    >
    {{ numbers[index].variable.join(', ') }}
    </div>
  </div>
  <button
    @click="saveResult"
  >Сохранить</button>
    <button
    @click="cleanResult"
  >Очистить</button>

  <MyDialog v-show="isModalVisible" @close="isModalVisible = false">
    <template #header>
      <strong v-if="listOfTrips.length">Код готов!</strong>
      <strong v-else>Код не готов!</strong>
    </template>
    <template #body>
      <p v-if="listOfTrips.length">Скопируйте или скачайте ваш код</p>
      <p v-else>Выстройте маршрут перед сохранением кода.
      </p>
    </template>
    <template #footer>
      <div v-if="listOfTrips.length">
        <button type="button"  class="btn-green" @click="isModalVisible = false">Скачать код</button>
        <button type="button"  class="btn-green" @click="copyAndToast(finallyText)">Скопировать код</button>
      </div>
      <button type="button"  class="btn-green" @click="isModalVisible = false">ОК</button>
    </template>
  </MyDialog>

</template>

<style>
:root{
  --side: 70px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(10, var(--side));
  gap: 10px;
  user-select: none;
}

.square {
  width: var(--side);  /* Ширина квадрата */
  height: var(--side); /* Высота квадрата */
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
  overflow-y: scroll;
}

.square:hover {
  background-color: #d0d0d0;
}
.square::-webkit-scrollbar {
  display: none;
}
.square[data-key='90'] {
  background-color: red;
}
</style>
