import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const companyList = [
  { value: 'Production House', label: 'Production House' },
  { value: 'Ad Agency', label: 'Ad Agency' },
];

const categoryList = [
  { value: 'Movies', label: 'Movies' },
  { value: 'Web Series', label: 'Web Series' },
  { value: 'Anchoring', label: 'Anchoring' },
  { value: 'Pilot Films', label: 'Pilot Films' },
  { value: 'Dubbing Artist', label: 'Dubbing Artist' },
  { value: 'TV Serials', label: 'TV Serials' },
  { value: 'Ad Shoots', label: 'Ad Shoots' },
  { value: 'Short Films', label: 'Short Films' },
  { value: 'Music Albums', label: 'Music Albums' },
];

const CreateCompany = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    companyName: '',
    companyImage: '',
    companyType: null,
    categories: [],
    ownerFirstName: '',
    ownerLastName: '',
    ownerPhoneNumber: '',
    ownerEmailId: '',
    selectCompanyUser: null, // To store selected user name
    selectCompanyUserID: '', // _id of the selected crew user
    createrId: '',
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [companyImageError, setCompanyImageError] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        createrId: session.user.id,
      }));
    }
  }, [session]);

  // Fetch Crew Users Data
  const fetchData = async () => {
    try {
      const response = await fetch('api/users', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      // Filter users where role is 'crew'
      const filteredUsers = data.filter(user => user.role === 'crew');
      setFilteredData(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Special handling for selectCompanyUser to update selectCompanyUserID
    if (name === 'selectCompanyUser') {
      const selectedUser = filteredData.find(user => user._id === value); // Assuming value is _id
      if (selectedUser) {
        setFormData(prevData => ({
          ...prevData,
          selectCompanyUserID: selectedUser._id,
          selectCompanyUser: `${selectedUser.firstName} ${selectedUser.lastName}`, // Storing full name
        }));
      }
    }
  };

  const handleCompanyChange = (selectedOption) => {
    setFormData({ ...formData, companyType: selectedOption });
  };

  const handleCategoriesChange = (selectedOptions) => {
    setFormData({ ...formData, categories: selectedOptions });
  };

  // Project Image
  const handleFileChange = async (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setCompanyImageError('File size should be below 10MB');
      return;
    } else {
      setCompanyImageError('');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded successfully. Image URL:', response.data);
      setUploadedImageUrl(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setCompanyImageError('Error uploading file. Please try again.');
    }
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      companyType: formData.companyType.value,
      categories: formData.categories.map(option => option.value),
      selectCompanyUserID: formData.selectCompanyUserID, // Ensure it's the correct value
      companyImage: uploadedImageUrl.url,
    };
    try {
      const response = await axios.post('/api/createCompany', dataToSubmit);
      alert('Company created successfully');
      setFormData({
        companyName: '',
        companyImage: '',
        companyType: null,
        categories: [],
        ownerFirstName: '',
        ownerLastName: '',
        ownerPhoneNumber: '',
        ownerEmailId: '',
        selectCompanyUser: null,
        selectCompanyUserID: '',
        createrId: session.user.id,
      });
    } catch (error) {
      alert('Error creating company');
      console.error(error);
    }
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      {/* Company Image */}
      <input
        type="file"
        className="enter-otp"
        onChange={handleFileChange}
        required
      />
      {uploadedImageUrl && (
        <div>
          <input
            type="hidden"
            name="companyImage"
            value={uploadedImageUrl.url}
          />
          <Image width={100} height={50} src={uploadedImageUrl.url} alt="Uploaded"  />
        </div>
      )}
      {companyImageError && <p className="error">{companyImageError}</p>}

      <input
        type="text"
        className='enter-otp'
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
        required
      />

      <Select
        className='enter-otp'
        name="companyType"
        options={companyList}
        value={formData.companyType}
        onChange={handleCompanyChange}
        placeholder="Select Company Type"
        required
      />

      <Select
        isMulti
        className='enter-otp'
        name="categories"
        options={categoryList}
        value={formData.categories}
        onChange={handleCategoriesChange}
        placeholder="Select Categories"
        required
      />

      <input
        type="text"
        className='enter-otp'
        name="ownerFirstName"
        value={formData.ownerFirstName}
        onChange={handleChange}
        placeholder="Owner First Name"
        required
      />

      <input
        type="text"
        className='enter-otp'
        name="ownerLastName"
        value={formData.ownerLastName}
        onChange={handleChange}
        placeholder="Owner Last Name"
        required
      />


      <input
        type="text"
        className='enter-otp'
        name="ownerPhoneNumber"
        value={formData.ownerPhoneNumber}
        onChange={handleChange}
        placeholder="Owner Phone Number"
        required
      />

      <input
        type="email"
        className='enter-otp'
        name="ownerEmailId"
        value={formData.ownerEmailId}
        onChange={handleChange}
        placeholder="Owner Email Id"
        required
      />

      <select
        className='enter-otp'
        name="selectCompanyUser"
        value={formData.selectCompanyUserID} // Use selectCompanyUserID for value
        onChange={handleChange}
        placeholder="Select Crew User"
        required
      >
        <option value="">Select Crew User</option>
        {filteredData.map(user => (
          <option key={user._id} value={user._id}>{`${user.firstName} ${user.lastName}`}</option>
        ))}
      </select>

      <button className='submit' type="submit">Create Company</button>
    </form>
  );
};

export default CreateCompany;
