// Company Single.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

const CompanySingle = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the companies ID from the URL query parameter


  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => { 
      try {
        // Fetch company details
        const response = await fetch(
          `/api/companies/${id}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error(`Error fetching company data: ${response.status}`);
        }
        const data = await response.json();
        setCompany(data);

  
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
  
    if (id) {
        fetchCompany();
    }
  }, [id]);
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className="talent-work">
          
          <div className="border-2 border-red-300">
            <h1 className="text-3xl font-bold">Company</h1>
            <h3>Company Name: <span>{company.companyName}</span></h3>
            <Image width={150} src={company.companyImage} alt="" />
            <h3>Company Type: <span>{company.companyType}</span></h3>
            <div className="ml-5 flex">
              <h3>Categories:</h3>
              <ul>
                {company.categories && company.categories.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>
            <h3>Owner First Name: <span>{company.ownerFirstName}</span></h3>
            <h3>Owner Last Name: <span>{company.ownerLastName}</span></h3>
            <h3>Owner Phone Number: <span>{company.ownerPhoneNumber}</span></h3>
            <h3>Owner Email Id: <span>{company.ownerEmailId}</span></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySingle;
