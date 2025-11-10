import React, { useState, useRef } from "react";
import { io } from "socket.io-client";

export default function Guest({ eventId }) {
  const [photo, setPhoto] = useState(null);
  const [sending, setSending] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socket = useRef(null);

  // Conecta ao servidor WebSocket
  React.useEffect(() => {
    socket.current = io("/", { transports: ["websocket"] });
    return () => socket.current.disconnect();
  }, []);

  // Abre a câmera
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      alert("Não foi possível acessar a câmera.");
      console.error(err);
    }
  }

  // Tira a foto
  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);
    video.srcObject.getTracks().forEach(track => track.stop());
  }

  // Envia a foto para o administrador
  function sendPhoto() {
    if (!photo) return;
    setSending(true);
    socket.current.emit("photo", { eventId, image: photo });
    setTimeout(() => {
      setSending(false);
      alert("Foto enviada com sucesso!");
      setPhoto(null);
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-4 font-bold">📸 Tire sua foto!</h1>

      {!photo ? (
        <div className="relative w-64 h-64 bg-gray-700 flex items-center justify-center rounded-2xl shadow-lg">
          <video ref={videoRef} className="absolute w-full h-full object-cover rounded-2xl" />
          <button
            onClick={openCamera}
            className="z-10 flex flex-col items-center justify-center text-center"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2920/2920223.png" alt="Camera" className="w-16 h-16 opacity-80" />
            <p className="mt-2">Clique para abrir a câmera</p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img src={photo} alt="Capturada" className="w-64 h-auto rounded-xl shadow-lg" />
          <button
            onClick={sendPhoto}
            disabled={sending}
            className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold"
          >
            {sending ? "Enviando..." : "Enviar foto"}
          </button>
          <button
            onClick={() => setPhoto(null)}
            className="mt-2 text-sm text-gray-300 underline"
          >
            Tirar outra
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
