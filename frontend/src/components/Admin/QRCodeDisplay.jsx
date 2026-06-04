import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRCodeDisplay() {
  const formUrl = 'http://localhost:5173/form'
  const qrRef = useRef(null)
  const [size, setSize] = useState(256)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qr-testimonial.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handlePrint = () => {
    const win = window.open('')
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    win.document.write(`<img src="${canvas.toDataURL()}" onload="window.print();window.close()" />`)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <h3 className="font-semibold text-slate-800 mb-1">QR Code Form</h3>
      <p className="text-sm text-slate-500 mb-6">
        Scan untuk membuka form testimonial
      </p>

      <div className="flex flex-col items-center gap-6">
        <div ref={qrRef} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <QRCodeCanvas value={formUrl} size={size} level="H" />
        </div>

        <div className="text-sm text-slate-400 text-center break-all max-w-sm">
          {formUrl}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Ukuran:</label>
          <input
            type="range"
            min={128}
            max={512}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-slate-500">{size}px</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 shadow-lg shadow-teal-200 transition-all"
          >
            Download PNG
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}
