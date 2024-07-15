import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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

const genreList = [
  { value: 'Action', label: 'Action' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Thriller', label: 'Thriller' },
  { value: 'Drama', label: 'Drama' },
];

const CreateProject = () => {
  const { data: session } = useSession();
  const [data, setData] = useState({ companies: [], users: [] });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectImage: '',
    description: '',
    companyType: [],
    companyTypeId: [],
    category: null,
    genre: [],
    startDate: null,
    endDate: null,
    selectUser: [],
    selectUserID: [], // New field to store _id of selected user
    projectCreaterId: '',
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [projectImageError, setProjectImageError] = useState('');

// Fetch Crew Users Data
const fetchCrewData = async () => {
  try {
    const usersResponse = await fetch('/api/users', { cache: 'no-store' });

    if (!usersResponse.ok) {
      throw new Error(`Error fetching users: ${usersResponse.status}`);
    }

    const usersData = await usersResponse.json();

    // Filter users with role type "crew"
    const crewUsers = usersData.filter(user => user.role === 'crew');

    setData((prevData) => ({
      ...prevData,
      users: crewUsers,
    }));
  } catch (error) {
    console.log(error);
    setError(error.message);
  }
};

useEffect(() => {
  fetchCrewData();
}, []);


  const fetchData = async () => {
    try {
      const companiesResponse = await fetch('/api/companies', { cache: 'no-store' });

      if (!companiesResponse.ok) {
        throw new Error(`Error fetching companies: ${companiesResponse.status}`);
      }

      const companiesData = await companiesResponse.json();

      setData((prevData) => ({
        ...prevData,
        companies: companiesData,
      }));
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        projectCreaterId: session.user.id,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Special handling for selectUser to set selectUserID
  const handleUserChange = (selectedOptions) => {
    const selectedUsers = selectedOptions ? selectedOptions.map(option => option.value) : [];
    const selectedUsersId = selectedOptions ? selectedOptions.map(option => option.id) : [];
    setFormData((prevData) => ({
      ...prevData,
      selectUser: selectedUsers,
      selectUserID: selectedUsersId,
    }));
  };

  // Special handling for CompanyType to set CompanyTypeID
  const handleCompanyChange = (selectedOptions) => {
    const selectedCompanies = selectedOptions ? selectedOptions.map(option => option.value) : [];
    const selectedCompaniesId = selectedOptions ? selectedOptions.map(option => option.id) : [];
    setFormData((prevData) => ({
      ...prevData,
      companyType: selectedCompanies,
      companyTypeId: selectedCompaniesId,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption });
  };

  const handleGenreChange = (selectedOptions) => {
    setFormData({ ...formData, genre: selectedOptions });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData({ ...formData, startDate: start, endDate: end });
  };

  // Project Image
  const handleFileChange = async (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setProjectImageError('File size should be below 10MB');
      return;
    } else {
      setProjectImageError('');
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
      setProjectImageError('Error uploading file. Please try again.');
    }
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      category: formData.category ? formData.category.value : '',
      genre: formData.genre.map((option) => option.value),
      projectImage: uploadedImageUrl.url, // Assign the uploaded image URL
      projectCreaterId: session.user.id,
    };
    try {
      const response = await axios.post('/api/createProject', dataToSubmit);
      console.log('Project created successfully:', response.data);
      alert('Project created successfully');
      setFormData({
        projectName: '',
        description: '',
        companyType: [],
        companyTypeId: [],
        category: null,
        genre: [],
        startDate: null,
        endDate: null,
        selectUser: [],
        selectUserID: [], // Clear selectUserID after submission
        projectCreaterId: '',
      });
      setUploadedImageUrl('');
    } catch (error) {
      alert('Error creating project');
      console.error('Error creating project:', error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="enter-otp"
        name="projectName"
        value={formData.projectName}
        onChange={handleChange}
        placeholder="Project Name"
        required
      />
      <input
        type="text"
        className="enter-otp"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <div>
        <Select
          isMulti
          className="enter-otp"
          name="companyType"
          options={data.companies.map((company) => ({
            value: company.companyName,
            label: company.companyName,
            id: company._id,
          }))}
          value={formData.companyType.map((company, index) => ({
            value: company,
            label: company,
            id: formData.companyTypeId[index],
          }))}
          onChange={handleCompanyChange}
          placeholder="Select Company"
          isDisabled={data.companies.length === 0}
        />
      </div>

      <div>
        <Select
          isMulti
          className="enter-otp"
          name="selectUser"
          options={data.users.map((user) => ({
            value: user.firstName,
            label: user.firstName,
            id: user._id,
          }))}
          value={formData.selectUser.map((user, index) => ({
            value: user,
            label: user,
            id: formData.selectUserID[index],
          }))}
          onChange={handleUserChange}
          placeholder="Select User"
          isDisabled={data.users.length === 0}
        />
      </div>

      <div>
        <Select
          className="enter-otp"
          name="category"
          options={categoryList}
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="Select category"
        />
      </div>

      <div>
        <Select
          isMulti
          className="enter-otp"
          name="genre"
          options={genreList}
          value={formData.genre}
          onChange={handleGenreChange}
          placeholder="Select Genre"
        />
      </div>

      <DatePicker
        className="enter-otp"
        selected={formData.startDate}
        onChange={handleDateChange}
        startDate={formData.startDate}
        endDate={formData.endDate}
        selectsRange
        placeholderText="Select Start and End Date"
      />

      <input
        type="file"
        className="enter-otp"
        name="projectImage"
        onChange={handleFileChange}
        accept="image/*"
      />
      {projectImageError && <p className="text-red-500">{projectImageError}</p>}
      {uploadedImageUrl && <Image width={150} height={50} src={uploadedImageUrl.url} alt="Uploaded Project" />}

      <button
        className="btn-enter"
        type="submit"
      >
        Create Project
      </button>
    </form>
  );
};

export default CreateProject;
