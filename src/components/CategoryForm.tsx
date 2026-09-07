'use client';

import { useState } from 'react';
import Image from 'next/image';
import ClientForm from './ClientForm';
import { addCategory, updateCategory } from '@/actions/product';

interface CategoryFormProps {
  actionType: 'add' | 'update';
  category?: { id: string; name: string; imageUrl: string | null };
  predefinedImages: string[];
}

export default function CategoryForm({ actionType, category, predefinedImages }: CategoryFormProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const action = actionType === 'add' ? addCategory : updateCategory;

  return (
    <ClientForm action={action} className="flex flex-col gap-3" successMessage={actionType === 'add' ? 'เพิ่มหมวดหมู่สำเร็จ!' : 'อัปเดตสำเร็จ!'}>
      {actionType === 'update' && category && <input type="hidden" name="id" value={category.id} />}
      {selectedImage && <input type="hidden" name="imagePath" value={selectedImage} />}
      
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full">
        <input 
          type="text" 
          name="name" 
          defaultValue={category?.name || ''} 
          placeholder="ชื่อหมวดหมู่ใหม่" 
          className="border rounded px-3 py-2 flex-1 w-full" 
          required 
        />
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            type="button" 
            onClick={() => setShowPicker(!showPicker)} 
            className="border rounded px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 flex-1 sm:flex-none whitespace-nowrap"
          >
            {selectedImage ? '✔ เลือกรูปสำเร็จ (เปลี่ยน)' : '🖼️ เลือกรูปจากระบบ'}
          </button>
          <span className="text-gray-400 self-center">หรือ</span>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={() => setSelectedImage(null)} // Clear picked if uploading
            className="border rounded px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 w-full sm:w-auto" 
          />
        </div>
        
        <button type="submit" className={`${actionType === 'add' ? 'bg-gray-800' : 'bg-blue-500'} text-white px-4 py-2 rounded hover:${actionType === 'add' ? 'bg-gray-700' : 'bg-blue-600'} whitespace-nowrap w-full sm:w-auto`}>
          {actionType === 'add' ? 'เพิ่มหมวดหมู่' : 'บันทึก'}
        </button>
      </div>

      {showPicker && (
        <div className="mt-2 p-4 border rounded bg-gray-50 h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">เลือกรูปภาพไอคอนหมวดหมู่ (จากระบบ)</h4>
            <button type="button" onClick={() => { setSelectedImage(null); setShowPicker(false); }} className="text-red-500 text-sm hover:underline">ยกเลิกการเลือก</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {predefinedImages.map(img => (
              <div 
                key={img} 
                onClick={() => { setSelectedImage(img); setShowPicker(false); }}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="relative aspect-square bg-white flex items-center justify-center p-2">
                  <Image src={img} alt="icon" fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClientForm>
  );
}
