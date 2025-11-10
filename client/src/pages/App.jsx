import React, { useState } from 'react'
import QRCode from 'qrcode'

export default function App(){
  const [qrUrl, setQrUrl] = useState('')

  async function gen() {
    const frontend = window.location.origin
    const url = `${frontend}/g/direct`   // QR fixo que leva direto para a câmera
    const dataUrl = await QRCode.toDataURL(url)
    setQrUrl(dataUrl)
  }

  return (
    <div style={{padding:20}}>
      <h1>QR Photobooth — Gerador de QR Direto</h1>
      <button onClick={gen}>Gerar QR Code</button>
      {qrUrl && (
        <div style={{marginTop:20}}>
          <img src={qrUrl} alt="QR Code" style={{width:220, height:220}} />
          <p>Link direto: <a href={`/g/direct`} target="_blank" rel="noreferrer">{`${window.location.origin}/g/direct`}</a></p>
        </div>
      )}
    </div>
  )
}
