<!-- ArticleDetail.vue - FINAL VERSION -->
<template>
  <div class="article-detail-page">
    <PublicHeader />

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
      <p class="loading-text">Memuat artikel...</p>
    </div>

    <!-- Access Denied State -->
    <div v-else-if="accessDenied" class="access-denied-container">
      <div class="access-denied-card">
        <div class="access-denied-icon">
          <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2>Akses Ditolak</h2>
        <p class="access-denied-message">{{ accessDeniedMessage }}</p>

        <div v-if="deniedArticleInfo" class="access-info">
          <p class="access-info-title">Artikel ini hanya dapat diakses oleh:</p>
          <div class="access-tags">
            <div v-if="deniedArticleInfo.divisions && deniedArticleInfo.divisions.length > 0" class="tag-group">
              <span class="tag-label">Divisi:</span>
              <span v-for="div in deniedArticleInfo.divisions" :key="div.id" class="access-tag">
                {{ div.name }}
              </span>
            </div>
            <div v-if="deniedArticleInfo.departments && deniedArticleInfo.departments.length > 0" class="tag-group">
              <span class="tag-label">Departemen:</span>
              <span v-for="dept in deniedArticleInfo.departments" :key="dept.id" class="access-tag">
                {{ dept.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="access-denied-actions">
          <router-link v-if="!isAuthenticated" to="/" class="btn-primary">
            Login untuk Melanjutkan
          </router-link>
          <button @click="goBack" class="btn-secondary">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="content-wrapper">
      <div class="content-container">
        <!-- Main Content -->
        <div class="main-content">
          <!-- Article Header -->
          <div class="article-header">
            <el-tag :type="getTagType(article.type)" size="small" effect="dark">
              {{ article.type }}
            </el-tag>

            <el-tag type="info" size="small">
              {{ article.category?.name }}
            </el-tag>

            <el-tag
              v-if="article.visibility === 'private'"
              type="warning"
              size="small"
            >
              🔒 Private
            </el-tag>
            <el-tag v-else type="success" size="small">
              🌐 Public
            </el-tag>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>

          <!-- Author Section -->
          <div class="author-section">
            <router-link
              :to="{ name: 'AuthorProfile', params: { id: article.user?.id } }"
              class="author-link"
            >
              <img
                :src="article.user?.avatar_url || '/default-avatar.png'"
                :alt="article.user?.name"
                class="author-avatar"
              />
            </router-link>
            <div class="author-info">
              <router-link
                :to="{ name: 'AuthorProfile', params: { id: article.user?.id } }"
                class="author-name-link"
              >
                <div class="author-name">{{ article.user?.name }}</div>
              </router-link>
              <div class="author-role">{{ article.user?.position || 'Kontributor' }}</div>
            </div>
            <div class="article-date">
              Terakhir diperbarui: {{ formatDate(article.updated_at) }}
            </div>
          </div>

          <!-- Article Stats Enhanced -->
          <div class="article-stats-enhanced">
            <div class="stat-card">
              <div class="stat-icon-wrapper views">
                <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ article.view_count }}</span>
                <span class="stat-label">Total Views</span>
              </div>
            </div>

            <div class="stat-card clickable" @click="toggleRatingHistory">
              <div class="stat-icon-wrapper rating">
                <svg class="stat-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ formatRating(article.rating) }}</span>
                <span class="stat-label">{{ article.rating_count }} Ratings</span>
              </div>
              <svg class="expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="showRatingHistory ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"></path>
              </svg>
            </div>
          </div>

          <!-- Rating History Panel -->
          <transition name="slide-down">
            <div v-if="showRatingHistory" class="rating-history-panel">
              <div class="rating-history-header">
                <h3>📊 Rating Distribution</h3>
                <button @click="showRatingHistory = false" class="close-history-btn">×</button>
              </div>
              <div class="rating-distribution">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="distribution-row">
                  <div class="star-label">
                    <svg class="star-icon-small" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span>{{ star }}</span>
                  </div>
                  <div class="distribution-bar-container">
                    <div class="distribution-bar" :style="{ width: getRatingPercentage(star) + '%', backgroundColor: getBarColor(star) }"></div>
                  </div>
                  <span class="distribution-count">{{ getRatingCount(star) }}</span>
                </div>
              </div>
              <div class="rating-summary">
                <div class="summary-item">
                  <span class="summary-label">Average Rating</span>
                  <span class="summary-value">{{ formatRating(article.rating) }}/5.0</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Reviews</span>
                  <span class="summary-value">{{ article.rating_count }}</span>
                </div>
              </div>
            </div>
          </transition>

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

          <!-- Article Content -->
          <div class="article-content" ref="articleContentRef" v-html="article.content"></div>

          <!-- Rating & Comment Section Enhanced -->
          <div class="rating-comment-section">
            <h2 class="section-title">
              <svg class="section-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Beri Rating & Komentar
            </h2>

            <div v-if="isAuthenticated" class="rating-form-card">
              <div class="rating-input-wrapper">
                <label class="rating-label">
                  <svg class="label-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  Rating Anda:
                </label>
                <el-rate
                  v-model="userRating.rating"
                  :size="'large'"
                  show-text
                  :texts="['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik']"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                />
              </div>

              <div class="comment-input-wrapper">
                <label class="comment-label">
                  <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  Komentar (Opsional):
                </label>
                <textarea
                  v-model="userRating.comment"
                  placeholder="Bagikan pengalaman Anda dengan artikel ini..."
                  class="comment-input"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-actions">
                <button
                  @click="submitRating"
                  class="btn-submit-rating"
                  :disabled="submittingRating || !userRating.rating"
                >
                  <svg v-if="!submittingRating" class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div v-else class="spinner-small"></div>
                  {{ submittingRating ? 'Mengirim...' : 'Kirim Rating & Komentar' }}
                </button>
                <p class="helper-text">
                  💡 Rating Anda akan membantu pengguna lain menemukan artikel berkualitas
                </p>
              </div>
            </div>

            <div v-else class="login-prompt">
              <svg class="prompt-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p>Silakan <router-link to="/account/login" class="login-link">login</router-link> untuk memberikan rating dan komentar</p>
            </div>

            <!-- Comments Header -->
            <div class="comments-header">
              <h3 class="comments-title">
                💬 Komentar & Review ({{ article.ratings?.length || 0 }})
              </h3>
              <div class="comments-filter">
                <button
                  :class="['filter-btn', { active: commentFilter === 'all' }]"
                  @click="commentFilter = 'all'"
                >
                  Semua
                </button>
                <button
                  :class="['filter-btn', { active: commentFilter === 'with-comment' }]"
                  @click="commentFilter = 'with-comment'"
                >
                  Dengan Komentar
                </button>
              </div>
            </div>

            <div class="comments-list">
              <div
                class="comment-item"
                v-for="rating in filteredComments"
                :key="rating.id"
              >
                <div class="comment-avatar-wrapper">
                  <div class="comment-avatar">
                    {{ rating.user?.name?.charAt(0) || 'U' }}
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
                  <p v-if="rating.comment" class="comment-text">{{ rating.comment }}</p>
                  <p v-else class="comment-text-empty">Tidak ada komentar</p>
                </div>
              </div>

              <div v-if="filteredComments.length === 0" class="no-comments">
                <svg class="no-comments-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p>Belum ada {{ commentFilter === 'with-comment' ? 'komentar' : 'review' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ Gunakan ArticleSidebar Component -->
        <ArticleSidebar
          :article="article"
          :related-articles="relatedArticles"
          :page-size="5"
        />
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <h2>Artikel tidak ditemukan</h2>
      <button @click="goBack" class="btn-back">Kembali</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleBySlug, rateArticle } from '@/api/article'
import { ElMessage } from 'element-plus'
import { dispatch, ctx } from '@/store'
import PublicHeader from '@/views/public/components/PublicHeader.vue'
import ArticleSidebar from '@/views/public/components/ArticleSidebar.vue'

const route = useRoute()
const router = useRouter()
const isAuthenticated = computed(() => !!dispatch.user.getToken())
const user = computed(() => ctx.userInfo || {})
const loading = ref(true)
const article = ref(null)
const relatedArticles = ref([])
const articleContentRef = ref(null)

const accessDenied = ref(false)
const accessDeniedMessage = ref('')
const deniedArticleInfo = ref(null)

const userRating = ref({
  rating: 5,
  comment: ''
})
const submittingRating = ref(false)
const showRatingHistory = ref(false)
const commentFilter = ref('all')

// Watch route changes to reload article
watch(() => route.params.slug, async (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    console.log('🔄 Route changed, reloading article:', newSlug)
    await loadArticle()
  }
})

// Computed
const filteredComments = computed(() => {
  if (!article.value?.ratings) return []
  if (commentFilter.value === 'all') {
    return article.value.ratings
  }
  return article.value.ratings.filter(r => r.comment && r.comment.trim() !== '')
})

// Rating distribution functions
const getRatingCount = (star) => {
  if (!article.value?.ratings) return 0
  return article.value.ratings.filter(r => r.rating === star).length
}

const getRatingPercentage = (star) => {
  const total = article.value?.rating_count || 0
  if (total === 0) return 0
  const count = getRatingCount(star)
  return Math.round((count / total) * 100)
}

const getBarColor = (star) => {
  const colors = {
    5: '#16a34a',
    4: '#84cc16',
    3: '#eab308',
    2: '#f97316',
    1: '#ef4444'
  }
  return colors[star] || '#9ca3af'
}

const toggleRatingHistory = () => {
  showRatingHistory.value = !showRatingHistory.value
}

const canAccessPrivateArticle = (articleData) => {
  if (articleData.visibility === 'public') return true
  if (!isAuthenticated.value) return false

  const currentUser = user.value
  if (currentUser.role === 'admin') return true

  const allowedDivisions = articleData.divisions?.map(d => d.id) || []
  const hasDivisionAccess = allowedDivisions.includes(currentUser.divisi_id)

  const allowedDepartments = articleData.departments?.map(d => d.id) || []
  const hasDepartmentAccess = allowedDepartments.includes(currentUser.departemen_id)

  return hasDivisionAccess || hasDepartmentAccess
}

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

const getTagType = (type) => {
  const typeMap = {
    'SOP': 'danger',
    'Panduan': 'success',
    'Tutorial': 'primary',
    'Kebijakan': 'warning',
    'Artikel': 'info'
  }
  return typeMap[type] || 'info'
}

const submitRating = async () => {
  if (!userRating.value.rating) {
    ElMessage.warning('Silakan pilih rating terlebih dahulu')
    return
  }

  submittingRating.value = true
  try {
    const response = await rateArticle(article.value.id, {
      rating: userRating.value.rating,
      comment: userRating.value.comment
    })

    ElMessage.success('Rating dan komentar berhasil disimpan')

    if (response.data?.article) {
      article.value = response.data.article
    } else {
      await loadArticle()
    }

    userRating.value = { rating: 5, comment: '' }
  } catch (error) {
    console.error('Error submitting rating:', error)
    ElMessage.error(error.response?.data?.message || 'Gagal menyimpan rating')
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
  router.push('/')
}

const loadArticle = async () => {
  loading.value = true
  accessDenied.value = false
  deniedArticleInfo.value = null

  try {
    const response = await getArticleBySlug(route.params.slug)
    const data = response.data || response

    console.log('📄 Article loaded:', data)

    if (response.success === false && response.message) {
      accessDenied.value = true
      accessDeniedMessage.value = response.message
      loading.value = false
      return
    }

    article.value = data.article

    if (!canAccessPrivateArticle(article.value)) {
      accessDenied.value = true
      deniedArticleInfo.value = {
        divisions: article.value.divisions || [],
        departments: article.value.departments || []
      }

      if (!isAuthenticated.value) {
        accessDeniedMessage.value = 'Artikel ini bersifat private. Silakan login untuk mengakses.'
      } else {
        accessDeniedMessage.value = 'Anda tidak memiliki akses ke artikel ini. Artikel ini hanya dapat diakses oleh divisi atau departemen tertentu.'
      }

      loading.value = false
      return
    }

    relatedArticles.value = data.related_articles || []

    console.log('📚 Related articles loaded:', relatedArticles.value.length)

    await nextTick()
  } catch (error) {
    console.error('❌ Error loading article:', error)

    if (error.response?.status === 403) {
      accessDenied.value = true
      accessDeniedMessage.value = error.response.data?.message || 'Anda tidak memiliki akses ke artikel ini.'
    } else {
      ElMessage.error('Gagal memuat artikel')
    }
  } finally {
    loading.value = false
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.loading-text {
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

/* Access Denied */
.access-denied-container {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
}

.access-denied-card {
  background: white;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.access-denied-icon {
  color: #f59e0b;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.access-denied-card h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.access-denied-message {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.access-info {
  background: #fef9e7;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.access-info-title {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.access-tags {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
}

.tag-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #78350f;
  min-width: 100px;
}

.access-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: white;
  border: 1px solid #fbbf24;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #92400e;
  font-weight: 500;
}

.access-denied-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background: #f9fafb;
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
  flex-wrap: wrap;
  align-items: center;
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

.author-link {
  text-decoration: none;
  transition: opacity 0.2s;
}

.author-link:hover {
  opacity: 0.8;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.2s;
}

.author-avatar:hover {
  transform: scale(1.05);
}

.author-info {
  flex: 1;
}

.author-name-link {
  text-decoration: none;
  transition: color 0.2s;
}

.author-name-link:hover .author-name {
  color: #2563eb;
}

.author-name {
  font-weight: 600;
  color: #111827;
  transition: color 0.2s;
}

.author-role {
  font-size: 0.875rem;
  color: #6b7280;
}

.article-date {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Enhanced Stats */
.article-stats-enhanced {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.stat-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.views {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stat-icon-wrapper.rating {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #374151;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  font-weight: 500;
}

.expand-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  flex-shrink: 0;
}

/* Rating History Panel */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 600px;
  opacity: 1;
  transform: translateY(0);
}

.rating-history-panel {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rating-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rating-history-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-history-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-history-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.distribution-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 2.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.star-icon-small {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}

.distribution-bar-container {
  flex: 1;
  height: 0.75rem;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.distribution-bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.distribution-count {
  min-width: 2.5rem;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.rating-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
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
  border-color: #d1d5db;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
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

.article-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

/* Rating & Comment Section */
.rating-comment-section {
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 2px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.rating-form-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rating-input-wrapper,
.comment-input-wrapper {
  margin-bottom: 1.5rem;
}

.rating-label,
.comment-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.label-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.comment-input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  background: white;
}

.comment-input:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-submit-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-submit-rating:hover:not(:disabled) {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-submit-rating:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.helper-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.prompt-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

.login-prompt p {
  color: #6b7280;
  margin: 0;
}

.login-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Comments Header */
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.comments-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.comments-filter {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-weight: 500;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.filter-btn.active {
  background: #111827;
  color: white;
  border-color: #111827;
}

/* Comments List */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.comment-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-avatar-wrapper {
  flex-shrink: 0;
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
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

.comment-rating {
  margin-bottom: 0.75rem;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
}

.comment-text-empty {
  color: #9ca3af;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
}

.no-comments-icon {
  width: 3rem;
  height: 3rem;
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

  .article-stats-enhanced {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
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

  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }

  .comments-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-summary {
    grid-template-columns: 1fr;
  }

  .breadcrumb-current {
    max-width: 200px;
  }
}

/* Print */
@media print {
  .breadcrumb-container,
  .action-buttons,
  .rating-comment-section,
  .rating-history-panel {
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
