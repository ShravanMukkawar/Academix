import { Link } from "react-router-dom";
import Loading from "./Loading";
import { CiImageOn } from "react-icons/ci";
import { useState } from "react";
import uploadFile from "../utils/UploadFiles";

const ImageUploader = ({ onUploadSuccess }) => {
    const [uploadPhoto, setUploadPhoto] = useState("")
    const [loading, setLoading] = useState(false);
    const handleUploadProfilePhoto = async (e) => {
        const file = e.target.files[0];
        setLoading(true)
        console.log(import.meta.env.VITE_REACT_APP_CLOUDINARY_URL);
        console.log("😒😒😒😒uploadPh");
        const uploadPhoto = await uploadFile(file)
        console.log("😒😒😒😒uploadPhoto", uploadPhoto.secure_url);
        setLoading(false)
        if (onUploadSuccess) {
            onUploadSuccess(uploadPhoto.secure_url);
        }
        setUploadPhoto(file)
    }
  return (
    <div className=' flex flex-col justify-center items-center m-0 p-0'>
    {/* <Loading loading={loading} width={20} height={20}/> */}
    <div className='mb-4'>
                        
                        <div className={` ${loading ? " cursor-wait" : " "}`}>
                    <label htmlFor="profilePic">
                        <div className={`flex justify-center items-center flex-col w-full p-3 border-2 border-green-700 rounded-full focus:outline-none focus:border-green-700 ${loading ? "hidden" : "cursor-pointer"}`}>
                            <CiImageOn size={20} />
                            <p className='text-ellipsis max-w-80 line-clamp-1'>{uploadPhoto?.name ? uploadPhoto?.name : "Upload The Photo"}</p>
                        </div>

                        <div className={` flex justify-center items-center flex-col  border p-3 hover:border-primary rounded-lg ${loading ? " cursor-wait" : "hidden"}`}>
                            <Loading />
                            <p className='text-ellipsis max-w-80 line-clamp-1'>Uploading....</p>
                        </div>

                    </label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg image/jpg"
                        id='profilePic'
                        name='profilePic'
                        className={`bg-slate-100 px-2 py-1 focus:outline-primary rounded my-3 hidden`}
                        disabled={loading ? true : false}
                        onChange={handleUploadProfilePhoto}
                    />
                </div>
                </div>
</div>
);
};
  

export default ImageUploader