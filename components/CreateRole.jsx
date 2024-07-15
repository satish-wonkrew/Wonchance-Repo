import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSession } from 'next-auth/react';
// import CreatableSelect from 'react-select/creatable';

const genders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Others', label: 'Others' },
];

const skin = [
  { value: 'Fair', label: 'Fair' },
  { value: 'Black', label: 'Black' },
  { value: 'Beige', label: 'Beige' },
  { value: 'Dark Brown', label: 'Dark Brown' },
  { value: 'Light Brown', label: 'Light Brown' },
  { value: 'Moderate Brown', label: 'Moderate Brown' },
  { value: 'Pale White', label: 'Pale White' },
  { value: 'White To Light Beige', label: 'White To Light Beige' },
  { value: 'Dusky', label: 'Dusky' },
];

const bodyTypes = [
  { value: 'Slim', label: 'Slim' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Chubby', label: 'Chubby' },
];

const CreateRole = () => {
  const { data: session } = useSession();
  const [data, setData] = useState({ projects: [] });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: '',
    projectName: '',
    projectNameId: '',
    ageMin: '',
    ageMax: '',  
    roleGender: [],
    roleSkinType: [],
    roleBodyType: [],
    noOfOpenings: '',
    openingsClosed: '',
    roleCreaterId:'',
  });

  const fetchData = async () => {
    try {
      const [projectsResponse] = await Promise.all([
        fetch('/api/projects', { cache: 'no-store' }),
      ]);

     if (!projectsResponse.ok) {
        throw new Error(`Error fetching projects: ${projectsResponse.status}`);
      }
      const projectsData = await projectsResponse.json();

      setData({
        projects: projectsData,
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
        createrId: session.user.id,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'projectName') {
      const selectedProject = data.projects.find((project) => project.projectName === value);
      if (selectedProject) {
        setFormData((prevData) => ({
          ...prevData,
          projectNameId: selectedProject._id,
        }));
      }
    }

  };

  const handleRoleChange = (selectedOption) => {
    setFormData({ ...formData, roleGender: selectedOption });
  };

  const handleSkinChange = (selectedOptions) => {
    setFormData({ ...formData, roleSkinType: selectedOptions });
  };

  const handleBodyChange = (selectedOptions) => {
    setFormData({ ...formData, roleBodyType: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      // roleGender: formData.roleGender.value,
      roleGender: formData.roleGender.map(option => option.value),
      roleSkinType: formData.roleSkinType.map(option => option.value),
      roleBodyType: formData.roleBodyType.map(option => option.value),
    };
    try {
      const response = await axios.post('/api/createRole', dataToSubmit);
      alert('Role created successfully');
      setFormData({
        roleName: '',
        roleDescription: '',
        projectName: '',
        projectNameId: '',
        ageMin: '',
        ageMax: '', 
        roleGender: [],
        roleSkinType: [],
        roleBodyType: [],
        noOfOpenings: '',
        openingsClosed: '',
        roleCreaterId: session.user.id,
      });
    } catch (error) {
       alert('Error creating project');
      console.error('Error creating project:', error);
    }
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input
        type="text"
        className='enter-otp'
        name="roleName"
        value={formData.roleName}
        onChange={handleChange}
        placeholder="Role Name"
        required
      />

      <input
        type="text"
        className='enter-otp'
        name="roleDescription"
        value={formData.roleDescription}
        onChange={handleChange}
        placeholder="Role Description"
        required
      />
      
      {/* Project */}
        <select
        className="enter-otp"
        name="projectName"
        value={formData.projectName}
        onChange={handleChange}
        placeholder="Select Project Name"
      >
        <option value="" disabled>Select Project Name</option>
        {data.projects.map((project) => (
          <option key={project._id} value={project.projectName}>
            {project.projectName}
          </option>
        ))}
      </select>


    <div className='flex gap-10 justify-between'>
    <input
        type="number"       
        name="ageMin"
        className='rounded-md p-2'
        value={formData.ageMin}
        onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
        placeholder="Minimum Age"
        min={1}
        required
      />

      <input
        type="number"
        name="ageMax"
         className='rounded-md p-2'
        value={formData.ageMax}
        onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
        placeholder="Maximum Age"
        min={formData.ageMin || 1} // Setting the minimum value of ageMax based on ageMin
        required
      />
    </div>
       
      <div>
        <Select 
          isMulti
          className='enter-otp'
          name="roleGender"
          options={genders}
          value={formData.roleGender}
          onChange={handleRoleChange}
          placeholder="Select Gender"
        />
      </div>

      <div>
        <Select 
          isMulti
          className='enter-otp'
          name="roleSkinType"
          options={skin}
          value={formData.roleSkinType}
          onChange={handleSkinChange}
          placeholder="Select Skin Type"
        />
      </div>

      <div>
        <Select 
          isMulti
          className='enter-otp'
          name="roleBodyType"
          options={bodyTypes}
          value={formData.roleBodyType}
          onChange={handleBodyChange}
          placeholder="Select Body Type"
        />
      </div>

      

      <input
        type="text"
        className='enter-otp'
        name="noOfOpenings"
        value={formData.noOfOpenings}
        onChange={handleChange}
        placeholder="No Of Openings"
        required
      />

      <input
        type="text"
        className='enter-otp'
        name="openingsClosed"
        value={formData.openingsClosed}
        onChange={handleChange}
        placeholder="Openings Closed"
        required
      />

      <button className='submit' type="submit">Create Role</button>
    </form>
  );
};

export default CreateRole;
