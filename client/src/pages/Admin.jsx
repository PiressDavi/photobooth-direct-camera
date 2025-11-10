import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function Admin({ eventId }) {
  const [photos, setPhotos] = useState([]);
  const socket = React.useRef(null);

  useEffect(() => {
    socket.current = io("/", { transports: ["websocket"] });
    socket.current.on("photo", (data) => {
      if (data.eventId === eventId) {
        setPhotos((prev) => [data.image, ...prev]);
      }
    });
    return () => socket.current.disconnect();
  }, [eventId]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📸 Painel do Anfitrião — {eventId}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((img, i) => (
          <div key={i} className="bg-gray-800 p-2 rounded-xl">
            <img src={img} alt={`Foto ${i}`} className="rounded-lg" />
            <a
              href={img}
              download={`foto_${i + 1}.jpg`}
              className="block mt-2 text-center bg-green-500 hover:bg-green-600 py-1 rounded-lg"
            >
              Baixar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
