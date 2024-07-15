import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const TalentEdit = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    appliedTalentsId: [],
  });
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        createrId: session.user.id,
      }));
      checkIfAlreadyApplied();
    }
  }, [session, id]);

  const checkIfAlreadyApplied = async () => {
    if (id) {
      try {
        const response = await fetch(`/api/castings/${id}`);
        const data = await response.json();
        if (data.appliedTalentsId.includes(session.user.id)) {
          setAlreadyApplied(true);
        }
      } catch (error) {
        console.error('Error fetching casting details:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        appliedTalentsId: [...formData.appliedTalentsId, session.user.id],
      };
      const response = await fetch(`/api/addcasting/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
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

  return (
    <div>
      {alreadyApplied ? (
        <p>You have already applied for this profile.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="submit">Apply</button>
        </form>
      )}
    </div>
  );
};

export default TalentEdit;
