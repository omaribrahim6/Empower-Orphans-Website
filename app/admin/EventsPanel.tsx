'use client'

import { useState, useEffect, useRef } from 'react'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import { Modal, ConfirmModal } from '@/components/admin/Modal'
import { createEvent, updateEvent, deleteEvent, getEvents } from './actions/events'

interface Event {
  id: string
  title: string
  date: string
  location?: string
  description?: string
  link?: string
  image_url?: string
  chapter?: string
  created_at: string
  updated_at: string
}

type FormMode = 'create' | 'edit' | null

export default function EventsPanel() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { toasts, addToast, dismissToast } = useToast()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    const result = await getEvents()
    if (result.success && result.data) {
      setEvents(result.data)
    } else {
      addToast(result.error || 'Failed to load events', 'error')
    }
    setLoading(false)
  }

  function openCreateForm() {
    setSelectedEvent(null)
    setFormMode('create')
  }

  function openEditForm(event: Event) {
    setSelectedEvent(event)
    setFormMode('edit')
  }

  function closeForm() {
    setFormMode(null)
    setSelectedEvent(null)
  }

  function confirmDelete(event: Event) {
    setEventToDelete(event)
    setDeleteModalOpen(true)
  }

  async function handleDelete() {
    if (!eventToDelete) return

    const result = await deleteEvent(eventToDelete.id)

    if (result.success) {
      addToast('Event deleted successfully', 'success')
      await loadEvents()
    } else {
      addToast(result.error || 'Delete failed', 'error')
    }

    setDeleteModalOpen(false)
    setEventToDelete(null)
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true)

    let result
    if (formMode === 'create') {
      result = await createEvent(formData)
    } else if (formMode === 'edit' && selectedEvent) {
      result = await updateEvent(selectedEvent.id, formData)
    }

    if (result?.success) {
      addToast(
        formMode === 'create' ? 'Event created successfully' : 'Event updated successfully',
        'success'
      )
      await loadEvents()
      closeForm()
    } else {
      addToast(result?.error || 'Operation failed', 'error')
    }

    setSubmitting(false)
  }

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    )
  })

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-brand font-bold text-eo-dark">
            Events ({events.length})
          </h2>
          <p className="text-sm text-gray-500 font-sub mt-1">
            Manage your organization's events
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-eo-teal hover:bg-eo-dark text-white font-sub font-semibold rounded-lg
                   transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                   flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Event
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg font-sub
                   focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 font-sub mt-4">
            {searchQuery ? 'No events match your search' : 'No events yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Image */}
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-brand font-bold text-lg text-eo-dark mb-1">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 font-sub mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(event.date).toLocaleString()}
                    </span>

                    {event.location && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
                      </span>
                    )}

                    {event.chapter && (
                      <span className="px-2 py-1 bg-eo-bg text-eo-dark text-xs rounded-full font-semibold">
                        {event.chapter}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 font-sub line-clamp-2 mb-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(event)}
                      className="px-3 py-1.5 text-eo-teal hover:bg-eo-bg font-sub font-medium rounded-lg
                               transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(event)}
                      className="px-3 py-1.5 text-red-600 hover:bg-red-50 font-sub font-medium rounded-lg
                               transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-sub font-medium rounded-lg
                                 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Link →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formMode && (
        <EventForm
          mode={formMode}
          event={selectedEvent}
          onSubmit={handleSubmit}
          onClose={closeForm}
          submitting={submitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setEventToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

interface EventFormProps {
  mode: 'create' | 'edit'
  event: Event | null
  onSubmit: (formData: FormData) => void
  onClose: () => void
  submitting: boolean
}

function EventForm({ mode, event, onSubmit, onClose, submitting }: EventFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image_url || null)
  
  // Live preview states
  const [previewTitle, setPreviewTitle] = useState(event?.title || 'Enter event title')
  const [previewDate, setPreviewDate] = useState(event?.date || new Date().toISOString())
  const [previewLocation, setPreviewLocation] = useState(event?.location || '')
  const [previewDescription, setPreviewDescription] = useState(event?.description || '')
  const [previewChapter, setPreviewChapter] = useState(event?.chapter || '')

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      onSubmit(formData)
    }
  }

  // Format datetime-local value
  const defaultDateTime = event?.date
    ? new Date(event.date).toISOString().slice(0, 16)
    : ''

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={mode === 'create' ? 'Create Event' : 'Edit Event'}
      size="large"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 font-sub font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-form"
            disabled={submitting}
            className="px-4 py-2 font-sub font-medium text-white bg-eo-teal rounded-lg
                     hover:bg-eo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <form ref={formRef} id="event-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={event?.title || ''}
            onChange={(e) => setPreviewTitle(e.target.value || 'Enter event title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
          />
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Event Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            defaultValue={defaultDateTime}
            onChange={(e) => setPreviewDate(e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={event?.location || ''}
            onChange={(e) => setPreviewLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
          />
        </div>

        {/* Chapter */}
        <div>
          <label htmlFor="chapter" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Chapter
          </label>
          <select
            id="chapter"
            name="chapter"
            defaultValue={event?.chapter || ''}
            onChange={(e) => setPreviewChapter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
          >
            <option value="">All</option>
            <option value="carleton">Carleton</option>
            <option value="uottawa">uOttawa</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={event?.description || ''}
            onChange={(e) => setPreviewDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent resize-none"
          />
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Event Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={event?.link || ''}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent"
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-brand font-semibold text-eo-dark mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sub
                     focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                     file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                     file:bg-eo-bg file:text-eo-dark file:font-sub file:font-medium
                     hover:file:bg-eo-sky/50 file:cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Max 25MB, images only</p>
        </div>
      </form>

        {/* Live Preview Section */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-eo-teal animate-pulse"></div>
            <h3 className="text-lg font-brand font-bold text-eo-dark">Live Preview</h3>
          </div>
          
          {/* Preview Card - Matches actual event card styling */}
          <div className="rounded-3xl border border-eo-blue/20 bg-white overflow-hidden shadow-lg max-w-sm mx-auto">
            {imagePreview ? (
              <div className="relative h-48 bg-gradient-to-br from-eo-bg to-eo-sky overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-48 bg-gradient-to-br from-eo-bg to-eo-sky flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-eo-dark/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-eo-teal/10 text-eo-teal text-xs font-semibold rounded-full">
                  {new Date(previewDate).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {previewChapter && (
                  <span className="px-3 py-1 bg-eo-blue/10 text-eo-blue text-xs font-semibold rounded-full capitalize">
                    {previewChapter}
                  </span>
                )}
              </div>

              <h3 className="font-brand text-2xl font-bold text-eo-dark mb-3">
                {previewTitle}
              </h3>

              {previewDescription && (
                <p className="text-eo-dark/70 leading-relaxed mb-4">
                  {previewDescription}
                </p>
              )}

              {previewLocation && (
                <div className="flex items-center gap-2 text-sm text-eo-dark/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {previewLocation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

