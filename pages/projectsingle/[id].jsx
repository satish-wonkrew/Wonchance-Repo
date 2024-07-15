import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

const ProjectSingle = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the Project ID from the URL query parameter

  const [companies, setCompanies] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project details
        const response = await fetch(`/api/castprojects/${id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Error fetching projects data: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);

        // Fetch company details for each companyTypeId
        const companiesData = await Promise.all(
          data.companyTypeId.map(async (companyId) => {
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
      fetchProject();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project || companies.length === 0) {
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
        <h2 className="h2">Project Name: {project.projectName}</h2>
        <div className="talent-work">
          <div>
            <Image width={300}  height={50} src={project.projectImage} alt="Project" />
            <h3 className="h2">Company Type: {project.companyType}</h3>
            <h3 className="h2">Company Type Id: {project.companyTypeId.join(', ')}</h3>
            <h3 className="h2">Description: {project.description}</h3>
            <h3 className="h2">Category: {project.category}</h3>
            <h3 className="h2">Start Date: {formatDate(project.startDate)}</h3>
            <h3 className="h2">End Date: {formatDate(project.endDate)}</h3>
            <div className="ml-5 flex">
              <h3>Genre:</h3>
              <ul>
                {project.genre && project.genre.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-red-300">
              <h1 className="text-3xl font-bold">Companies</h1>
              {companies.map((company, index) => (
                <div key={index} className="mb-5">
                  <h3>Company Name: <span>{company.companyName}</span></h3>
                  <Image width={150}  height={50} src={company.companyImage} alt="" />
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
  );
};

export default ProjectSingle;
