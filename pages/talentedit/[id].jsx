import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TalentEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    whatsappNumber: '',
    statusLevel: '', // Initialize with an empty string
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
     ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update formData with statusLevel set to "active"
      const updatedFormData = {...formData, statusLevel: 'active' };
      const response = await fetch(`/api/editusers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error updating user');
      }
      router.push('/talents'); // Redirect to talents page after update
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getusers/${id}`);
        const userData = await response.json();
        setFormData(userData); // Set form data with user's data
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      <h1>Approve User{}</h1>
      <p>Status Level: {formData.statusLevel}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>WhatsApp Number: </label>
          <input
            type="text"
            name="whatsappNumber"
            value= {formData.whatsappNumber}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Approve</button>
      </form>
    </div>
  );
};

export default TalentEdit;