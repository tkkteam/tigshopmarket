'use client';

import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploadBox({ existingImagesCount = 0, maxImages = 9 }) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const currentCount = existingImagesCount + previewUrls.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, maxImages - existingImagesCount);
      const urls = filesArray.map(file => URL.createObjectURL(file));
      
      // Cleanup old URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(urls);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">ภาพสินค้า</h3>
      <p className="text-sm text-gray-600 mb-4"><span className="text-red-500">*</span> รูปภาพขนาด 1:1</p>
      
      <div className="flex gap-2 flex-wrap">
        {/* Previews */}
        {previewUrls.map((url, index) => (
          <div key={index} className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden border">
            <Image src={url} alt="Preview" fill className="object-cover" />
          </div>
        ))}
        
        {/* Upload Button */}
        {currentCount < maxImages && (
          <label className="border-[1.5px] border-dashed border-red-300 flex flex-col items-center justify-center w-24 h-24 text-red-500 cursor-pointer hover:bg-red-50 transition-colors">
            <ImagePlus className="w-7 h-7 mb-1 stroke-1" />
            <span className="text-[12px] font-medium leading-tight">เพิ่มรูปภาพ</span>
            <span className="text-[12px] leading-tight">({currentCount}/{maxImages})</span>
            <input 
              type="file" 
              name="images" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 mt-6 rounded text-sm text-gray-600 flex items-center gap-2">
        <div className="w-4 h-4 border border-gray-300 bg-white"></div>
        <p>รูปภาพขนาด 3:4 ดึงดูดผู้ซื้อด้วยรูปภาพขนาด 3:4 สำหรับสินค้าแฟชั่นของคุณ <a href="#" className="text-blue-500 hover:underline">ดูวิธีใช้งาน</a></p>
      </div>
      
      {existingImagesCount > 0 && (
        <p className="text-xs text-gray-500 mt-3">ระบบจะอัปโหลดรูปภาพต่อท้ายรูปภาพเดิมที่มีอยู่ (คุณสามารถลบรูปเดิมได้ด้านบน)</p>
      )}
    </div>
  );
}
