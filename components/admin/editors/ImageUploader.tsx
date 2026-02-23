"use client";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      className="image-uploader"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <p>Drag and drop an image here, or click to select</p>
    </div>
  );
}
