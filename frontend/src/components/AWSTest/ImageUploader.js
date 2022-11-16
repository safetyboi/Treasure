import { useState } from "react";
import jwtFetch from "../../store/jwt";

const UploadImages = () => {
  const [imageFiles, setImageFlies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(imageFiles);

    jwtFetch("/api/users/add-profile-picture", {
      method: "POST",
      body: JSON.stringify({ files: imageFiles }),
    });
  };

  const handleFiles = (e) => {
    // console.log(e.target.files);
    setImageFlies(e.target.files);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input onChange={handleFiles} type="file" name="images" multiple />
      <button>submit</button>
    </form>
  );
};

export default UploadImages;