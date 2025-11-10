import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Camera(){
  const { eventId } = useParams()
  const videoRef = useRef()
  const canvasRef = useRef()
  const [photoUrl, setPhotoUrl] = useState('')
  const [streamActive, setStreamActive] = useState(false)

  async function startCamera(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setStreamActive(true)
    } catch (err) {
      alert('Permissão de câmera negada ou dispositivo sem câmera: ' + err.message)
    }
  }

  async function takePhoto(){
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(async blob => {
      // envia para servidor: /upload/:eventId
      const fd = new FormData()
      fd.append('photo', blob, 'photo.jpg')
      const id = eventId || 'direct'
      const res = await fetch(`/upload/${id}`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data && data.url) setPhotoUrl(data.url)
    }, 'image/jpeg', 0.85)

    // para a câmera
    const stream = videoRef.current.srcObject
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStreamActive(false)
  }

  useEffect(() => {
    // autoplay start optional
  }, [])

  return (
    <div style={{textAlign:'center', padding:20}}>
      <h1>📸 Photobooth</h1>
      <p>Mesa: {eventId || 'direct'}</p>
      <video ref={videoRef} autoPlay playsInline style={{width:'100%', maxWidth:420, borderRadius:8, background:'#000'}}></video>
      <canvas ref={canvasRef} style={{display:'none'}}></canvas>
      <div style={{marginTop:10}}>
        {!streamActive ? <button onClick={startCamera}>Ativar Câmera</button> : <button onClick={takePhoto}>Tirar Foto</button>}
      </div>
      {photoUrl && <div style={{marginTop:12}}><img src={photoUrl} alt="foto" style={{width:'80%', maxWidth:420}} /></div>}
    </div>
  )
}
