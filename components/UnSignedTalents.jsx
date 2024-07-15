import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import UserCount from '../components/UserCount';
import Image from 'next/image';
import Link from 'next/link';

const UnSignedTalents = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const observer = useRef(null);

  // Non Admin Users Code
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch Users Data
  const fetchData = async () => {
    try {
      const response = await fetch('api/users', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      setFilteredData(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filters
  useEffect(() => {
    let filtered = data;
    if (genderFilter) {
      filtered = filtered.filter(item => item.gender === genderFilter);
    }
    if (profileFilter) {
      filtered = filtered.filter(item => item.profile === profileFilter);
    }
    if(experienceFilter){
      filtered = filtered.filter(item => item.experienceLevel === experienceFilter);
    }

    setFilteredData(filtered);
  }, [genderFilter,experienceFilter, profileFilter, data]);

  // Infinite Scroll
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prevCount) => prevCount + 3); // Increase the visible count by 3
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='talent-archive'>
      {/* Filters */}
      <div className="filters">
        <h1>Filter</h1>
        {/* Gender */}
        <div>
          <label htmlFor="gender" className="filter-label">Gender:</label>
          <select id="gender" className='talent-select' value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        {/* Profile */}
        <div>
          <label htmlFor="profile" className="filter-label">Profile:</label>
          <select id="profile" className='talent-select' value={profileFilter} onChange={(e) => setProfileFilter(e.target.value)} >
            <option value="">Select Profile</option>
            <option value="adult">Adult</option>
            <option value="kid">Kid</option>
          </select>
        </div>     
         {/* Experience Level */}
         <div>
          <label htmlFor="experienceLevel" className="filter-label">Experience Level:</label>
          <select id="experienceLevel" className='talent-select' value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} >
            <option value="">Select Experience</option>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </select>
        </div>
        <div className='p-5 text-white'>
            <p>If You want More Talent Filters</p>
            <div className='flex gap-4 items-center' >

                <Link href="/"><button className='border border-gray-300 p-1'>Contact Us</button></Link>               
                OR
                <Link href="/signup"><button className='border border-gray-300 p-1'>SignUp</button></Link>         
            </div>
        </div>
      </div>

      {/* Cards List */}
      <div className='talents'>
        <h1>Talents</h1>
        <UserCount />
        
        {filteredData.slice(0, visibleCount).map((item, index) => {
          const isLastElement = index === filteredData.slice(0, visibleCount).length - 1;
          return (
            <div key={item._id} className='card-grid' ref={isLastElement ? lastElementRef : null}>
              {item.statusLevel === 'active' ? (
                <>
                  <div>
                    <Image
                    width={150}
                    height={50}
                      className='profile-picture'
                      src={item.profilePictureUrl} 
                      alt="" 
                    />
                  </div>
                  <div className='talent-short-data'>
                    <div className='talent-screen-name'>
                      <h2>User Id: {item._id}</h2>
                    </div>
                    <div className='talent-over-view justify-between pr-4'>
                      <h2>OVERVIEW</h2>
                      <h3>Status: {item.statusLevel}</h3>
                    </div>
                    <h3 className='h2'>Age: {item.age}</h3>
                    <div className='talent-appearance'>
                      <h2>Appearance:</h2>
                    </div>
                    <div>
                      <h3 className='h2'>Height: {item.height}Cm | Weight: {item.weight}Kg | Body Type: {item.bodyType}</h3>
                      <h3 className='h2'>Hair Color: {item.hairColor} | Skin Tone: {item.skinTone} | Eye Color: {item.eyeColor}</h3>
                    </div>
                  </div>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          );
        })}
        <div className='flex justify-center items-center gap-4 m-2'>
        <p>If You want More Talents</p>
            <div className='flex gap-4 items-center' >

                <Link href="/"><button className='border border-black p-1'>Contact Us</button></Link>               
                OR
                <Link href="/signup"><button className='border border-black p-1'>SignUp</button></Link>         
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnSignedTalents;
