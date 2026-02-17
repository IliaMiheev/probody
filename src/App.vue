<script setup>
import { ref, onMounted  } from 'vue';
import izitoast from "./izitoast";

// const numbers = ref(Array(100).fill('')); // Инициализируем массив с пустыми строками
const numbers = ref([]); // Инициализируем массив с пустыми строками
const clickCount = ref(1); // Счетчик нажатий
const listOfTrips = ref([])

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
    //если нажимаем на ранее отмеченную клетку (не последнюю), то вывбодится ошибка
    listOfTrips.value.push(item)
    if (numbers.value[item.index].variable.at(-1) === clickCount.value-1) {
      izitoast.error({title:'Ошибка', message:'Нельзя выбирать один и тот же aruco маркер 2 раза подряд'})
      return 
    }
    // numbers.value[item.index].variable = `${item.variable}, ${clickCount.value}`
    numbers.value[item.index].variable.push(clickCount.value) 
    clickCount.value++;

  }
}

function saveResult() {
  let finallyText = '';
  for (const item of listOfTrips.value) {
    finallyText += `navigate_wait(${item.x}, ${item.y})\n`;
  }
  console.log(finallyText);
  izitoast.info({
    title: 'Информация',
    message: "Посмотри в консоли путь дрона. Ctrl + Shift + I или F12"
  });
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
</template>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(10, 50px);
  gap: 10px;
}

.square {
  width: 50px;  /* Ширина квадрата */
  height: 50px; /* Высота квадрата */
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.square:hover {
  background-color: #d0d0d0;
}
.square[data-key='90'] {
  background-color: red;
}
</style>
