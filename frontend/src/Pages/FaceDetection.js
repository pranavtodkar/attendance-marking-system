import React, { useState, useRef, useEffect } from 'react'
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import AuthIdle from "../images/auth-idle.svg";
import AuthFace from "../images/auth-face.svg";
import * as faceapi from 'face-api.js';
import { toast } from "react-toastify";

const FaceDetection = () => {
  const navigate = useNavigate();

  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [counter, setCounter] = useState(5);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const [expression, setExpression] = useState('');
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 500;
  const videoHeight = 360;

  const loadModels = async () => {
    // const uri = import.meta.env.DEV ? "/models" : "/react-face-auth/models";
    const uri = "/models";

    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
    await faceapi.nets.faceExpressionNet.loadFromUri(uri);
  };

  useEffect(() => {
    const getFaceData = async () => {
      const response = await fetch('http://localhost:8080/getFaceData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('JWT')
        }
      });
      const data = await response.json();
      console.log('data:', data);
      if (data.status === 'No Face Data Found') {
        navigate('/registerface');
        return;
      }

      const faceData = data.faceData;

      const descriptor = new Float32Array(faceData[0].face_recog_data.split(',').map(parseFloat));

      const descriptions = [];

      if (descriptor) {
        descriptions.push(descriptor);
      }

      loadModels()
      .then(async () => {
        const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors('user_label', descriptions);
        setLabeledFaceDescriptors(labeledFaceDescriptors);
      })
      .then(() => setModelsLoaded(true));
    }
    getFaceData();
  }, []);

  useEffect(() => {
    if (loginResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);

      if (counter === 0) {
        // if (expression !== 'happy'){
        //   setLoginResult("FAILED");
        //   return () => clearInterval(counterInterval);
        // }
        
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => {
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);

        const markAttendance = async () => {
          const res = await fetch("http://localhost:8080/markAttendance",{
            method: 'POST',
            headers:{
              'Content-Type' : 'application/json',
              'Authorization': localStorage.getItem('JWT')
            }
          });
          const data = await res.json();
          console.log("data:", data);
          toast.success(`Attendance marked successfully.`);

          navigate('/marked', { state: { attendanceData : data } });  
        }
        markAttendance();   

      }

      return () => clearInterval(counterInterval);
    }
    setCounter(5);
  }, [loginResult, counter]);

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const getExpression = (expressions) => {
    if(!expressions) return '';
    const maxExpression = Object.entries(expressions).reduce((max, [key, value]) => {
      return value > max.value ? { key, value } : max;
    }, { key: null, value: -Infinity });
  
    return maxExpression.key;
  };

  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);
    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });

      const expression = getExpression(resizedDetections[0]?.expressions);
      setExpression(expression);

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (results.length > 0 && 'user_label' === results[0].label) {
        setLoginResult("SUCCESS");
      } else {
        setLoginResult("FAILED");
      }

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  const toHome = () => {
    console.log('to home')
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] max-w-[720px] mx-auto">
      {!localUserStream && !modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-[#002772] mt-10">Loading Models...</span>
        </h2>
      )}
      {!localUserStream && modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-[#002772] mt-10">
            Scan Face to proceed.
          </span>
        </h2>
      )}
      {localUserStream && loginResult === "SUCCESS" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-[#002772] mt-10">
            Face recognised!
          </span>
          
        </h2>
      )}
      {localUserStream && loginResult === "FAILED" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block mt-10">
            No match!
          </span>
        </h2>
      )}
      {localUserStream && !faceApiLoaded && loginResult === "PENDING" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block  mt-10 text-[#002772]">Starting scan...</span>
        </h2>
      )}
      <div className="w-full">
        <div className={`relative flex flex-col items-center p-[10px]`}>
          <video
            muted
            autoPlay
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            className={loginResult === "SUCCESS" ? "border-2 border-green": loginResult === "FAILED" ? "border-2 border-red-500" : ""}
            onPlay={scanFace}
            style={{
              objectFit: "fill",
              height: "360px",
              borderRadius: "10px",
              display: localUserStream ? "block" : "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: localUserStream ? "block" : "none",
            }}
          />
        </div>
        {!localUserStream && (
          <>
            {modelsLoaded ? (
              <>
                <img
                  alt="loading models"
                  src={AuthFace}
                  className="cursor-pointer my-8 mx-auto object-cover h-[202px]"
                />
                <button
                  onClick={getLocalUserVideo}
                  type="button"
                  className="text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg"
                >
                  Scan my face
                </button>
              </>
            ) : (
              <div className='px-5'>
                <img
                  alt="loading models"
                  src={AuthIdle}
                  className="cursor-pointer my-8 mx-auto object-cover h-[272px]"
                />
                <button
                  disabled
                  type="button"
                  className="cursor-not-allowed flex justify-center items-center w-full py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Please wait while models are loading...
                </button>
              </div>
            )}
          </>
        )}        
      </div>
      {localUserStream && loginResult === "SUCCESS" && (
        <div className='w-full px-5'>
        <button
          disabled
          type="button"
          className="cursor-not-allowed flex justify-center items-center w-full py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline mr-2 w-4 h-4 text-gray-200 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#1C64F2"
            />
          </svg>
          Please stay for {counter} more seconds...
        </button>
        </div>
      )}
      { localUserStream && 
        <a href='/facedetection'><button className='text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg'>Retry</button></a>
      }
      <Button css='bg-white text-[#0049d9] border-2' value='Home' redirect={toHome} dst=''></Button>
    </div>
  )
}

export default FaceDetection;
