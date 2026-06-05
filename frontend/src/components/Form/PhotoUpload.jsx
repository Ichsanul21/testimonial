import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function PhotoUpload({ file, onFileChange }) {
  const [preview, setPreview] = useState(null)
  const compressionRef = useRef(false)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(null)
  }, [file])

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          let { width, height } = img

          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width))
            width = MAX_WIDTH
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Gagal kompres foto'))
              return
            }
            const compressed = new File([blob], 'photo.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressed)
          }, 'image/jpeg', 0.8)
        }
        img.onerror = () => reject(new Error('Gagal membaca foto'))
      }
      reader.onerror = () => reject(new Error('Gagal membaca file'))
    })
  }

  const onDrop = useCallback(
    async (accepted) => {
      if (accepted.length > 0) {
        try {
          compressionRef.current = true
          const compressed = await compressImage(accepted[0])
          onFileChange(compressed)
        } catch {
          onFileChange(accepted[0])
        } finally {
          compressionRef.current = false
        }
      }
    },
    [onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-slate-700">
        Foto <span className="text-slate-400">(opsional, otomatis dikompres)</span>
      </label>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-teal-400 bg-teal-50'
            : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />

        {preview && file ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                URL.revokeObjectURL(preview)
                onFileChange(null)
              }}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold shadow hover:bg-red-600 transition"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">
              {isDragActive ? 'Lepaskan foto di sini...' : 'Klik atau drag & drop foto'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
