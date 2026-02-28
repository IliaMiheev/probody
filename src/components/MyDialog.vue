<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="closeModal">
      <div class="modal" @click.stop>
        <header :class="['modal-header', isSuccess ? 'modal-header-success': 'modal-header-error']">
          <slot name="header">
            <strong>Заголовок по умолчанию</strong>
          </slot>
          <button class="modal-btn-close" @click="closeModal" aria-label="Закрыть модальное окно">
            ×
          </button>
        </header>
        <section class="modal-body">
          <slot name="body">Тело по умолчанию</slot>
        </section>
        <footer :class="['modal-footer', isSuccess ? 'modal-footer-success': 'modal-footer-error']">
          <slot name="footer">
            <button  @click="closeModal">Закрыть</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
const emit = defineEmits(['close'])
const props = defineProps({
  isSuccess: {
    type: Boolean,
    required: true
  }
})
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
  background: #2f2f2f;
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
  justify-content: space-between;
}
.modal-header-success {
  color: #4AAE9B;
}
.modal-header-error {
  color: red;
}

.modal-header [type = 'button'] {
  color: red;
  font-size: 25px;
}

.modal-footer {
  justify-content: flex-end;
  border-top: 1px solid white;
}
.modal-footer [type = 'button'] {
  justify-content: flex-end;
  border-top: 1px solid white;
  padding: 5px;
}
.modal-footer-success [type = 'button'] {
  background-color: #4AAE9B;
  border: none;
  margin: 3px;
}
.modal-footer-error [type = 'button'] {
  background: red;
  border: none;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  color: white
}

.modal-btn-close {
  border: none;
  font-size: 20px;
  padding: 0;
  cursor: pointer;
  font-weight: bold;
  color: red;
  background: transparent;
}
</style>   