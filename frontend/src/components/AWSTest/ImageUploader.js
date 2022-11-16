import { useState } from "react";
import jwtFetch from "../../store/jwt";

const UploadImages = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageFilesUrls, setImageFilesUrls] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // formData.append("images", imageFiles);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("image", imageFiles[i]);
    }

    await jwtFetch("/api/events/postImages", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleFiles = async (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0];
    // dispatch(uploadPhoto(currentUser._id, file));

    const formData = new FormData();

    formData.append("images", file);

    // for (let i = 0; i < imageFiles.length; i++) {
    //   formData.append("image", imageFiles[i]);
    // }


    await jwtFetch("/api/events/postImages", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

    
        
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input onChange={handleFiles} type="file" multiple />
      <button>submit</button>
    </form>
  );
};

export default UploadImages;