<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="closeModal">
      <div class="modal" @click.stop>
        <header class="modal-header">
          <slot name="header">
            <strong>Заголовок по умолчанию</strong>
          </slot>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть модальное окно">
            ×
          </button>
        </header>
        <section class="modal-body">
          <slot name="body">Тело по умолчанию</slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn-green" @click="closeModal">Закрыть</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
const emit = defineEmits(['close'])
function closeModal() {
    emit('close');
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 90%;
  border-radius: 5px;
}

.modal-header,
.modal-footer {
  padding: 10px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 0;
  cursor: pointer;
  font-weight: bold;
  color: #4AAE9B;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4AAE9B;
  border: 1px solid #4AAE9B;
  border-radius: 2px;
  padding: 5px;
  margin: 0 5px;
}

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>   