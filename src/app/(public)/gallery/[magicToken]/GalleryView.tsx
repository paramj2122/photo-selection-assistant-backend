'use client'

import { useState, useCallback } from 'react'
import { Heart, Maximize2, X, ChevronLeft, ChevronRight, Save } from 'lucide-react'

type Photo = {
  id: string
  drive_preview_public_url: string | null
  width: number | null
  height: number | null
  selectedByClient: boolean
  selectedByPhotographer: boolean
}

export default function GalleryView({ 
  initialPhotos, 
  magicToken,
  isReadOnly 
}: { 
  initialPhotos: Photo[]
  magicToken: string
  isReadOnly: boolean
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const selectedCount = photos.filter(p => p.selectedByClient).length

  const toggleSelection = useCallback((id: string) => {
    if (isReadOnly) return
    setPhotos(current => 
      current.map(p => 
        p.id === id ? { ...p, selectedByClient: !p.selectedByClient } : p
      )
    )
    // Clear save message on new changes
    setSaveMessage(null)
  }, [isReadOnly])

  const saveSelections = async () => {
    if (isReadOnly) return
    setSaving(true)
    setSaveMessage(null)
    
    try {
      const selections = photos.map(p => ({
        photo_id: p.id,
        is_selected: p.selectedByClient
      }))

      const res = await fetch(`/api/gallery/${magicToken}/selections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_by: 'client', selections })
      })

      if (!res.ok) throw new Error('Failed to save')
      setSaveMessage('Selections saved!')
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage('Error saving.')
    } finally {
      setSaving(false)
    }
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextPhoto = () => setLightboxIndex(i => (i !== null && i < photos.length - 1 ? i + 1 : i))
  const prevPhoto = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))

  return (
    <div className="relative pb-24">
      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="relative group break-inside-avoid animate-fade-in rounded-xl overflow-hidden bg-foreground/5">
            {/* The actual image */}
            {photo.drive_preview_public_url ? (
               <img 
                 src={photo.drive_preview_public_url} 
                 alt="Gallery preview" 
                 className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                 loading="lazy"
                 onClick={() => openLightbox(idx)}
               />
            ) : (
              <div className="w-full aspect-[3/2] flex items-center justify-center text-foreground/30" onClick={() => openLightbox(idx)}>
                No Image
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

            {/* Selection indicator */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleSelection(photo.id); }}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                photo.selectedByClient 
                  ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/40' 
                  : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100'
              }`}
              disabled={isReadOnly}
            >
              <Heart size={20} className={photo.selectedByClient ? 'fill-current' : ''} />
            </button>

            {/* Expand indicator */}
            <button
              onClick={(e) => { e.stopPropagation(); openLightbox(idx); }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-md"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      {!isReadOnly && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md">
          <div className="glass rounded-full p-2 pr-4 flex items-center justify-between shadow-2xl border border-foreground/10 animate-slide-up">
            <div className="flex items-center gap-3 px-4">
              <div className="bg-red-500/10 p-2 rounded-full">
                <Heart size={20} className="text-red-500 fill-current" />
              </div>
              <span className="font-semibold">{selectedCount} selected</span>
            </div>
            <div className="flex items-center gap-3">
              {saveMessage && <span className="text-sm font-medium text-green-600 dark:text-green-400">{saveMessage}</span>}
              <button
                onClick={saveSelections}
                disabled={saving}
                className="bg-foreground text-background px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={32} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }} 
            className="absolute left-6 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20"
            disabled={lightboxIndex === 0}
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full px-16 flex flex-col items-center">
            {photos[lightboxIndex].drive_preview_public_url && (
              <img 
                src={photos[lightboxIndex].drive_preview_public_url!} 
                alt="Fullscreen view" 
                className="max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
            )}
            
            <button
              onClick={() => toggleSelection(photos[lightboxIndex].id)}
              disabled={isReadOnly}
              className={`mt-8 px-8 py-3 rounded-full flex items-center gap-3 font-semibold transition-all text-lg ${
                photos[lightboxIndex].selectedByClient 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart size={24} className={photos[lightboxIndex].selectedByClient ? 'fill-current' : ''} />
              {photos[lightboxIndex].selectedByClient ? 'Selected' : 'Select Photo'}
            </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }} 
            className="absolute right-6 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20"
            disabled={lightboxIndex === photos.length - 1}
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  )
}
