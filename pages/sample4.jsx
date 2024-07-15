import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Talents = () => {
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [rolesResponse, companiesResponse, projectsResponse] = await Promise.all([
        fetch('api/roles', { cache: 'no-store' }),
        fetch('api/companies', { cache: 'no-store' }),
        fetch('api/projects', { cache: 'no-store' })
      ]);

      if (!rolesResponse.ok) {
        throw new Error(`Error fetching roles: ${rolesResponse.status}`);
      }
      if (!companiesResponse.ok) {
        throw new Error(`Error fetching companies: ${companiesResponse.status}`);
      }
      if (!projectsResponse.ok) {
        throw new Error(`Error fetching projects: ${projectsResponse.status}`);
      }

      const rolesData = await rolesResponse.json();
      const companiesData = await companiesResponse.json();
      const projectsData = await projectsResponse.json();

      setData({
        roles: rolesData,
        companies: companiesData,
        projects: projectsData
      });

      setFilteredData({
        roles: rolesData,
        companies: companiesData,
        projects: projectsData
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check user session and role
  useEffect(() => {
    if (status === 'authenticated' && session?.user.role !== 'admin' && session?.user.role !== 'talent') {
      router.push('/');
    }
  }, [status, session, router]);


  // Render if user is not signed in
  if (!session) {
    return <div>You are not signed in.</div>;
  }

  // Render component
  return (
    <div>
      <div className='ml-5 flex'>
        <h3>Company Names:</h3>
        <ul>
          {data.companies.map((company, index) => (
            <li key={index}>{company.companyName}</li>
          ))}
        </ul>
      </div>
      <div className='ml-5 flex'>
        <h3>Project Names:</h3>
        <ul>
          {data.projects.map((project, index) => (
            <li key={index}>{project.projectName}</li>
          ))}
        </ul>
      </div>
      <div className='ml-5 flex'>
        <h3>Role Names:</h3>
        <ul>
          {data.roles.map((role, index) => (
            <li key={index}>{role.roleName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Talents;