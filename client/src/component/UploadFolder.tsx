'use client'

import { useState } from "react";

export default function UploadFolder() {
  const [file, setFile] = useState<File | null>(null)
  async function uploadHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (file) {
      const formData = new FormData()
      formData.append('raw_data', file)
      console.log(file, "ini setelah upload data");
      try {
        const response = await fetch ('http://localhost:3000/uploadData', {
          method: `POST`,
          body: formData
        })
        
      } catch (error) {
        console.log('gagal upload data');
        
      }
    }
  }

  async function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      console.log(selectedFile, "File selected");
    } else {
      setFile(null)
      console.log("No file selected");
    }
  }
  return (
    <>
      <form onSubmit={uploadHandler}>
        <input type="file" onChange={changeHandler} />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
