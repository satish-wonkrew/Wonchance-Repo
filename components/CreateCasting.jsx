import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import Select from 'react-select';

const CreateCasting = () => {
  const { data: session } = useSession();
  const [data, setData] = useState({ roles: [] });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    castingTitle: '',
    description: '',
    roleTypes: [],
    roleTypesId: [],
    shootDate: null,
    lastDate: null,
    castingCreaterId: '',
  });

  const fetchData = async () => {
    try {
      const [rolesResponse] = await Promise.all([
        fetch('/api/roles', { cache: 'no-store' }),
      ]);

      if (!rolesResponse.ok) {
        throw new Error(`Error fetching roles: ${rolesResponse.status}`);
      }

      const rolesData = await rolesResponse.json();

      setData({
        roles: rolesData,
      });
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
        castingCreaterId: session.user.id,
      }));
    }
  }, [session]);

  const handleChange = (selectedOptions) => {
    const selectedRoles = selectedOptions ? selectedOptions.map(option => option.value) : [];
    const selectedRolesId = selectedOptions ? selectedOptions.map(option => option.id) : [];
    setFormData((prevData) => ({
      ...prevData,
      roleTypes: selectedRoles,
      roleTypesId: selectedRolesId,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prevData) => ({ ...prevData, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/createCasting', formData);
      console.log('Casting created successfully:', response.data);
      alert('Casting created successfully');
      setFormData({
        castingTitle: '',
        description: '',
        roleTypes: [],
        roleTypesId: [],
        shootDate: null,
        lastDate: null,
        castingCreaterId: session.user.id,
      });
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
        name="castingTitle"
        value={formData.castingTitle}
        onChange={(e) => setFormData({ ...formData, castingTitle: e.target.value })}
        placeholder="Casting Title"
        required
      />
      <input
        type="text"
        className="enter-otp"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
        required
      />

      <div>
        <Select
          isMulti
          className="enter-otp"
          name="roleTypes"
          options={data.roles.map((role) => ({
            value: role.roleName,
            label: role.roleName,
            id: role._id,
          }))}
          value={formData.roleTypes.map((role, index) => ({
            value: role,
            label: role,
            id: formData.roleTypesId[index],
          }))}
          onChange={handleChange}
          placeholder="Select Role"
          isDisabled={data.roles.length === 0}
        />
      </div>

      <DatePicker
        className="enter-otp"
        selected={formData.shootDate}
        onChange={(date) => handleDateChange(date, 'shootDate')}
        placeholderText="Select Shoot Date"
        required
      />

      <DatePicker
        className="enter-otp"
        selected={formData.lastDate}
        onChange={(date) => handleDateChange(date, 'lastDate')}
        placeholderText="Last Date To Apply"
        required
      />

      <button type="submit">Create Casting</button>
    </form>
  );
};

export default CreateCasting;
