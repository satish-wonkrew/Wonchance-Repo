import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";

const CastSingle = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query; // Extract the casting ID from the URL query parameter

  const [casting, setCasting] = useState(null);
  const [role, setRole] = useState(null);
  const [project, setProject] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  // Already Applied
  const [formData, setFormData] = useState({
    appliedTalentsId: [], // This will hold objects with roles and user IDs
  });
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Popup and selected roles state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const checkIfAlreadyApplied = useCallback(async () => {
    if (id && session) {
      try {
        const response = await fetch(`/api/castings/${id}`);
        const data = await response.json();
        const appliedRole = data.appliedTalentsId.find(
          (entry) => entry.userId === session.user.id
        );
        if (appliedRole) {
          setAlreadyApplied(true);
          setSelectedRoles(appliedRole.roles); // Set selected roles if already applied
        }
      } catch (error) {
        console.error("Error fetching casting details:", error);
      }
    }
  }, [id, session]); // Dependencies of checkIfAlreadyApplied

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        createrId: session.user.id,
      }));
      checkIfAlreadyApplied(); // Call the function with the original name here
    }
  }, [session, id, checkIfAlreadyApplied]); // Update dependency to match the function name

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
  }, [id, session]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleApplyClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRoleChange = (role) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role)
        ? prevSelectedRoles.filter((r) => r !== role)
        : [...prevSelectedRoles, role]
    );
  };

  //Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        appliedTalentsId: [
          ...formData.appliedTalentsId,
          {
            userId: session.user.id,
            roles: selectedRoles,
          },
        ],
      };
      const response = await fetch(`/api/addcasting/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
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
        <div className="talent-work">
          {/* Casting */}
          <div>
            <h3>Casting Title: {casting.castingTitle}</h3>
            <div className="ml-5 flex">
              <h3>Role Types:</h3>
              <ul>
                {casting.roleTypes &&
                  casting.roleTypes.map((role, index) => (
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
          {/* Project */}
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <h3>
              Project Id: <span>{project._id}</span>
            </h3>
            <h3>
              Project Name: <span>{project.projectName}</span>
            </h3>
            <h3>Project Image</h3>
            <Image width={100} src={project.projectImage} alt="" />
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
          </div>
          {/* Apply */}
          <div>
            {alreadyApplied ? (
              <p>You have already applied for this profile.</p>
            ) : (
              <div>
                <button onClick={handleApplyClick}>Apply</button>
                {isPopupOpen && (
                  <div className="popup-overlay">
                    <div className="popup">
                      <button
                        className="close-button"
                        onClick={handleClosePopup}
                      >
                        ×
                      </button>
                      <h3>Select Role Types</h3>
                      <form onSubmit={handleSubmit}>
                        {casting.roleTypes &&
                          casting.roleTypes.map((role, index) => (
                            <div key={index}>
                              <input
                                type="checkbox"
                                id={`role-${index}`}
                                value={role}
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                              />
                              <label htmlFor={`role-${index}`}>{role}</label>
                            </div>
                          ))}
                        <button type="submit">Submit</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                <Image width={150} src={company.companyImage} alt="" />
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
                  Owner Phone Number: <span>{company.ownerPhoneNumber}</span>
                </h3>
                <h3>
                  Owner Email Id: <span>{company.ownerEmailId}</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 300px;
          max-width: 90%;
          text-align: center;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
        .close-button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default CastSingle;
