// Role Single.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

const RoleSingle = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the companies ID from the URL query parameter


  const [role, setRole] = useState(null);
  const [projects, setProject] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => { 
      try {
        // Fetch role details
        const response = await fetch(
          `/api/castroles/${id}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error(`Error fetching role data: ${response.status}`);
        }
        const data = await response.json();
        setRole(data);

        // Fetch project details
        const projectResponse = await fetch(
          `/api/castprojects/${data.projectNameId}`,
          { cache: "no-store" }
        );
        if (!projectResponse.ok) {
          throw new Error(`Error fetching project data: ${projectResponse.status}`);
        }
        const projectData = await projectResponse.json();
        setProject(projectData);
        
          // Fetch company details for each companyTypeId
        const companiesData = await Promise.all(
            projectData.companyTypeId.map(async (companyId) => {
              const companyResponse = await fetch(`/api/companies/${companyId}`, { cache: "no-store" });
              if (!companyResponse.ok) {
                throw new Error(`Error fetching company data: ${companyResponse.status}`);
              }
              return companyResponse.json();
            })
          );
          setCompanies(companiesData);
  
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
  
    if (id) {
        fetchRole();
    }
  }, [id]);
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!role || !projects || companies.length === 0) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div>
      <div>
        <div className="talent-work">            
          <div className="border-2 border-red-300">
            <h1 className="text-3xl font-bold">Roles</h1>
            <h3>Role Name: <span>{role.roleName}</span></h3>
            <h3>Role Description: <span>{role.roleDescription}</span></h3>
            <h3>Project Name: <span>{role.projectName}</span></h3>
            <h3>Project Name Id : <span>{role.projectNameId}</span></h3>
            <h3>Age Min : <span>{role.ageMin}</span></h3>
            <h3>Age Max : <span>{role.ageMax}</span></h3>
            <h3>No Of Openings : <span>{role.noOfOpenings}</span></h3>
            <h3>Openings Closed : <span>{role.openingsClosed}</span></h3>

            <div className="ml-5 flex">
              <h3>Gender:</h3>
              <ul>
                {role.roleGender && role.roleGender.map((gender, index) => (
                  <li key={index}>{gender}</li>
                ))}
              </ul>
            </div>      
          </div>
          {/* Project */}
          <div className="border-2 border-red-300">
           <h1 className="text-3xl font-bold">Projects</h1>             
             <div  className="mb-5">
               <h3>Project Id: <span>{projects._id}</span></h3>
               <h3>Project Name: <span>{projects.projectName}</span></h3>
               <h3>Project Image</h3>
               <Image width={100}  height={50} src={projects.projectImage} alt="" />
               <h3>Company Type: <span>{projects.companyType}</span></h3>
               <h3>Company Type Id: <span>{projects.companyTypeId}</span></h3>
               <h3>Description: <span>{projects.description}</span></h3>
               <h3>Category: <span>{projects.category}</span></h3>
               <h3>Start Date: <span>{formatDate(projects.startDate)}</span></h3>
               <h3>End Date: <span>{formatDate(projects.endDate)}</span></h3>

               <div className="ml-5 flex">
                 <h3>Genre:</h3>
                 <ul>
                   {projects.genre && projects.genre.map((genre, index) => (
                     <li key={index}>{genre}</li>
                   ))}
                 </ul>
               </div>  
               <div className="ml-5 flex">
                 <h3>Project User:</h3>
                 <ul>
                   {projects.selectUser && projects.selectUser.map((user, index) => (
                     <li key={index}>{user}</li>
                   ))}
                 </ul>
               </div>
          {/* Company */}
          <div className="border-2 border-red-300">
              <h1 className="text-3xl font-bold">Companies</h1>
              {companies.map((company, index) => (
                <div key={index} className="mb-5">
                  <h3>Company Id: <span>{company._id}</span></h3>
                  <h3>Company Name: <span>{company.companyName}</span></h3>
                  <Image width={150} height={50} src={company.companyImage} alt="" />
                  <h3>Company Type: <span>{company.companyType}</span></h3>
                  <h3>Categories:</h3>
              <ul>
                {company.categories && company.categories.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
                  <h3>Owner First Name: <span>{company.ownerFirstName}</span></h3>
                  <h3>Owner Last Name: <span>{company.ownerLastName}</span></h3>
                  <h3>Owner Phone Number: <span>{company.ownerPhoneNumber}</span></h3>
                  <h3>Owner Email Id: <span>{company.ownerEmailId}</span></h3>
                </div>
              ))}
            </div>
             </div>
            </div>
        </div>


       

      </div>
    </div>
  );
};

export default RoleSingle;
