import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaTimes } from 'react-icons/fa';
import React from "react";
import Webcam from "react-webcam";

type UserDetails = {
  whatsappNumber: string;
  faceReactionVideo?: string;
};

const FaceReactionVideoEdit = () => {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "",
    faceReactionVideo: "",
  });

  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        faceReactionVideo: session.user.faceReactionVideo || "",
      });
    }
  }, [session]);

  const handleRemoveFaceReactionVideo = async () => {
    setUserDetails(prev => ({ ...prev, faceReactionVideo: '' }));
    if (session?.user) {
      const updateResponse = await axios.post('/api/updateProfile', {
        whatsappNumber: session.user.whatsappNumber,
        faceReactionVideo: '',
      });
      if (updateResponse.status === 200) {
        console.log('Face reaction video removed successfully');
      } else {
        console.error('Failed to remove face reaction video');
      }
    }
  };

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current!.stream!, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = useCallback(async () => {
    mediaRecorderRef.current!.stop();
    setCapturing(false);
  }, [mediaRecorderRef]);

  useEffect(() => {
    const handleSave = async () => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const formData = new FormData();
        formData.append('file', blob, 'reaction.webm');

        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200 && response.data.url) {
            setUserDetails(prev => ({ ...prev, faceReactionVideo: response.data.url }));
            if (session?.user) {
              const updateResponse = await axios.post('/api/updateProfile', {
                whatsappNumber: session.user.whatsappNumber,
                faceReactionVideo: response.data.url,
              });
              if (updateResponse.status === 200) {
                console.log('Profile updated successfully with new video URL');
              } else {
                console.error('Failed to update profile with new video URL');
              }
            }
            setShowCamera(false);
          } else {
            console.error('Failed to upload captured video', response.data);
          }
        } catch (error) {
          console.error('Error uploading captured video:', error);
        } finally {
          setRecordedChunks([]);
        }
      }
    };

    handleSave();
  }, [recordedChunks, session]);

  if (!session)
    return (
      <div>
        <p>You are not signed in.</p>
      </div>
    );

  return (
    <div>
        <form>
              <label className="first-label" htmlFor="faceReactionVideo">Face Reaction Video:</label>
              {userDetails.faceReactionVideo && (
                <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px', width: '300px' }}>
                  <video 
                    src={userDetails.faceReactionVideo}
                    controls
                    className="register-profile-video"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFaceReactionVideo}
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
                    audio
                    ref={webcamRef}
                    width="100%"
                    videoConstraints={{
                      facingMode: "user"
                    }}
                    style={{ width: "100%", maxWidth: "400px", transform: 'scaleX(-1)' }} // Ensures it looks good on mobile and mirrors the view
                  />
                  {capturing ? (
                    <button
                      type="button"
                      onClick={handleStopCaptureClick}
                      style={{
                        display: 'block',
                        marginTop: '10px',
                        padding: '10px',
                        background: 'red',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Stop Capture
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartCaptureClick}
                      style={{
                        display: 'block',
                        marginTop: '10px',
                        padding: '10px',
                        background: 'green',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Start Capture
                    </button>
                  )}
                </div>
              )}

          
        </form>

    </div>
  );
};

export default FaceReactionVideoEdit;
