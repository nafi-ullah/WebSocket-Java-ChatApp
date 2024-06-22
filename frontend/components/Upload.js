"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Upload({setMyImageUrl}) {
 

  const { register } = useForm();

  const onSubmit = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sockethub");
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dhqvosimu/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImageData = await uploadResponse.json();
    const imageUrl = uploadedImageData.secure_url;
    setMyImageUrl(imageUrl);
    console.log(imageUrl);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onSubmit(file);
    }
  };

  return (
    <form >
      <input
        {...register("profile")}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
    </form>
  );
}
