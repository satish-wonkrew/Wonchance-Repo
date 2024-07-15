// // Casting Single.js
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";

// const CastSingle = () => {
//   const router = useRouter();
//   const { id } = router.query; // Extract the casting ID from the URL query parameter

//   const [casting, setCasting] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [project,setProject] = useState(null);
//   const [role,setRole] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCasting = async () => { 
//       try {
//         // Fetch casting details
//         const response = await fetch(
//           `/api/castings/${id}`,
//           { cache: "no-store" }
//         );
//         if (!response.ok) {
//           throw new Error(`Error fetching casting data: ${response.status}`);
//         }
//         const data = await response.json();
//         setCasting(data);
  
//         // Fetch company details
//         const companyResponse = await fetch(
//           `/api/companies/${data.companyId}`,
//           { cache: "no-store" }
//         );
//         if (!companyResponse.ok) {
//           throw new Error(`Error fetching company data: ${companyResponse.status}`);
//         }
//         const companyData = await companyResponse.json();
//         setCompany(companyData);

//         // Fetch project details
//          const projectResponse = await fetch(
//           `/api/castprojects/${data.projectNameId}`,
//           { cache: "no-store" }
//         );
//         if (!projectResponse.ok) {
//           throw new Error(`Error fetching project data: ${projectResponse.status}`);
//         }
//         const projectData = await projectResponse.json();
//         setProject(projectData);

//          // Fetch role details
//          const roleResponse = await fetch(
//           `/api/roles/${data.roleTypesId}`,
//           { cache: "no-store" }
//         );
//         if (!roleResponse.ok) {
//           throw new Error(`Error fetching role data: ${roleResponse.status}`);
//         }
//         const roleData = await roleResponse.json();
//         setRole(roleData);
  
//       } catch (error) {
//         console.log(error);
//         setError(error.message);
//       }
//     };
  
//     if (id) {
//       fetchCasting();
//     }
//   }, [id]);
  
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!casting || !company ||!project ||!role) {
//     return <div>Loading...</div>;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: '2-digit', month: 'long', year: 'numeric' };
//     return date.toLocaleDateString('en-GB', options);
//   };

//   return (
//     <div>
//       <div>
//         <h3>Casting Title: {casting.castingTitle}</h3>
//         <div className="talent-work">
          
//           <div className="border-2 border-red-300">
//             <h1 className="text-3xl font-bold">Company</h1>
//             <h3>Company Name: <span>{company.companyName}</span></h3>
//             <Image width={150} height={50} src={company.companyImage} alt="" />
//             <h3>Company Type: <span>{company.companyType}</span></h3>
//             <h3>Owner First Name: <span>{company.ownerFirstName}</span></h3>
//             <h3>Owner Last Name: <span>{company.ownerLastName}</span></h3>
//             <h3>Owner Phone Number: <span>{company.ownerPhoneNumber}</span></h3>
//             <h3>Owner Email Id: <span>{company.ownerEmailId}</span></h3>
//           </div>

//           <div className="border-2 border-red-300">
//           <h1 className="text-3xl font-bold">Project</h1>
//           <h3>Project Name: <span>{casting.projectName}</span></h3>
//             <Image width={150} height={50} src={project.projectImage} alt="" />
//             <h3>Project Description: <span>{project.description}</span></h3>
//             <h3>Category: <span>{project.category}</span></h3>
//             <h3>Genre: <span>{project.genre}</span></h3>
//             <h3>Start Date: <span>{formatDate(project.startDate)}</span></h3>
//             <h3>End Date: <span>{formatDate(project.endDate)}</span></h3>
//           </div>


//           <div className="border-2 border-red-300">
//           <h3>Role Name: <span>{casting.roleTypes}</span></h3>
//           <h3>Role Name: <span>{casting.roleTypesId}</span></h3>

//           <h1 className="text-3xl font-bold">Role</h1>
//             <h3>Role Description: <span>{role.roleDescription}</span></h3>
//             <h3>Age Min: <span>{role.ageMin}</span></h3>
//             <h3>Age Max: <span>{role.ageMax}</span></h3>
//             <h3>Role Gender: <span>{role.roleGender}</span></h3>
//             <h3>Skin Type: <span>{role.roleSkinType}</span></h3>
//             <h3>Body Type: <span>{role.roleBodyType}</span></h3>
//             <h3>No Of Openings: <span>{role.noOfOpenings}</span></h3>
//             <h3>Openings Closed: <span>{role.openingsClosed}</span></h3>
//           </div>


//             <h3>Shoot Date: <span>{formatDate(casting.shootDate)}</span></h3>
//             <h3>Last Date: <span>{formatDate(casting.lastDate)}</span></h3>
//             <h3>Casting Creator ID: <span>{casting.castingCreaterId}</span></h3>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CastSingle;


// Casting Single.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from 'next/image';

const CastSingle = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query; // Extract the casting ID from the URL query parameter

  const [casting, setCasting] = useState(null);
  const [role, setRole] = useState(null);
  const [project, setProject] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  //Already Applied
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
        console.error("Error fetching casting details:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCasting = async () => {
      try {
        // Fetch casting details
        const response = await fetch(`/api/castings/${id}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Error fetching casting data: ${response.status}`);
        }
        const data = await response.json();
        setCasting(data);

        // Fetch role details for each roleTypesId
        const rolesData = await Promise.all(
          data.roleTypesId.map(async (roleId) => {
            const roleResponse = await fetch(`/api/castroles/${roleId}`, {
              cache: "no-store",
            });
            if (!roleResponse.ok) {
              throw new Error(
                `Error fetching role data: ${roleResponse.status}`
              );
            }
            return roleResponse.json();
          })
        );

        setRole(rolesData);

        // Assuming each role object contains a projectNameId and you want to use the first one
        const projectNameId =
          rolesData.length > 0 ? rolesData[0].projectNameId : null;

        if (projectNameId) {
          // Fetch project details
          const projectResponse = await fetch(
            `/api/castprojects/${projectNameId}`,
            { cache: "no-store" }
          );
          if (!projectResponse.ok) {
            throw new Error(
              `Error fetching project data: ${projectResponse.status}`
            );
          }
          const projectData = await projectResponse.json();
          setProject(projectData);

          // Fetch company details for each companyTypeId
          if (
            projectData.companyTypeId &&
            projectData.companyTypeId.length > 0
          ) {
            const companiesData = await Promise.all(
              projectData.companyTypeId.map(async (companyId) => {
                const companyResponse = await fetch(
                  `/api/companies/${companyId}`,
                  { cache: "no-store" }
                );
                if (!companyResponse.ok) {
                  throw new Error(
                    `Error fetching company data: ${companyResponse.status}`
                  );
                }
                return companyResponse.json();
              })
            );
            setCompanies(companiesData);
          } else {
            throw new Error("No companyTypeId found in projectData");
          }
        } else {
          throw new Error("No projectNameId found in rolesData");
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    if (id) {
      fetchCasting();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  //Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        appliedTalentsId: [...formData.appliedTalentsId, session.user.id],
      };
      const response = await fetch(
        `/api/addcasting/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error updating user");
      }
      router.push("/castingcalls"); // Redirect to talents page after update
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!casting || !role || !project || !companies) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div>
      <div>
        {/* Casting */}
        <h3>Casting Title: {casting.castingTitle}</h3>
        <div className="talent-work">
          <div>
            <h3>
              Role Types: <span>{casting.roleTypes}</span>
            </h3>
            <div className="ml-5 flex">
              <h3>Role Types Id:</h3>
              <ul>
                {casting.roleTypesId &&
                  casting.roleTypesId.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
              </ul>
            </div>
            <h3>
              shootDate: <span>{formatDate(casting.shootDate)}</span>
            </h3>
            <h3>
              lastDate: <span>{formatDate(casting.lastDate)}</span>
            </h3>
            <h3>
              castingCreaterId: <span>{casting.castingCreaterId}</span>
            </h3>
          </div>

          {/* Role */}
          <div className="border-2 border-red-300">
            <h1 className="text-3xl font-bold">Roles</h1>
            {role.map((role, index) => (
              <div key={index} className="mb-5">
                <h3>
                  Role Name: <span>{role.roleName}</span>
                </h3>
                <h3>
                  Description: <span>{role.roleDescription}</span>
                </h3>
                <h3>
                  Age Min: <span>{role.ageMin}</span>
                </h3>
                <h3>
                  ageMax: <span>{role.ageMax}</span>
                </h3>
                <h3>
                  projectName: <span>{role.projectName}</span>
                </h3>
                <h3>
                  projectNameId: <span>{role.projectNameId}</span>
                </h3>
                <h3>Gender:</h3>
                <ul>
                  {role.roleGender &&
                    role.roleGender.map((gender, index) => (
                      <li key={index}>{gender}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          </div>
            {/* Project */}
            <div className="border-2 border-red-300">
              <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <h3>
                Project Id: <span>{project._id}</span>
              </h3>
              <h3>
                Project Name: <span>{project.projectName}</span>
              </h3>
              <h3>Project Image</h3>
              <Image width={100} height={50} src={project.projectImage} alt="" />
              <h3>
                Company Type: <span>{project.companyType}</span>
              </h3>
              <h3>
                Company Type Id: <span>{project.companyTypeId}</span>
              </h3>
              <h3>
                Description: <span>{project.description}</span>
              </h3>
              <h3>
                Category: <span>{project.category}</span>
              </h3>
              <h3>
                Start Date: <span>{formatDate(project.startDate)}</span>
              </h3>
              <h3>
                End Date: <span>{formatDate(project.endDate)}</span>
              </h3>

              <div className="ml-5 flex">
                <h3>Genre:</h3>
                <ul>
                  {project.genre &&
                    project.genre.map((genre, index) => (
                      <li key={index}>{genre}</li>
                    ))}
                </ul>
              </div>
              <div className="ml-5 flex">
                <h3>Project User:</h3>
                <ul>
                  {project.selectUser &&
                    project.selectUser.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                </ul>
              </div>

              {/* Company */}
              <div className="border-2 border-red-300">
                <h1 className="text-3xl font-bold">Companies</h1>
                {companies.map((company, index) => (
                  <div key={index} className="mb-5">
                    <h3>
                      Company Id: <span>{company._id}</span>
                    </h3>
                    <h3>
                      Company Name: <span>{company.companyName}</span>
                    </h3>
                    <Image width={150} height={50} src={company.companyImage} alt="" />
                    <h3>
                      Company Type: <span>{company.companyType}</span>
                    </h3>
                    <h3>Categories:</h3>
                    <ul>
                      {company.categories &&
                        company.categories.map((genre, index) => (
                          <li key={index}>{genre}</li>
                        ))}
                    </ul>
                    <h3>
                      Owner First Name: <span>{company.ownerFirstName}</span>
                    </h3>
                    <h3>
                      Owner Last Name: <span>{company.ownerLastName}</span>
                    </h3>
                    <h3>
                      Owner Phone Number:{" "}
                      <span>{company.ownerPhoneNumber}</span>
                    </h3>
                    <h3>
                      Owner Email Id: <span>{company.ownerEmailId}</span>
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply */}
            {alreadyApplied ? (
              <p>You have already applied for this profile.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <button type="submit">Apply</button>
              </form>
            )}
          </div>


      </div>
    </div>
  );
};

export default CastSingle;

