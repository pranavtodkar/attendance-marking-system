import { React, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";

function RegisterFace() {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [descriptor, setDescriptor] = useState(null);    

    useEffect(() => {
        if (image) {
            loadModels()
                .then(async () => {
                    const descriptor = await imageToDescriptor();
                    setDescriptor(descriptor);
                });
        }else{
            setDescriptor(null);            
        }
    }, [image]);

    useEffect(() => {
        console.log("descriptor RegFace:", descriptor);
    }, [descriptor]);

    

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const loadModels = async () => {
        // const uri = import.meta.env.DEV ? "/models" : "/react-face-auth/models";
        const uri = "/models";

        await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
        await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
        await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
    };

    async function imageToDescriptor() {        
        if (!image) {
            return null;
        }

        toast.info("Processing Image. Please wait...");

        let img;

        try {
            img = await faceapi.fetchImage(image);
        } catch {
            // setImageError(true);
            console.log("Error in loading image");
            return;
        }

        const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        return detections.descriptor;
    }

    return (
        <div>
            <div className='flex flex-col justify-center px-14 w-full mt-3'>
            <h1 className='my-10 text-2xl text-left font-bold text-[#002772]'>Register Face</h1>
            <h1 className=' text-left font-bold'>Your Photo please</h1>
            </div> 
            {image &&
                <div className="w-full p-4 text-right">
                    <div className="mx-auto w-full max-w-md">
                        <div className="relative">
                            <div className='relative flex cursor-pointer px-15 rounded-lg px-5 py-4 shadow-md focus:outline-none bg-indigo-600 bg-opacity-75 text-white'>
                                <div className="relative">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <div
                                                    className={`flex items-center gap-x-6 font-medium`}
                                                >
                                                    <img
                                                        className="object-cover h-10 w-10 rounded-full"
                                                        src={image}
                                                        alt={fileName}
                                                    />{fileName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="text-indigo-800 w-6 h-6 absolute top-1/2 -translate-y-1/2 right-[-32px] cursor-pointer"
                                onClick={() => {
                                    setImage(null);
                                    setFileName(null);
                                }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            }
            {!image &&
                <div className="flex flex-col px-16 items-center justify-center w-full mt-3">
                    <label
                        htmlFor="dropzone-file"
                        className="flex h-40 flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-200 hover:bg-gray-100"
                    >
                        <div className="flex flex-col items-center justify-center py-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-indigo-500 mb-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>
                            <p className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">
                                Click to upload referral image
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG or JPEG
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            className="hidden"
                            onChange={async (e) => {
                                const files = e.target.files;
                                if (files == null || files.length == 0) {
                                    setErrorMessage("No files wait for import.");
                                    return;
                                }
                                let file = files[0];
                                let name = file.name;
                                let suffixArr = name.split("."),
                                    suffix = suffixArr[suffixArr.length - 1];
                                if (
                                    suffix != "png" &&
                                    suffix != "jpg" &&
                                    suffix != "jpeg"
                                ) {
                                    setErrorMessage("Only support png jpg or jpeg files.");
                                    return;
                                }

                                const base64 = await convertBase64(file);

                                setImage(base64);
                                setFileName(name);
                            }}
                        />
                    </label>                    
                </div>
            }
            {errorMessage && (
                <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
            <button
                onClick={async () => {
                    if(!descriptor) {
                        toast.error("Please upload a photo.");
                        return;
                    }
                    const descriptorString = descriptor.toString();
                    const response = await fetch("http://localhost:8080/registerFace", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': localStorage.getItem('JWT')
                        },
                        body: JSON.stringify({ descriptor: descriptorString }),
                    });
                    const data = await response.json();
                    console.log("data:", data);

                    if(response.status === 200) {
                        toast.success("Face Data Registered");
                        navigate("/facedetection");
                    }else{
                        toast.error("Something went wrong. Please try again.");
                    }

                }}
                className="text-white bg-[#0049d9] w-80 h-11 mt-10 my-2 rounded-lg"
            >
                Register
            </button>
            <Link to={`/`}><button className={`bg-white text-[#0049d9] border-2 w-80 h-11 my-2 rounded-lg`} > Home</button></Link>
        </div>
    );
}

export default RegisterFace;
