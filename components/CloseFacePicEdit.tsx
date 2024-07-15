import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaTimes } from 'react-icons/fa';
import React from "react";
import Webcam from "react-webcam";
import Image from 'next/image';

type UserDetails = {
  whatsappNumber: string;
  faceCloseupPicture?: string;
};

const CloseFacePicEdit = () => {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "",
    faceCloseupPicture: "",
  });

  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        faceCloseupPicture: session.user.faceCloseupPicture || "",
      });
    }
  }, [session]);

  const handleRemoveFaceCloseupPicture = async () => {
    setUserDetails(prev => ({ ...prev, faceCloseupPicture: '' }));
    if (session?.user) {
      const updateResponse = await axios.post('/api/updateProfile', {
        whatsappNumber: session.user.whatsappNumber,
        faceCloseupPicture: '',
      });
      if (updateResponse.status === 200) {
        console.log('Face closeup picture removed successfully');
      } else {
        console.error('Failed to remove face closeup picture');
      }
    }
  };

  const handleCapture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const formData = new FormData();
          formData.append('file', dataURItoBlob(imageSrc), 'capture.jpg');

          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200 && response.data.url) {
            setUserDetails(prev => ({ ...prev, faceCloseupPicture: response.data.url }));
            if (session?.user) {
              const updateResponse = await axios.post('/api/updateProfile', {
                whatsappNumber: session.user.whatsappNumber,
                faceCloseupPicture: response.data.url,
              });
              if (updateResponse.status === 200) {
                console.log('Profile updated successfully with new image URL');
              } else {
                console.error('Failed to update profile with new image URL');
              }
            }
            setShowCamera(false);
          } else {
            console.error('Failed to upload captured image', response.data);
          }
        } catch (error) {
          console.error('Error uploading captured image:', error);
        }
      }
    }
  }, [webcamRef, session]);

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  if (!session)
    return (
      <div>
        <p>You are not signed in.</p>
      </div>
    );

  return (
    <div>
        <form>
              <label className="first-label" htmlFor="faceCloseupPicture">Face Closeup Picture:</label>
              {userDetails.faceCloseupPicture && (
                <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px' }}>
                  <Image
                   width={150}
                   height={50}
                    src={userDetails.faceCloseupPicture}
                    alt="Face Closeup" 
                    className="register-profile-picture"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFaceCloseupPicture}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '1px',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowCamera(!showCamera)}
                style={{
                  display: 'block',
                  marginTop: '10px',
                  padding: '10px',
                  background: 'blue',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {showCamera ? 'Close Camera' : 'Open Camera'}
              </button>
              {showCamera && (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{
                      facingMode: "user"
                    }}
                    style={{ width: "100%", maxWidth: "400px", transform: 'scaleX(-1)' }} // Ensures it looks good on mobile and mirrors the view
                  />
                  <button
                    type="button"
                    onClick={handleCapture}
                    style={{
                      display: 'block',
                      marginTop: '10px',
                      padding: '10px',
                      background: 'green',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    Capture
                  </button>
                </div>
              )}


        </form>

    </div>
  );
};

export default CloseFacePicEdit;
