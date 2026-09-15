import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Tidak dapat mengakses kamera: ' + err.message);
    }
  };

  const captureAndLocate = () => {
    if (!navigator.geolocation) {
      alert('GPS tidak didukung oleh browser Anda.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          setPhoto(blob);
          alert('Foto dan Lokasi berhasil diambil!');
        }, 'image/jpeg');
      },
      (error) => {
        alert('Gagal mendeteksi lokasi GPS: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const submitAttendance = async () => {
    if (!photo || !location) {
      alert('Silakan ambil foto dan aktifkan GPS terlebih dahulu!');
      return;
    }

    setLoading(true);
    try {
      const userId = 'ID_USER_YANG_SEDANG_LOGIN'; 
      const businessId = 1; 

      const fileName = `attendance_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('attendance-photos')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('attendance-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('attendances').insert([
        {
          business_id: businessId,
          user_id: userId,
          photo_url: publicUrlData.publicUrl,
          latitude: location.lat,
          longitude: location.lon,
          status: 'present',
        },
      ]);

      if (dbError) throw dbError;

      alert('Absensi Berhasil Tercatat!');
      setPhoto(null);
    } catch (error) {
      alert('Gagal menyimpan absensi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Absensi Karyawan</h2>
      <div className="flex flex-col items-center">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black h-64 object-cover" />
        <button onClick={startCamera} className="mt-2 text-sm text-blue-600 underline font-medium">
          Aktifkan Kamera
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={captureAndLocate} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
        Ambil Foto & Deteksi Lokasi
      </button>
      {location && (
        <p className="text-xs text-gray-500 text-center">
          Lokasi: {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
        </p>
      )}
      <button 
        onClick={submitAttendance}
        disabled={loading || !photo}
        className={`w-full py-3 rounded-lg font-bold text-white ${loading || !photo ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Mengirim...' : 'Kirim Absensi'}
      </button>
    </div>
  );
          }
