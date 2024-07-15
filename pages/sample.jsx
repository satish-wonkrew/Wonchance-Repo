import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import debounce from "lodash.debounce";
import React from "react";
import { IoBookmarks } from "react-icons/io5";
import Image from 'next/image';

const Profile = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);

  const [userDetails, setUserDetails] = useState({
    whatsappNumber: "",
    bookMark: [],
  });

  const [newItemId, setNewItemId] = useState("");

  // Fetch Talent Users Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/users", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
        setFilteredData(data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  // Session User Details
  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        bookMark: session.user.bookMark || [],
      });
    }
  }, [session]);


  // Input field changes
  const handleFieldChange = debounce(
    async (field, value) => {
      setUserDetails((prev) => ({ ...prev, [field]: value }));
      if (session?.user) {
        await axios.post("/api/updateProfile", {
          whatsappNumber: session.user.whatsappNumber,
          [field]: value,
        });
      }
    },
    500
  );

 // Add Bookmark
  const addBookmark = (index, newBookmark) => {
    const updatedBookmarks = [...userDetails.bookMark];
    if (!updatedBookmarks[index].includes(newBookmark)) {
      updatedBookmarks[index] = [...updatedBookmarks[index], newBookmark];
      setUserDetails((prev) => ({ ...prev, bookMark: updatedBookmarks }));
      setNewItemId("");
      handleFieldChange("bookMark", updatedBookmarks);
    }
  };

   // Remove Bookmark
   const removeBookmark = (bookmark) => {
    const updatedBookmarks = userDetails.bookMark.filter(
      (bmArray) => !bmArray.includes(bookmark)
    );
    setUserDetails((prev) => ({ ...prev, bookMark: updatedBookmarks }));
    handleFieldChange("bookMark", updatedBookmarks);
  };

  const togglePopup = (index) => {
    setPopupIndex(index);
    setShowPopup(!showPopup);
  };

  if (!session)
    return (
      <div>
        <p>You are not signed in.</p>
      </div>
    );

  return (
    <div>
      <div className="talents">
        <h1>Talents</h1>
        {filteredData.map((item, index) => {
          return (
            <div key={item._id} className="card-grid">
              {item.statusLevel === "active" ? (
                <>
                  <div>
                    <Image
                    width={150}
                    height={50}
                      className="profile-picture"
                      src={item.profilePictureUrl}
                      alt=""
                    />
                  </div>
                  <div className="talent-short-data">
                    <div className="talent-screen-name">
                      <IoBookmarks className="bookmark" onClick={() => togglePopup(index)} />
                      <h2>{item.firstName}</h2>
                      {showPopup && popupIndex === index && (
                        <div className="popup">
                          <div className="popup-content">
                            <button className="close-button" onClick={() => togglePopup(null)}>
                              x
                            </button>
                            <div>
                              <ul>
                                {userDetails.bookMark.map((bookmarkArray, bmIndex) => (
                                  <li key={bmIndex}>
                                    {bookmarkArray[0]}{" "}
                                    <button
                                      type="button"
                                      className="text-red-500"
                                      onClick={() => removeBookmark(bookmarkArray[0])}
                                    >
                                      x
                                    </button>
                                    <button
                                      type="button"
                                      className="text-green-500"
                                      onClick={() => addBookmark(bmIndex, item._id)}
                                    >
                                      Add
                                    </button>
                                    <ul>
                                      {bookmarkArray.slice(1).map((subBookmark, subIndex) => (
                                        <li key={subIndex}>{subBookmark}</li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="talent-id-status">
                      <h3>Profile Id: {item._id}</h3>
                      <h3>Status: {item.statusLevel}</h3>
                    </div>
                    <div className="talent-over-view">
                      <h2>OVERVIEW</h2>
                    </div>
                    <h3 className="h2">Age: {item.age}</h3>
                    <div className="talent-appearance">
                      <h2>Appearance:</h2>
                    </div>
                    <div>
                      <h3 className="h2">
                        Height: {item.height}Cm | Weight: {item.weight}Kg |
                        Body Type: {item.bodyType}
                      </h3>
                      <h3 className="h2">
                        Hair Color: {item.hairColor} | Skin Tone: {item.skinTone} |
                        Eye Color: {item.eyeColor}
                      </h3>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
