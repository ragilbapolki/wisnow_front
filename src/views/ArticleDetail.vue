
<!-- ArticleDetailNew.vue -->
<template>
  <div class="article-detail-page">
    <header class="main-header">
      <div class="header-container">
        <div class="header-logo">
          <router-link to="/" class="logo-link">
            <span class="company-name-header">WISMILAK</span>
            <span class="company-subtitle">Knowledge Base</span>
          </router-link>
        </div>

        <div class="header-actions">
          <div v-if="isAuthenticated" class="user-menu">
            <div class="user-info">
              <img
                :src="user.avatar || '/default-avatar.png'"
                :alt="user.name"
                class="user-avatar"
              />
              <span class="user-name">{{ user.name }}</span>
              <div class="user-dropdown">
                <router-link v-if="user.role === 'admin'" to="/admin/dashboard" class="dropdown-item">
                  🏛️ Admin Dashboard
                </router-link>
                <a href="#" @click.prevent="handleLogout" class="dropdown-item"> 🚪 Logout </a>
              </div>
            </div>
          </div>
          <button v-else @click="openLoginModal" class="login-button">Login</button>
        </div>
      </div>
    </header>

    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="breadcrumb-content">
        <router-link to="/" class="breadcrumb-link">Beranda</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link
          v-if="article?.category"
          :to="{ name: 'PublicArticleList', query: { category: article.category.slug } }"
          class="breadcrumb-link"
        >
          {{ article.category.name }}
        </router-link>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{{ article?.title }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="content-wrapper">
      <div class="content-container">
        <!-- Main Content -->
        <div class="main-content">
          <!-- Article Header -->
          <div class="article-header">
            <span :class="getArticleTypeClass(article.type)" class="article-badge">
              {{ article.type }}
            </span>
            <span class="category-badge">{{ article.category?.name }}</span>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>

          <!-- Author Info -->
          <div class="author-section">
            <img
              :src="article.user?.avatar || '/default-avatar.png'"
              :alt="article.user?.name"
              class="author-avatar"
            />
            <div class="author-info">
              <div class="author-name">{{ article.user?.name }}</div>
              <div class="author-role">{{ article.user?.position || 'Manajer SDM' }}</div>
            </div>
            <div class="article-date">
              Terakhir diperbarui: {{ formatDate(article.updated_at) }}
            </div>
          </div>

          <!-- Article Stats -->
          <div class="article-stats">
            <div class="stat-item">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>{{ article.view_count }}</span>
            </div>
            <div class="stat-item">
              <svg class="stat-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>{{ formatRating(article.rating) }} ({{ article.rating_count }})</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="handlePrint" class="btn-action btn-print">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Cetak
            </button>
            <button @click="handleShare" class="btn-action btn-share">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Bagikan
            </button>
          </div>

          <!-- PDF Attachment Section -->
          <div v-if="article.attachment_path" class="attachment-section">
            <h2 class="section-title">Lampiran Dokumen</h2>
            <div class="attachment-card">
              <div class="attachment-header">
                <div class="attachment-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3 3 3-3"/>
                  </svg>
                </div>
                <div class="attachment-info">
                  <div class="attachment-name">{{ getAttachmentName() }}</div>
                  <div class="attachment-meta">
                    <span v-if="article.attachment_size">{{ formatFileSize(article.attachment_size) }}</span>
                  </div>
                </div>
                <el-button @click="downloadAttachment" type="danger" size="small">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download
                </el-button>
              </div>

              <!-- PDF Preview -->
              <div class="pdf-preview">
                <iframe
                  :src="getPdfUrl()"
                  class="pdf-iframe"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Gallery Section -->
          <div v-if="galleryImages.length > 0" class="gallery-section">
            <h2 class="section-title">Gambar</h2>
            <div class="gallery-grid">
              <div
                v-for="(image, index) in galleryImages"
                :key="image.id"
                class="gallery-item"
                @click="openGallery(index)"
              >
                <img :src="image.url || image.path" :alt="image.alt_text || `Gallery ${index + 1}`" />
                <div class="gallery-overlay">
                  <svg class="gallery-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                </div>
                <div class="gallery-label" v-if="image.caption">
                  {{ image.caption }}
                </div>
              </div>
            </div>
          </div>

          <!-- Article Content -->
          <div class="article-content">
            <div v-html="article.content"></div>
          </div>

          <!-- Rating Section -->
          <div class="rating-section">
            <h2 class="section-title">Beri Rating</h2>
            <div class="rating-display">
              <el-rate
                v-model="userRating.rating"
                :size="'large'"
                show-text
                :texts="['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik']"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              />
            </div>
          </div>

          <!-- Comments Section -->
          <div class="comments-section">
            <h2 class="section-title">Komentar ({{ article.ratings?.length || 3 }})</h2>

            <div class="comment-form" v-if="isAuthenticated">
              <textarea
                v-model="userRating.comment"
                placeholder="Tulis komentar Anda..."
                class="comment-input"
                rows="4"
              ></textarea>
              <button
                @click="submitRating"
                class="btn-submit-comment"
                :disabled="submittingRating"
              >
                {{ submittingRating ? 'Mengirim...' : 'Kirim Komentar' }}
              </button>
            </div>

            <div class="comments-list">
              <div class="comment-item" v-for="rating in article.ratings" :key="rating.id">
                <div class="comment-avatar-wrapper">
                  <div class="comment-avatar">
                    {{ rating.user?.name?.charAt(0) || 'S' }}
                  </div>
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ rating.user?.name }}</span>
                    <span class="comment-date">{{ formatDateShort(rating.created_at) }}</span>
                  </div>
                  <div class="comment-rating">
                    <el-rate
                      :model-value="rating.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                  <p class="comment-text">{{ rating.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Related Articles -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">Artikel Terkait</h3>
            <div class="related-articles">
              <router-link
                v-for="related in relatedArticles"
                :key="related.id"
                :to="{ name: 'ArticleDetail', params: { slug: related.slug } }"
                class="related-item"
              >
                <div class="related-badge-wrapper">
                  <span :class="getArticleTypeClass(related.type)" class="related-badge">
                    {{ related.type }}
                  </span>
                </div>
                <span class="related-title">{{ related.title }}</span>
              </router-link>
            </div>
          </div>

          <!-- Document Info -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">Informasi Dokumen</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Dibuat pada</span>
                <span class="info-value">{{ formatDateShort(article.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Diperbarui pada</span>
                <span class="info-value">{{ formatDateShort(article.updated_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Kategori</span>
                <span class="info-value">{{ article.category?.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tipe Dokumen</span>
                <span class="info-value">{{ article.type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Penulis</span>
                <span class="info-value">{{ article.user?.name }}</span>
              </div>
            </div>
            <button class="btn-history">Lihat Riwayat Perubahan</button>
          </div>
        </aside>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <h2>Artikel tidak ditemukan</h2>
      <button @click="goBack" class="btn-back">Kembali</button>
    </div>

    <!-- Gallery Modal -->
    <div v-if="galleryModalOpen" class="gallery-modal" @click="closeGallery">
      <div class="gallery-modal-content" @click.stop>
        <button class="gallery-close" @click="closeGallery">×</button>
        <button class="gallery-prev" @click="prevImage" v-if="galleryImages.length > 1">‹</button>
        <button class="gallery-next" @click="nextImage" v-if="galleryImages.length > 1">›</button>
        <img
          :src="galleryImages[currentGalleryIndex]?.url || galleryImages[currentGalleryIndex]?.path"
          :alt="galleryImages[currentGalleryIndex]?.alt_text"
          class="gallery-modal-image"
        />
        <div class="gallery-caption" v-if="galleryImages[currentGalleryIndex]?.caption">
          {{ galleryImages[currentGalleryIndex].caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleBySlug, rateArticle } from '@/api/article'
import { getArticleGallery } from '@/api/article'
import { ElMessage } from 'element-plus'
import { dispatch, ctx } from '@/store'

const route = useRoute()
const router = useRouter()
const isAuthenticated = computed(() => !!dispatch.user.getToken())
const user = computed(() => ctx.userInfo || {})
const loading = ref(true)
const article = ref(null)
const relatedArticles = ref([])
const galleryImages = ref([])
const galleryModalOpen = ref(false)
const currentGalleryIndex = ref(0)

// Rating state
const userRating = ref({
  rating: 5,
  comment: ''
})
const submittingRating = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('id-ID', options)
}

const formatDateShort = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('id-ID', options)
}

const formatRating = (rating) => {
  const numRating = parseFloat(rating) || 0
  return numRating.toFixed(1)
}

const getArticleTypeClass = (type) => {
  const typeMap = {
    'SOP': 'badge-red',
    'Panduan': 'badge-green',
    'Tutorial': 'badge-blue',
    'Kebijakan': 'badge-purple',
    'Artikel': 'badge-gray'
  }
  return typeMap[type] || 'badge-gray'
}

const openGallery = (index) => {
  currentGalleryIndex.value = index
  galleryModalOpen.value = true
}

const closeGallery = () => {
  galleryModalOpen.value = false
}

const nextImage = () => {
  currentGalleryIndex.value = (currentGalleryIndex.value + 1) % galleryImages.value.length
}

const prevImage = () => {
  currentGalleryIndex.value = (currentGalleryIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const submitRating = async () => {
  if (!userRating.value.rating) {
    ElMessage.warning('Silakan pilih rating terlebih dahulu')
    return
  }

  submittingRating.value = true
  try {
    await rateArticle(article.value.id, {
      rating: userRating.value.rating,
      comment: userRating.value.comment
    })

    ElMessage.success('Penilaian berhasil disimpan')

    // Reload article to get updated ratings
    await loadArticle()

    // Reset form
    userRating.value = { rating: 5, comment: '' }
  } catch (error) {
    console.error('Error submitting rating:', error)
    ElMessage.error('Gagal menyimpan penilaian')
  } finally {
    submittingRating.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.description,
        url: window.location.href
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        copyToClipboard()
      }
    }
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  ElMessage.success('Link berhasil disalin')
}

const goBack = () => {
  router.back()
}

const handleLogout = async () => {
  await dispatch.user.logout()
  ElMessage.success('Berhasil logout')
  router.push('/')
}

const getAttachmentName = () => {
  if (!article.value?.attachment_path) return 'Document.pdf'
  const path = article.value.attachment_path
  const fileName = path.split('/').pop()
  return fileName || 'Document.pdf'
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const kb = bytes / 1024
  const mb = kb / 1024
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  return `${kb.toFixed(2)} KB`
}

const getPdfUrl = () => {
  if (!article.value?.attachment_path) return ''
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  return `${baseUrl}/storage/${article.value.attachment_path}`
}

const downloadAttachment = () => {
  if (!article.value?.attachment_path) return
  const url = getPdfUrl()
  const link = document.createElement('a')
  link.href = url
  link.download = getAttachmentName()
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('Download dimulai')
}

const openLoginModal = () => {
  // Implement login modal
  router.push('/login')
}

const loadArticle = async () => {
  loading.value = true
  try {
    const response = await getArticleBySlug(route.params.slug)
    console.info(response);
    const data = response.data || response
    article.value = data.article
    relatedArticles.value = data.related_articles || []

    // Map gallery from API
    if (article.value && article.value.gallery) {
      article.value.galleries = article.value.gallery
    }

    // Load gallery images
    if (article.value?.id) {
      await loadGallery()
    }
  } catch (error) {
    console.error('Error loading article:', error)
    ElMessage.error('Gagal memuat artikel')
  } finally {
    loading.value = false
  }
}

const loadGallery = async () => {
  try {
    const response = await getArticleGallery(article.value.id)
    const data = response.data || response

    galleryImages.value = (Array.isArray(data) ? data : []).map(img => ({
      ...img,
      url: img.url || `/storage/${img.path}`
    }))
  } catch (error) {
    console.error('Error loading gallery:', error)
    if (article.value.gallery) {
      galleryImages.value = article.value.gallery.map(img => ({
        ...img,
        url: img.url || `/storage/${img.path}`
      }))
    }
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Header */
.main-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  text-decoration: none;
}

.company-name-header {
  font-size: 1.25rem;
  font-weight: 800;
  color: #000;
  display: block;
}

.company-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.login-button {
  padding: 0.5rem 1.5rem;
  background: white;
  color: #000;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover {
  background: #f9fafb;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f9fafb;
}

.user-info:hover .user-dropdown {
  display: block;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

/* Breadcrumb */
.breadcrumb-container {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.breadcrumb-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #111827;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.breadcrumb-current {
  color: #111827;
}

/* Loading */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Content */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.article-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.article-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-red {
  background: #fee2e2;
  color: #dc2626;
}

.badge-green {
  background: #dcfce7;
  color: #16a34a;
}

.badge-blue {
  background: #dbeafe;
  color: #2563eb;
}

.badge-purple {
  background: #f3e8ff;
  color: #9333ea;
}

.badge-gray {
  background: #f3f4f6;
  color: #6b7280;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  background: #f9fafb;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
}

.article-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

/* Author Section */
.author-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 1.5rem;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: #111827;
}

.author-role {
  font-size: 0.875rem;
  color: #6b7280;
}

.article-date {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Stats */
.article-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #f9fafb;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Gallery */
.gallery-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 16/9;
  background: #f3f4f6;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-icon {
  width: 2rem;
  height: 2rem;
}

.gallery-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Gallery Modal */
.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.gallery-modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.gallery-close,
.gallery-prev,
.gallery-next {
  position: absolute;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.gallery-close:hover,
.gallery-prev:hover,
.gallery-next:hover {
  background: white;
}

.gallery-close {
  top: 1rem;
  right: 1rem;
}

.gallery-prev {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.gallery-next {
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.gallery-caption {
  text-align: center;
  color: white;
  margin-top: 1rem;
  font-size: 1rem;
}

/* Article Content */
.article-content {
  margin: 2rem 0;
  line-height: 1.8;
  color: #374151;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.article-content :deep(code) {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.article-content :deep(pre) {
  background: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

/* Rating Section */
.rating-section {
  margin: 2rem 0;
  padding: 2rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.rating-display {
  text-align: left;
}

.rating-stars-large {
  display: flex;
  gap: 0.25rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.star-large {
  cursor: pointer;
  color: #fbbf24;
  transition: color 0.2s;
}

.star-large:not(.active) {
  color: #fbbf24;
}

.rating-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Comments Section */
.comments-section {
  margin: 2rem 0;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
}

.comment-input:focus {
  outline: none;
  border-color: #9ca3af;
}

.btn-submit-comment {
  padding: 0.625rem 1.25rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.btn-submit-comment:hover:not(:disabled) {
  background: #4b5563;
}

.btn-submit-comment:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
}

.comment-avatar-wrapper {
  flex-shrink: 0;
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 1rem;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.comment-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.related-articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.related-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.related-badge-wrapper {
  display: flex;
}

.related-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.related-title {
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 500;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #111827;
}

.btn-history {
  width: 100%;
  margin-top: 1rem;
  padding: 0.625rem;
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-history:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Error State */
.error-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
}

.error-container h2 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 1rem;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #1f2937;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }
}

@media (max-width: 768px) {
  .header-container,
  .breadcrumb-content,
  .content-wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .main-content {
    padding: 1.5rem;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }
}

@media print {
  .main-header,
  .breadcrumb-container,
  .action-buttons,
  .rating-section,
  .comments-section,
  .sidebar,
  .gallery-modal {
    display: none !important;
  }

  .content-container {
    grid-template-columns: 1fr;
  }

  .main-content {
    box-shadow: none;
    padding: 0;
  }
}
</style>
