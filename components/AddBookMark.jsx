import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    whatsappNumber: "",
    bookMark: [],
  });
  const [newBookmark, setNewBookmark] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const predefinedBookmarks = ["Hero", "Heroine", "Background Artist"];

  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        bookMark: session.user.bookMark || [],
      });
    }
  }, [session]);

  const handleFieldChange = async (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    if (session?.user) {
      await axios.post("/api/updateProfile", {
        whatsappNumber: session.user.whatsappNumber,
        [field]: value,
      });
    }
  };

  const addBookmark = (bookmark) => {
    if (!userDetails.bookMark.flat().includes(bookmark)) {
      const updatedBookmarks = [...userDetails.bookMark, [bookmark]];
      setUserDetails((prev) => ({ ...prev, bookMark: updatedBookmarks }));
      setNewBookmark("");
      handleFieldChange("bookMark", updatedBookmarks);
    }
  };

  const removeBookmark = (bookmark) => {
    const updatedBookmarks = userDetails.bookMark.filter(
      (bmArray) => !bmArray.includes(bookmark)
    );
    setUserDetails((prev) => ({ ...prev, bookMark: updatedBookmarks }));
    handleFieldChange("bookMark", updatedBookmarks);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewBookmark(value);
    if (value) {
      setSuggestions(
        predefinedBookmarks.filter((bookmark) =>
          bookmark.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addBookmark(suggestion);
    setSuggestions([]);
  };

  if (!session)
    return (
      <div>
        <p>You are not signed in.</p>
      </div>
    );

  return (
    <div>
      <div className="m-16">
        <div className="mb-4">
          <label className="register-label" htmlFor="bookMark">
            Book Mark:
          </label>
          <input
            className="register-input"
            id="bookMark"
            value={newBookmark}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {!userDetails.bookMark.flat().includes(newBookmark) && newBookmark && (
            <button type="button" onClick={() => addBookmark(newBookmark)}>
              Add
            </button>
          )}
        </div>
        <ul>
          {userDetails.bookMark.map((bookmarkArray, index) => (
            <li key={index}>
              {bookmarkArray[0]}{" "}
              <button
                type="button"
                className="text-red-500"
                onClick={() => removeBookmark(bookmarkArray[0])}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
