const fetchArticleImages = async (articleId) => {
  try {
    const<template>
  <div class="app-container">
    <!-- Header -->
    <div class="page-header">
      <el-row justify="space-between" align="middle">
        <el-col :span="2" style="text-align: right;">
          <el-button @click="goBack" size="default">
            <el-icon><ArrowLeft /></el-icon>
            Back to List
          </el-button>
        </el-col>
        <el-col :span="20">
          <h1 class="page-title">
            {{ isEdit ? 'Edit Article' : 'Create New Article' }}
          </h1>
          <p class="page-subtitle" v-if="isEdit && article.title">
            Editing: {{ article.title }}
          </p>
        </el-col>
      </el-row>
    </div>

    <!-- Form Card -->
    <el-card class="form-card" shadow="always">
      <el-form
        ref="formRef"
        :model="article"
        :rules="rules"
        label-width="120px"
        label-position="left"
        size="default"
        v-loading="formLoading"
      >
        <el-row :gutter="24">
          <!-- Left Column -->
          <el-col :span="16">
            <el-form-item label="Title" prop="title">
              <el-input
                v-model="article.title"
                placeholder="Enter article title"
                maxlength="255"
                show-word-limit
                size="large"
              />
            </el-form-item>

            <el-form-item label="Description" prop="description">
              <el-input
                v-model="article.description"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="Enter article description"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="Content" prop="content">
              <div class="editor-container">
                <el-text size="small" type="info">
                  <quill-editor
                    v-model:content="article.content"
                    style="height: 250px"
                    :toolbar="[
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['clean']
                    ]"
                  />
                </el-text>
              </div>
            </el-form-item>

            <el-form-item label="Images">
              <div class="upload-section">
                <el-upload
                  ref="uploadRef"
                  v-model:file-list="fileList"
                  :http-request="handleUploadRequest"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :on-remove="handleRemove"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :limit="20"
                  :on-exceed="handleExceed"
                  list-type="picture-card"
                  multiple
                  accept="image/*"
                  :auto-upload="true"
                >
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <div class="upload-text">Upload Images</div>
                </el-upload>

                <div class="upload-tips">
                  <el-text size="small" type="info">
                    <el-icon><InfoFilled /></el-icon>
                    Support JPG, PNG, GIF formats. Max 5MB per image. Maximum 20 images.
                  </el-text>
                </div>

                <!-- Gallery Images with Caption -->
                <div v-if="uploadedImages.length > 0" class="uploaded-gallery-list">
                  <div v-for="(image, index) in uploadedImages" :key="image.id" class="gallery-card">
                    <div class="gallery-card-image">
                      <img :src="image.url" :alt="image.alt_text" />
                    </div>
                    <div class="gallery-card-content">
                      <el-input
                        v-model="image.caption"
                        placeholder="Enter caption..."
                        size="small"
                        @blur="updateImageCaption(image)"
                      />
                      <el-input
                        v-model="image.alt_text"
                        placeholder="Enter alt text..."
                        size="small"
                        @blur="updateImageCaption(image)"
                        style="margin-top: 8px;"
                      />
                      <div class="gallery-card-actions">
                        <el-button
                          type="danger"
                          size="small"
                          @click="removeUploadedImage(index)"
                          :icon="Delete"
                        >
                          Remove
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="Document Type">
              <el-input
                v-model="article.document_type"
                placeholder="Enter document type (optional)"
                maxlength="100"
              />
            </el-form-item>

            <el-form-item label="PDF Attachment">
              <div class="attachment-section">
                <!-- Upload Area -->
                <el-upload
                  v-if="!article.attachment"
                  ref="attachmentUploadRef"
                  :http-request="handleAttachmentUpload"
                  :before-upload="beforeAttachmentUpload"
                  :show-file-list="false"
                  accept=".pdf"
                  drag
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop PDF file here or <em>click to upload</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      PDF files only. Maximum size: 10MB
                    </div>
                  </template>
                </el-upload>

                <!-- Attachment Preview -->
                <div v-else class="attachment-preview">
                  <div class="attachment-info">
                    <el-icon class="pdf-icon" :size="40"><document /></el-icon>
                    <div class="attachment-details">
                      <div class="attachment-name">{{ article.attachment.name }}</div>
                      <div class="attachment-size">{{ article.attachment.formatted_size }}</div>
                    </div>
                  </div>
                  <div class="attachment-actions">
                    <el-button
                      type="primary"
                      size="small"
                      @click="downloadAttachment"
                      :icon="Download"
                    >
                      Download
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeAttachment"
                      :icon="Delete"
                    >
                      Remove
                    </el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>

          <!-- Right Column -->
          <el-col :span="8">
            <div class="sidebar-form">
              <el-form-item label="Type" prop="type">
                <el-select
                  v-model="article.type"
                  placeholder="Select type"
                  style="width: 100%"
                  size="large"
                >
                  <el-option label="SOP" value="SOP">
                    <span style="float: left">SOP</span>
                    <span style="float: right; color: #8492a6;">Standard Operating Procedure</span>
                  </el-option>
                  <el-option label="Kebijakan" value="Kebijakan">
                    <span style="float: left">Kebijakan</span>
                    <span style="float: right; color: #8492a6;">Policy</span>
                  </el-option>
                  <el-option label="Panduan" value="Panduan">
                    <span style="float: left">Panduan</span>
                    <span style="float: right; color: #8492a6;">Guide</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="Category" prop="category_id">
                <el-select
                  v-model="article.category_id"
                  placeholder="Select category"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="Status" prop="status">
                <el-radio-group v-model="article.status" style="width: 100%">
                  <el-radio-button label="draft" style="width: 50%">
                    <el-icon><Document /></el-icon>
                    Draft
                  </el-radio-button>
                  <el-radio-button label="published" style="width: 50%">
                    <el-icon><Check /></el-icon>
                    Published
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <!-- Article Info (for edit mode) -->
              <div v-if="isEdit && article.id" class="article-info">
                <el-divider content-position="left">Article Information</el-divider>

                <div class="info-item">
                  <span class="info-label">ID:</span>
                  <span class="info-value">{{ article.id }}</span>
                </div>

                <div class="info-item">
                  <span class="info-label">Created:</span>
                  <span class="info-value">{{ formatDate(article.created_at) }}</span>
                </div>

                <div class="info-item" v-if="article.published_at">
                  <span class="info-label">Published:</span>
                  <span class="info-value">{{ formatDate(article.published_at) }}</span>
                </div>

                <div class="info-item" v-if="article.user">
                  <span class="info-label">Author:</span>
                  <span class="info-value">{{ article.user.name }}</span>
                </div>

                <el-divider />

                <el-button
                  type="info"
                  @click="goToGallery"
                  style="width: 100%;"
                  :disabled="!article.id"
                >
                  <el-icon><Picture /></el-icon>
                  Manage Gallery ({{ article.gallery_count || 0 }})
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- Action Buttons -->
        <el-divider />
        <div class="form-actions">
          <el-button @click="goBack" size="large">
            Cancel
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
            size="large"
          >
            <el-icon><Check /></el-icon>
            {{ isEdit ? 'Update Article' : 'Create Article' }}
          </el-button>
          <el-button
            v-if="isEdit"
            type="success"
            @click="handleSubmitAndPublish"
            :loading="submitLoading"
            :disabled="article.status === 'published'"
            size="large"
          >
            <el-icon><Upload /></el-icon>
            Save & Publish
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- Image Preview Dialog -->
    <el-dialog
      v-model="previewDialogVisible"
      title="Image Preview"
      width="50%"
      center
    >
      <el-image
        :src="previewImageUrl"
        style="width: 100%; max-height: 70vh;"
        fit="contain"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, onUnmounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Document,
  Check,
  Upload,
  Picture,
  Plus,
  InfoFilled
} from '@element-plus/icons-vue'
import {
  getAdminArticle,
  createAdminArticle,
  updateAdminArticle,
  uploadArticleImage,
  deleteArticleImage,
  linkTemporaryImagesToArticle,
  cleanupTemporaryImages,
  getTemporaryGallery,
  updateAdminArticleImage
} from '@/api/article'
import { getAdminCategories } from '@/api/category'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Quill from 'quill'

const route = useRoute()
const router = useRouter()

const attachmentUploadRef = ref()
const attachmentFile = ref(null)

// State
const formRef = ref()
const uploadRef = ref()
const formLoading = ref(false)
const submitLoading = ref(false)
const categories = ref([])
const fileList = ref([])
const uploadedImages = ref([])
const previewDialogVisible = ref(false)
const previewImageUrl = ref('')

// Upload configuration
const uploadHeaders = ref({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Accept': 'application/json'
})
const uploadData = computed(() => {
  const data = {}

  // Jika sedang edit artikel, kirim article_id
  if (isEdit.value && article.id) {
    data.article_id = article.id
  }

  return data
})
const convertDeltaToHtml = (delta) => {
  if (typeof delta === 'string') {
    return delta // Sudah HTML
  }

  if (delta && delta.ops) {
    // Buat temporary Quill instance
    const tempQuill = new Quill(document.createElement('div'))
    tempQuill.setContents(delta)
    return tempQuill.root.innerHTML
  }

  return ''
}
// Computed
const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => route.params.id)

// Form data
const article = reactive({
  id: null,
  title: '',
  description: '',
  content: '',
  type: '',
  category_id: null,
  status: 'draft',
  document_type: '',
  gallery_count: 0,
  created_at: null,
  published_at: null,
  user: null,
  images: [],
  attachment: null
})

// Validation rules
const rules = reactive({
  title: [
    { required: true, message: 'Title is required', trigger: 'blur' },
    { min: 5, max: 255, message: 'Title should be 5-255 characters', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Type is required', trigger: 'change' }
  ],
  category_id: [
    { required: true, message: 'Category is required', trigger: 'change' }
  ],
  status: [
    { required: true, message: 'Status is required', trigger: 'change' }
  ]
})

const beforeAttachmentUpload = (file) => {
  const isPDF = file.type === 'application/pdf'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isPDF) {
    ElMessage.error('Only PDF files are allowed!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('PDF size must be less than 10MB!')
    return false
  }

  return true
}

const handleAttachmentUpload = async (options) => {
  const { file } = options

  try {
    attachmentFile.value = file

    // Store file info for display before submit
    article.attachment = {
      name: file.name,
      size: file.size,
      formatted_size: formatFileSize(file.size),
      file: file // Store the actual file
    }

    ElMessage.success('PDF attached successfully! Remember to save the article.')
  } catch (error) {
    console.error('Attachment error:', error)
    ElMessage.error('Failed to attach PDF')
  }
}

const removeAttachment = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove this attachment?',
      'Confirm Remove',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    if (isEdit.value && article.id) {
      // If editing, call API to remove from server
      const response = await deleteAttachment(article.id)
      if (response.success) {
        article.attachment = null
        attachmentFile.value = null
        ElMessage.success('Attachment removed successfully!')
      }
    } else {
      // If creating new, just remove from local state
      article.attachment = null
      attachmentFile.value = null
      ElMessage.success('Attachment removed')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Remove attachment error:', error)
      ElMessage.error('Failed to remove attachment')
    }
  }
}

const downloadAttachment = async () => {
  if (!article.id) {
    ElMessage.warning('Please save the article first')
    return
  }

  try {
    const response = await downloadAttachment(article.id)

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', article.attachment.name)
    document.body.appendChild(link)
    link.click()
    link.remove()

    ElMessage.success('Download started')
  } catch (error) {
    console.error('Download error:', error)
    ElMessage.error('Failed to download attachment')
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }

  return `${size.toFixed(2)} ${units[unit]}`
}

// Methods
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.push('/admin/articles/list')
}

const goToGallery = () => {
  if (article.id) {
    router.push(`/admin/articles/${article.id}/gallery`)
  }
}

// Upload methods
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Only image files are allowed!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Image size must be less than 5MB!')
    return false
  }

  // Add article_id to upload data if editing
  if (isEdit.value && article.id) {
    uploadData.value.article_id = article.id
  }

  return true
}
const generateSessionKey = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// State tambahan
const sessionKey = ref(generateSessionKey())

// Fixed handleUploadRequest function
const handleUploadRequest = async (options) => {
  const { file, onProgress, onSuccess, onError } = options

  try {
    const formData = new FormData()
    formData.append('file', file)

    // Jika sedang edit artikel, kirim article_id
    if (isEdit.value && article.id) {
      formData.append('article_id', article.id)
    } else {
      // Jika create mode, kirim session_key
      formData.append('session_key', sessionKey.value)
    }

    onProgress({ percent: 30 })

    const response = await uploadArticleImage(formData)

    onProgress({ percent: 100 })

    if (response.success) {
      onSuccess(response, file)
    } else {
      onError(new Error(response.message || 'Upload failed'), response)
    }
  } catch (error) {
    console.error('Upload error:', error)

    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      onError(new Error(errorMessage), error.response.data)
    } else {
      onError(error)
    }
  }
}
const updateImageCaption = async (image) => {
  if (!image.id) return

  try {
    const payload = {
      caption: image.caption || '',
      alt_text: image.alt_text || ''
    }

    const response = await updateAdminArticleImage(image.id, payload) // pastikan API-nya ada

    if (response.success !== false) {
      ElMessage.success('Image caption updated successfully')
    } else {
      ElMessage.error(response.message || 'Failed to update caption')
    }
  } catch (error) {
    console.error('Error updating image caption:', error)
    ElMessage.error('Error updating image caption')
  }
}

// 🗑️ Hapus gambar dari gallery dan upload preview
const removeUploadedImage = async (index) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this image?',
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const image = uploadedImages.value[index]

    // Panggil API delete
    const response = await deleteArticleImage(image.id)

    if (response.success) {
      // Hapus dari daftar gallery
      uploadedImages.value.splice(index, 1)
      article.images = [...uploadedImages.value]

      // Sinkronkan juga ke fileList upload (hapus preview)
      const uploadIndex = fileList.value.findIndex(f => {
        const uploadedId = f.response?.data?.id || f.id
        return uploadedId === image.id
      })
      if (uploadIndex > -1) {
        fileList.value.splice(uploadIndex, 1)
      }

      // Jika preview sedang menampilkan gambar ini, tutup dialog
      if (previewDialogVisible.value && previewImageUrl.value === image.url) {
        previewDialogVisible.value = false
        previewImageUrl.value = ''
      }

      if (isEdit.value) {
        article.gallery_count = uploadedImages.value.length
      }

      ElMessage.success('Image deleted successfully!')
    } else {
      ElMessage.error(response.message || 'Failed to delete image')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete image error:', error)
      ElMessage.error('Failed to delete image')
    }
  }
}


const handleUploadError = (error, file, fileList) => {
  console.error('Upload error:', error)
  ElMessage.error('Upload failed!')

  // Remove failed file from list
  const index = fileList.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    fileList.splice(index, 1)
  }
}

const handleRemove = (file, fileList) => {
  // If file has response (successfully uploaded), we might want to delete from server
  if (file.response && file.response.success) {
    // You can add API call here to delete from server if needed
    const imageIndex = uploadedImages.value.findIndex(img => img.id === file.response.data.id)
    if (imageIndex > -1) {
      uploadedImages.value.splice(imageIndex, 1)
      article.images = [...uploadedImages.value]

      if (isEdit.value) {
        article.gallery_count = uploadedImages.value.length
      }
    }
  }
}

const handlePreview = (file) => {
  if (file.url) {
    previewImageUrl.value = file.url
  } else if (file.response && file.response.data.url) {
    previewImageUrl.value = file.response.data.url
  } else {
    // For local preview before upload
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
  previewDialogVisible.value = true
}

const handleExceed = (files, fileList) => {
  ElMessage.warning(`Maximum 10 images allowed. You selected ${files.length} files, current total: ${fileList.length}`)
}
const temporaryImages = ref([])

const fetchCategories = async () => {
  try {
    const response = await getAdminCategories()
    if (response.success !== false) {
      categories.value = response.data || response || []
    }
  } catch (error) {
    console.error('Fetch categories error:', error)
    ElMessage.error('Failed to load categories')
  }
}

const fetchArticle = async () => {
  if (!articleId.value) return

  formLoading.value = true
  try {
    const response = await getAdminArticle(articleId.value)

    if (response.success !== false) {
      const data = response.article || response

      // Convert HTML content to Quill Delta format
      let contentForEditor = data.content || ''
      if (typeof contentForEditor === 'string' && contentForEditor.trim()) {
        contentForEditor = convertHtmlToDelta(contentForEditor)
      }

      Object.assign(article, {
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        content: contentForEditor, // Use converted content
        type: data.type || '',
        category_id: data.category_id,
        status: data.status || 'draft',
        document_type: data.document_type || '',
        gallery_count: data.gallery_count || 0,
        created_at: data.created_at,
        published_at: data.published_at,
        user: data.user,
        images: data.images || [],
        attachment: data.attachment || null
      })

      // Populate uploaded images if they exist
      if (data.images && data.images.length > 0) {
        uploadedImages.value = data.images.map(img => ({
          id: img.id,
          url: img.url,
          name: img.name,
          size: img.size
        }))
      }
    } else {
      ElMessage.error('Article not found')
      goBack()
    }
  } catch (error) {
    console.error('Fetch article error:', error)
    ElMessage.error('Failed to load article')
    goBack()
  } finally {
    formLoading.value = false
  }
}

const convertHtmlToDelta = (html) => {
  if (!html) return ''

  // Jika sudah dalam format Delta
  if (typeof html === 'object' && html.ops) {
    return html
  }

  try {
    const tempContainer = document.createElement('div')
    const tempQuill = new Quill(tempContainer)
    tempQuill.clipboard.dangerouslyPasteHTML(html)
    return tempQuill.getContents()
  } catch (error) {
    console.error('Error converting HTML to Delta:', error)
    return '' // Return empty string jika gagal
  }
}

const handleSubmit = async (publishAfterSave = false) => {
  if (!formRef.value) return

  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid) return

  submitLoading.value = true

  // Convert content to HTML
  let contentHtml = article.content
  if (typeof article.content === 'object' && article.content.ops) {
    contentHtml = convertDeltaToHtml(article.content)
  }

  try {
    let response

    if (isEdit.value) {
      // Untuk UPDATE: Gunakan FormData dengan proper handling
      const formData = new FormData()
      formData.append('title', article.title)
      formData.append('description', article.description)
      formData.append('content', contentHtml)
      formData.append('type', article.type)
      formData.append('category_id', article.category_id)
      formData.append('status', publishAfterSave ? 'published' : article.status)

      if (article.document_type) {
        formData.append('document_type', article.document_type)
      }

      // Add attachment if exists
      if (attachmentFile.value) {
        formData.append('attachment', attachmentFile.value)
      }

      // Add flag to remove attachment if needed
      if (!article.attachment && !attachmentFile.value) {
        formData.append('remove_attachment', '1')
      }

      // PENTING: Tambahkan _method untuk Laravel
      formData.append('_method', 'PUT')

      // Debug: Log formData contents
      console.log('FormData contents:')
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      response = await updateAdminArticle(article.id, formData)

    } else {
      // Untuk CREATE
      const formData = new FormData()
      formData.append('title', article.title)
      formData.append('description', article.description)
      formData.append('content', contentHtml)
      formData.append('type', article.type)
      formData.append('category_id', article.category_id)
      formData.append('status', publishAfterSave ? 'published' : article.status)

      if (article.document_type) {
        formData.append('document_type', article.document_type)
      }

      if (attachmentFile.value) {
        formData.append('attachment', attachmentFile.value)
      }

      response = await createAdminArticle(formData)

      // Link temporary images if any
      if (response.success !== false && uploadedImages.value.length > 0) {
        const newArticleId = response.id || response.data.id
        await linkTemporaryImagesToArticleFixed(newArticleId)
      }
    }

    if (response.success !== false) {
      const action = isEdit.value ? 'updated' : 'created'
      const publishText = publishAfterSave ? ' and published' : ''
      ElMessage.success(`Article ${action}${publishText} successfully`)

      if (!isEdit.value && (response.id || response.data?.id)) {
        const newId = response.id || response.data.id
        router.push(`/admin/articles/edit/${newId}`)
      } else if (isEdit.value) {
        await fetchArticle()
      }
    } else {
      ElMessage.error(response.message || `Failed to ${isEdit.value ? 'update' : 'create'} article`)
    }
  } catch (error) {
    console.error('Submit error:', error)

    // Better error handling
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      ElMessage.error(`Validation errors: ${errorMessages}`)
    } else if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('Failed to save article')
    }
  } finally {
    submitLoading.value = false
  }
}

const linkTemporaryImagesToArticleFixed = async (articleId) => {
  try {
    const response = await linkTemporaryImagesToArticle(articleId, sessionKey.value)

    if (response.success) {
      console.log(`Linked ${response.linked_count || 0} temporary images to article`)
    } else {
      console.error('Failed to link temporary images:', response.message)
    }
  } catch (error) {
    console.error('Error linking temporary images:', error)
  }
}

const cleanupTemporaryImagesFixed = async () => {
  if (!isEdit.value && uploadedImages.value.length > 0) {
    try {
      const response = await cleanupTemporaryImages(sessionKey.value)
      if (response.success) {
        console.log('Temporary images cleaned up successfully')
      }
    } catch (error) {
      console.error('Error cleaning up temporary images:', error)
    }
  }
}

// Add cleanup on component unmount
onUnmounted(() => {
  cleanupTemporaryImagesFixed()
})

onBeforeRouteLeave((to, from, next) => {
  if (!isEdit.value && uploadedImages.value.length > 0) {
    ElMessageBox.confirm(
      'You have uploaded images that are not saved. Are you sure you want to leave?',
      'Unsaved Changes',
      {
        confirmButtonText: 'Leave',
        cancelButtonText: 'Stay',
        type: 'warning',
      }
    )
    .then(() => {
      cleanupTemporaryImagesFixed() // Gunakan method yang sudah diperbaiki
      next()
    })
    .catch(() => {
      next(false)
    })
  } else {
    next()
  }
})

// Update handleUploadSuccess untuk handle temporary images
const handleUploadSuccess = (response, file, fileList) => {
  if (response.success) {
    ElMessage.success('Image uploaded successfully!')

    const imageData = {
      id: response.data.id,
      url: response.data.url,
      name: response.data.name,
      size: response.data.size,
      formatted_size: response.data.formatted_size,
      dimensions: response.data.dimensions,
      alt_text: response.data.alt_text,
      caption: response.data.caption,
      is_primary: response.data.is_primary
    }

    if (isEdit.value) {
      // Untuk edit mode, langsung tambahkan ke uploadedImages
      uploadedImages.value.push(imageData)
      article.images = [...uploadedImages.value]
      article.gallery_count = uploadedImages.value.length
    } else {
      // Untuk create mode, simpan di temporaryImages
      temporaryImages.value.push(response.data.id)
      uploadedImages.value.push(imageData)
    }
  } else {
    ElMessage.error(response.message || 'Upload failed!')
    // Remove failed file from list
    const index = fileList.findIndex(item => item.uid === file.uid)
    if (index > -1) {
      fileList.splice(index, 1)
    }
  }
}

// Reset form method update
const resetForm = () => {
  Object.assign(article, {
    id: null,
    title: '',
    description: '',
    content: '',
    type: '',
    category_id: null,
    status: 'draft',
    document_type: '',
    gallery_count: 0,
    created_at: null,
    published_at: null,
    user: null,
    images: []
  })

  fileList.value = []
  uploadedImages.value = []
  temporaryImages.value = [] // Reset temporary images
}

const handleSubmitAndPublish = async () => {
  await handleSubmit(true)
}

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value) {
    await fetchArticle()
  }
})
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #909399;
}

.form-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sidebar-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.editor-container {
  position: relative;
}

.content-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.editor-help {
  margin-top: 8px;
  text-align: center;
}

/* Upload Section Styles */
.upload-section {
  width: 100%;
}

.upload-tips {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #c0c4cc;
}

.upload-text {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

/* Uploaded Images Preview */
.uploaded-images-preview {
  margin-top: 20px;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.image-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.preview-image {
  width: 80px;
  height: 80px;
  display: block;
}

.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.article-info {
  margin-top: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
}

.info-label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}

.form-actions {
  text-align: center;
  padding: 20px 0;
}

.form-actions .el-button {
  margin: 0 8px;
}

/* Element Plus customizations */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  font-family: inherit;
}

:deep(.content-editor .el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.el-radio-button__inner) {
  border-radius: 4px !important;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 4px 0 0 4px !important;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 4px 4px 0 !important;
}

:deep(.el-card__body) {
  padding: 30px;
}

/* Upload component customization */
:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
  border-radius: 6px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
  border-radius: 6px;
}

/* Responsive design */
@media (max-width: 1200px) {
  .app-container {
    padding: 16px;
  }

  :deep(.el-col) {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .form-actions .el-button {
    margin: 4px;
    width: calc(50% - 8px);
  }

  .image-list {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .preview-image {
    width: 60px;
    height: 60px;
  }
}

.quill-full {
  width: 100%;
}

.editor-container {
  width: 100%;
}
</style>
