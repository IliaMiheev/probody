<template>
  <div class="dropdown">
    <button @click="toggleDropdown">☰ Меню</button>
    <ul v-show="isOpen" class="dropdown-menu-left">
      <li><a href="#">Пункт 1</a></li>
      <li><a href="#">Пункт 2</a></li>
      <li><a href="#">Пункт 3</a></li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
</script>

<style>
.dropdown-menu-left {
  position: absolute;
  left: 0;
  top: 100%;
  background: #fff;
  border: 1px solid #ccc;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.dropdown-menu-left li a {
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
}

.dropdown-menu-left li a:hover {
  background: #f0f0f0;
}
</style>