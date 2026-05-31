<template>
  <div class="drone-parts-container">
    <!-- Кнопка возврата в левом верхнем углу -->
    <button class="back-btn" @click="$emit('back')">
      ← Вернуться к маршруту
    </button>

    <!-- Левая панель - список компонентов -->
    <div class="parts-list">
      <div 
        v-for="part in parts" 
        :key="part.id"
        class="part-item"
        :class="{ active: selectedPart?.id === part.id }"
        @click="selectPart(part)"
      >
        <div class="part-image-wrapper">
          <img :src="part.image" :alt="part.name" class="part-thumb" />
        </div>
        <div class="part-info">
          <span class="part-name">{{ part.name }}</span>
          <span class="part-category">{{ part.category }}</span>
        </div>
      </div>
    </div>

    <!-- Правая часть - детали -->
    <div class="main-area">
      <div v-if="selectedPart" class="part-detail">
        <div class="detail-image">
          <img :src="selectedPart.image" :alt="selectedPart.name" />
        </div>
        
        <div class="detail-info">
          <h2>{{ selectedPart.name }}</h2>
          <p class="description">{{ selectedPart.description }}</p>
        </div>
        
        <div class="comments-section">
          <div class="comments-header">
            <h3>📝 Мой комментарий</h3>
          </div>
          
          <div v-if="myComment" class="existing-comment">
            <div class="comment-text">{{ myComment.text }}</div>
            <div class="comment-meta">
              <span class="comment-date">{{ myComment.date }}</span>
              <button class="edit-comment" @click="editComment">✏️ Редактировать</button>
              <button class="delete-comment" @click="deleteComment">🗑️ Удалить</button>
            </div>
          </div>
          
          <div v-else class="add-comment">
            <textarea 
              v-model="commentText" 
              :placeholder="`Мой комментарий к «${selectedPart.name}»...`"
              rows="3"
            ></textarea>
            <div class="comment-actions">
              <button class="save-btn" @click="saveComment" :disabled="!commentText.trim()">
                💾 Сохранить комментарий
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">🛸</div>
        <h3>Выберите компонент дрона</h3>
        <p>Нажмите на любой компонент из списка слева</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['back'])
let db = null

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DroneCommentsDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains('comments')) {
        const store = database.createObjectStore('comments', { keyPath: 'id', autoIncrement: true })
        store.createIndex('part_id', 'part_id', { unique: false })
      }
    }
  })
}

const saveCommentToDB = async (partId, text) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['comments'], 'readwrite')
    const store = transaction.objectStore('comments')
    
    const comment = {
      part_id: partId,
      user_id: 'me',
      text: text,
      date: new Date().toLocaleString('ru-RU'),
      timestamp: Date.now()
    }
    
    const request = store.add(comment)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const loadCommentFromDB = async (partId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['comments'], 'readonly')
    const store = transaction.objectStore('comments')
    const index = store.index('part_id')
    const request = index.getAll(partId)
    
    request.onsuccess = () => {
      const comments = request.result
      const myComment = comments.length > 0 ? comments[comments.length - 1] : null
      resolve(myComment)
    }
    request.onerror = () => reject(request.error)
  })
}

const updateCommentInDB = async (id, newText) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['comments'], 'readwrite')
    const store = transaction.objectStore('comments')
    
    const request = store.get(id)
    request.onsuccess = () => {
      const comment = request.result
      if (comment) {
        comment.text = newText
        comment.date = new Date().toLocaleString('ru-RU')
        comment.timestamp = Date.now()
        
        const updateRequest = store.put(comment)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      } else {
        reject('Comment not found')
      }
    }
    request.onerror = () => reject(request.error)
  })
}

const deleteCommentFromDB = async (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['comments'], 'readwrite')
    const store = transaction.objectStore('comments')
    const request = store.delete(id)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
const parts = ref([])
const selectedPart = ref(null)
const myComment = ref(null)
const commentText = ref('')
const dbReady = ref(false)
const loadParts = async () => {
  try {
    const response = await fetch('/droneComponents/components.json')
    if (response.ok) {
      parts.value = await response.json()
    } else {
      console.error('Файл components.json не найден')
      parts.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки компонентов:', error)
    parts.value = []
  }
}


const selectPart = async (part) => {
  selectedPart.value = part
  if (dbReady.value) {
    const comment = await loadCommentFromDB(part.id)
    myComment.value = comment
    commentText.value = ''
  }
}

// ========== КОММЕНТАРИИ ==========
const saveComment = async () => {
  if (!commentText.value.trim() || !selectedPart.value) return
  
  try {
    await saveCommentToDB(selectedPart.value.id, commentText.value.trim())
    const comment = await loadCommentFromDB(selectedPart.value.id)
    myComment.value = comment
    commentText.value = ''
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  }
}

const editComment = () => {
  if (myComment.value) {
    commentText.value = myComment.value.text
    myComment.value = null
  }
}

const deleteComment = async () => {
  if (!confirm('Удалить комментарий?')) return
  
  try {
    await deleteCommentFromDB(myComment.value.id)
    myComment.value = null
    commentText.value = ''
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
}
onMounted(async () => {
  try {
    db = await openDB()
    dbReady.value = true
    await loadParts()
  } catch (error) {
    console.error('Ошибка открытия IndexedDB:', error)
  }
})
</script>

<style scoped>
.drone-parts-container {
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

/* Кнопка возврата */
.back-btn {
    position: fixed;
    top: 20px;
    right: 20px;  
    z-index: 9999;
    padding: 12px 20px;
    background: linear-gradient(135deg, #ff6b6b, #c92a2a); 
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: transform 0.2s;
}

.back-btn:hover {
    transform: scale(1.02);
}

/* Левая панель с отступом сверху, чтобы не перекрывалась кнопкой */
.parts-list {
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0;
}

.parts-list::-webkit-scrollbar {
  width: 6px;
}

.parts-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.parts-list::-webkit-scrollbar-thumb {
  background: #23aae3;
  border-radius: 3px;
}

.part-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  margin: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
}

.part-item:hover {
  background: rgba(35, 170, 227, 0.2);
  transform: translateX(5px);
}

.part-item.active {
  background: linear-gradient(135deg, #23aae3, #1a6d8f);
  box-shadow: 0 4px 15px rgba(35, 170, 227, 0.3);
}

.part-image-wrapper {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.part-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.part-info {
  flex: 1;
  min-width: 0;
}

.part-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.part-category {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

/* Правая область */
.main-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.part-detail {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 30px;
  backdrop-filter: blur(5px);
}

.detail-image {
  text-align: center;
  margin-bottom: 30px;
}

.detail-image img {
  max-width: 100%;
  max-height: 350px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-info h2 {
  font-size: 28px;
  color: #fff;
  margin-bottom: 15px;
  text-align: center;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin-bottom: 30px;
  white-space: pre-wrap;
}

.comments-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 25px;
}

.comments-header h3 {
  font-size: 18px;
  color: #fff;
  margin: 0 0 20px 0;
}

.existing-comment {
  background: rgba(35, 170, 227, 0.15);
  border-radius: 12px;
  padding: 15px;
  border-left: 3px solid #23aae3;
}

.comment-text {
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.comment-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.comment-meta button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: 0.2s;
}

.edit-comment {
  color: #23aae3;
}

.edit-comment:hover {
  background: rgba(35, 170, 227, 0.2);
}

.delete-comment {
  color: #ff6b6b;
}

.delete-comment:hover {
  background: rgba(255, 107, 107, 0.2);
}

.add-comment textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.add-comment textarea:focus {
  outline: none;
  border-color: #23aae3;
}

.add-comment textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.comment-actions {
  margin-top: 10px;
}

.save-btn {
  background: linear-gradient(135deg, #23aae3, #1a6d8f);
  border: none;
  padding: 10px 24px;
  border-radius: 24px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.save-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 2px 10px rgba(35, 170, 227, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 24px;
  color: #fff;
  margin-bottom: 10px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
}
</style>