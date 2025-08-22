import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFile: (file: File) => void;
  label: string;
  selectedFile?: File; // Pass selected file from parent component
}

export default function FileUpload({ onFile, label, selectedFile }: FileUploadProps) {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) {
        onFile(files[0]); // <-- Fix: pass only the first file, not the array
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [] },
  });

  return (
    <div style={{ margin: 10 }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #aaa',
          padding: 20,
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#e0f0ff' : 'white',
          borderRadius: '8px',
        }}
      >
        <input {...getInputProps()} />
        <strong>{label}</strong>
        <p>{isDragActive ? 'Drop the file here...' : 'Drag & drop or click to select'}</p>
      </div>

      {/* Show upload success with file name and size */}
      {selectedFile && (
        <div
          style={{
            marginTop: 8,
            padding: 8,
            backgroundColor: '#d4edda',
            borderRadius: '4px',
            color: '#155724',
          }}
        >
          ✅ Uploaded <strong>{selectedFile.name}</strong> successfully
          {typeof selectedFile.size === 'number' && !isNaN(selectedFile.size) && (
            <> ({(selectedFile.size / 1024).toFixed(1)} KB)</>
          )}
        </div>
      )}
    </div>
  );
}
