<template>
  <div class="navigation-wrapper">
    <!-- Кнопка Бургер -->
    <button 
      class="burger-btn" 
      @click="toggleMenu" 
      :class="{ 'is-active': isOpen }"
      aria-label="Menu"
    >
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </button>

    <!-- Затемнение заднего фона (Overlay) -->
    <transition name="fade">
      <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
    </transition>

    <!-- Выпадающая панель -->
    <transition name="slide">
      <aside v-if="isOpen" class="side-panel">
        <div class="menu-header">
          <h3>Навигация</h3>
        </div>
        
        <nav class="menu-content">
          <a href="https://clover.coex.tech/ru/simple_offboard.html" target="_blank">COEX Автономный полет</a>
          <slot>
            <p class="placeholder">Здесь будут ваши ссылки...</p>
          </slot>
        </nav>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

// Экспортируем методы, если захотим управлять меню извне
defineExpose({ open: () => (isOpen.value = true), close: closeMenu });
</script>

<style scoped>
.burger-btn {
  position: fixed; /* Она всегда на одном месте при скролле */
  top: 20px;
  left: 20px;
  z-index: 9999; /* Максимальный приоритет, чтобы быть ПОВЕРХ всего */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;      
  height: 30px;
  background: rgba(255, 255, 255, 0.508); 
  border: 1px solid #383838;    
  cursor: pointer;
  padding: 5px;
}

.line {
  width: 100%;
  height: 4px;
  background-color: #383838; /* Ярко-красный цвет для теста */
  transition: all 0.3s ease;
}

/* Анимация бургера в крестик */
.is-active .line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.is-active .line:nth-child(2) { opacity: 0; }
.is-active .line:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* Боковая панель */
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background: white;
  z-index: 1000;
  padding: 80px 20px 20px;
}

/* Затемнение фона */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

/* Анимации появления */
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.placeholder {
  color: #00e44c; 
  /* цвет текста */
  font-style: italic;
}
</style>
