'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Select from 'react-select';
import Image from 'next/image';


const AddUser = () => {
  const [gender, setGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('91'); // Default to +91 (India)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [speakingLanguages, setSpeakingLanguages] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [errors, setErrors] = useState({ firstName: '', lastName: '', whatsappNumber: '', email: '', gender: '' });

  const whatsappNumber = `${countryCode}${phoneNumber}`;

  // Debounced function to check for existing data
  const checkForDuplicates = debounce(async (field, value) => {
    try {
      const response = await axios.post('/api/checkDuplicate', { field, value });
      if (response.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
    }
  }, 500);

  // Effect to check whatsappNumber
  useEffect(() => {
    if (whatsappNumber) {
      checkForDuplicates('whatsappNumber', whatsappNumber);
    }
    if (email) {
      checkForDuplicates('email', email);
    }
  }, [whatsappNumber, email]);


  const createUserHandler = async () => {
    if (errors.whatsappNumber || errors.email) {
      alert('Please fix the errors before submitting.');
      return;
    }

    // Extract values from speakingLanguages
    const speakingLanguagesValues = speakingLanguages.map(lang => lang.value);

    try {
      const response = await axios.post('/api/createNewUser', {
        firstName,
        lastName,
        whatsappNumber,
        email,
        gender,
        speakingLanguages: speakingLanguagesValues,
        profilePictureUrl,
        gallery,
      });
      if (response.status === 200 || response.status === 201) {
        alert('User created successfully');
        setGender('');
        setFirstName('');
        setLastName('');
        setCountryCode('91');
        setPhoneNumber('');
        setEmail('');
        setSpeakingLanguages([]);
        setProfilePictureUrl(null);
        setGallery([]);
        setErrors({ firstName: '', lastName: '', whatsappNumber: '', email: '', gender: '' });
      }
    } catch (error) {
      alert('Error creating user');
      console.error('Error:', error);
    }
  };

  // Handle file input for profile picture
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePictureUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input for gallery
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(images => {
      setGallery(images);
    });
  };

  return (
    <div>
      <label className='first-label' htmlFor="gender">Gender</label>
      <select
        id="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="others">Others</option>
      </select>

      <>
        <label className='first-label' htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter First Name"
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}
      </>

      <>
        <label className='first-label' htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter Last Name"
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}
      </>

      <label className='first-label' htmlFor="countryCode">Country Code</label>
      <select
        id="countryCode"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
      >
        <option value="1">+1 USA</option>
        <option value="91">+91 India</option>
        <option value="44">+44 UK</option>
        {/* Add more country codes as needed */}
      </select>

      <label className='first-label' htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        id="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter Phone Number"
      />
      {errors.whatsappNumber && <p className="error">{errors.whatsappNumber}</p>}

      <label className='first-label' htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
      />
      {errors.email && <p className="error">{errors.email}</p>}

      {/* React Select for speakingLanguages */}
      <label className='first-label' htmlFor="speakingLanguages">Speaking Languages</label>
      <Select
        id="speakingLanguages"
        options={[
          { value: "english", label: "English" },
          { value: "tamil", label: "Tamil" },
          { value: "hindi", label: "Hindi" },
          { value: "kannada", label: "Kannada" },
          { value: "marathi", label: "Marathi" },
          { value: "telugu", label: "Telugu" },
        ]}
        value={speakingLanguages}
        onChange={(options) => setSpeakingLanguages(options)}
        isMulti
      />

      <label className='first-label' htmlFor="profilePictureUrl">Profile Picture</label>
      <input
        type="file"
        id="profilePictureUrl"
        accept="image/*"
        onChange={handleProfilePictureChange}
      />

      {profilePictureUrl && <Image width={150} height={50} src={profilePictureUrl} alt="Profile" style={{ marginTop: '10px' }} />}

      <label className='first-label' htmlFor="gallery">Gallery</label>
      <input
        type="file"
        id="gallery"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
      />

      {gallery.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
          {gallery.map((image, index) => (
            <Image width={150} height={50} key={index} src={image} alt={`Gallery ${index}`} style={{ margin: '5px' }} />
          ))}
        </div>
      )}

      <button onClick={createUserHandler}>Create User</button>
    </div>
  );
};

export default AddUser;
