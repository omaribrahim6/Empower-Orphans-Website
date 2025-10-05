'use client'

import { useState, useEffect, useRef } from 'react'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import { Modal, ConfirmModal } from '@/components/admin/Modal'
import {
  uploadCarouselImage,
  deleteCarouselImage,
  reorderCarouselImages,
  getCarouselImages,
} from './actions/carousel'

interface CarouselImage {
  id: string
  url: string
  alt?: string
  order: number
  created_at?: string
}

export default function CarouselPanel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<CarouselImage | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toasts, addToast, dismissToast } = useToast()
  
  // Image preview and positioning
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState(50) // Vertical position percentage (0-100)
  const [imageLoadError, setImageLoadError] = useState(false)

  // Load images on mount
  useEffect(() => {
    loadImages()
  }, [])

  async function loadImages() {
    setLoading(true)
    const result = await getCarouselImages()
    if (result.success && result.data) {
      setImages(result.data)
    } else {
      addToast(result.error || 'Failed to load images', 'error')
    }
    setLoading(false)
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      addToast('File size must be less than 25MB', 'error')
      return
    }

    // Use FileReader to create base64 preview (more reliable than blob URLs)
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      console.log('Created preview from FileReader')
      console.log('File details:', { name: file.name, type: file.type, size: file.size })
      setPreviewUrl(url)
      setSelectedFile(file)
      setImagePosition(50) // Reset to center
      setImageLoadError(false) // Reset error state
      setPreviewModalOpen(true)
    }
    reader.onerror = () => {
      console.error('FileReader error')
      addToast('Failed to read image file', 'error')
    }
    reader.readAsDataURL(file)
  }

  async function handleUploadConfirm() {
    if (!selectedFile) return

    setUploading(true)
    setPreviewModalOpen(false)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('position', imagePosition.toString())

    const result = await uploadCarouselImage(formData)

    if (result.success) {
      addToast('Image uploaded successfully', 'success')
      await loadImages()
    } else {
      addToast(result.error || 'Upload failed', 'error')
    }

    setUploading(false)

    // Cleanup
    setPreviewUrl(null)
    setSelectedFile(null)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handlePreviewClose() {
    setPreviewUrl(null)
    setSelectedFile(null)
    setPreviewModalOpen(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
  }

  function confirmDelete(image: CarouselImage) {
    setImageToDelete(image)
    setDeleteModalOpen(true)
  }

  async function handleDelete() {
    if (!imageToDelete) return

    const result = await deleteCarouselImage(imageToDelete.id, imageToDelete.url)

    if (result.success) {
      addToast('Image deleted successfully', 'success')
      await loadImages()
    } else {
      addToast(result.error || 'Delete failed', 'error')
    }

    setDeleteModalOpen(false)
    setImageToDelete(null)
  }

  // Drag and drop reordering
  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
  }

  async function handleDragOverItem(e: React.DragEvent, index: number) {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === index) return

    // Reorder locally
    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    setImages(newImages)
    setDraggedIndex(index)
  }

  async function saveOrder() {
    const order = images.map((img, index) => ({
      id: img.id,
      order: index,
    }))

    const result = await reorderCarouselImages(order)

    if (result.success) {
      addToast('Order saved successfully', 'success')
    } else {
      addToast(result.error || 'Failed to save order', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eo-teal"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Upload Area */}
      <div>
        <h2 className="text-xl font-brand font-bold text-eo-dark mb-4">
          Upload Carousel Image
        </h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${dragOver ? 'border-eo-teal bg-eo-bg/20' : 'border-gray-300 bg-gray-50'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-eo-teal'}
          `}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={uploading}
          />

          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-sm font-sub text-gray-600">
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <span className="font-semibold text-eo-teal">Click to upload</span> or drag
                and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">Image files only, max 25MB</p>
        </div>
      </div>

      {/* Current Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-brand font-bold text-eo-dark">
            Current Images ({images.length})
          </h2>
          {images.length > 0 && (
            <button
              onClick={saveOrder}
              className="px-4 py-2 bg-eo-teal hover:bg-eo-dark text-white font-sub font-medium rounded-lg
                       transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky"
            >
              Save Order
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-sub">No carousel images yet. Upload your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOverItem(e, index)}
                className={`
                  bg-white border-2 rounded-lg p-4 flex items-center gap-4
                  transition-all cursor-move hover:shadow-md
                  ${draggedIndex === index ? 'opacity-50 border-eo-teal' : 'border-gray-200'}
                `}
              >
                {/* Drag Handle */}
                <div className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>

                {/* Order Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-eo-teal text-white rounded-full flex items-center justify-center font-brand font-bold text-sm">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <img
                  src={image.url}
                  alt={`Carousel ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sub text-sm text-gray-900 truncate">
                    {image.alt || `Slide ${index + 1}`}
                  </p>
                  {image.created_at && (
                    <p className="font-sub text-xs text-gray-500">
                      Added {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => confirmDelete(image)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 font-sub font-medium rounded-lg
                           transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview & Crop Modal */}
      {previewModalOpen && previewUrl && (
        <Modal
          isOpen={previewModalOpen}
          onClose={handlePreviewClose}
          title="Preview & Position Carousel Image"
          size="large"
          footer={
            <>
              <button
                type="button"
                onClick={handlePreviewClose}
                className="px-4 py-2 font-sub font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                         transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadConfirm}
                disabled={uploading}
                className="px-4 py-2 font-sub font-medium text-white bg-eo-teal rounded-lg
                         hover:bg-eo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </>
          }
        >
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-eo-bg/30 border border-eo-teal/20 rounded-lg p-4">
              <p className="text-sm font-sub text-eo-dark">
                <span className="font-semibold">Preview how your image will appear in the hero carousel.</span>
                {' '}Use the slider below to adjust the vertical position if your image is cropped.
              </p>
            </div>

            {/* Preview Container */}
            <div className="space-y-4">
              <h3 className="text-lg font-brand font-bold text-eo-dark">Carousel Preview</h3>
              
              {/* Carousel Size Preview */}
              <div 
                className="relative w-full rounded-xl overflow-hidden border-2 border-eo-teal/30 bg-gray-900"
                style={{ height: '60vh' }}
              >
                {imageLoadError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-6">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-sub font-semibold">Failed to load image</p>
                    <p className="text-sm mt-2">URL: {previewUrl}</p>
                  </div>
                ) : (
                  <img
                    src={previewUrl || ''}
                    alt="Carousel Preview"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{ 
                      objectPosition: `center ${imagePosition}%`
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully!')
                      setImageLoadError(false)
                    }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', previewUrl)
                      console.error('Error event:', e)
                      setImageLoadError(true)
                    }}
                  />
                )}
                {/* Overlay to show it's a preview */}
                {!imageLoadError && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                    <span className="text-white text-sm font-sub font-semibold">Live Preview</span>
                  </div>
                )}
              </div>

              {/* Position Control */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-brand font-semibold text-eo-dark mb-2 block">
                    Vertical Position: {imagePosition}%
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-sub">Top</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePosition}
                      onChange={(e) => setImagePosition(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                               [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:bg-eo-teal [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                               [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-eo-teal 
                               [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-sub">Bottom</span>
                  </div>
                </label>
                <p className="text-xs text-gray-500 font-sub">
                  Drag the slider to adjust which part of the image is visible in the carousel.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setImageToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this carousel image? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

