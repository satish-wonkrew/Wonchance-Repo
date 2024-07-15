import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from "next/link";
import { HiPencilAlt, HiShare } from "react-icons/hi";
import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import PageNotFound from '../components/404';
import UserCount from '../components/UserCount';
import Image from 'next/image';

const Talents = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: 2, max: 35 });
  const [searchTerm, setSearchTerm] = useState('');
  const [shareVisible, setShareVisible] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3000); // Number of items to display initially
  const observer = useRef(null);

  // Non Admin Users Code
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch Users Data
  useEffect(() => {
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
    filtered = filtered.filter(item => item.age >= ageRange.min && item.age <= ageRange.max);

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.whatsappNumber.includes(searchTerm) ||
        item.firstName.toUpperCase().includes(searchTerm.toUpperCase()) ||
        item.gmail.toUpperCase().includes(searchTerm.toUpperCase())
      );
    }

    setFilteredData(filtered);
  }, [genderFilter, profileFilter, ageRange, searchTerm, data]);

  const copyToClipboard = (id) => {
    const url = `${window.location.origin}/talentsingle/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

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

  // For User Session
  useEffect(() => {
    if (status === 'authenticated'
       && session?.user.role !== 'admin'
        && session?.user.role !== 'talent'
      ) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div><PageNotFound/></div>;
  }

  const incrementAge = (type) => {
    setAgeRange((prev) => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrementAge = (type) => {
    setAgeRange((prev) => ({
      ...prev,
      [type]: prev[type] > 0 ? prev[type] - 1 : 0
    }));
  };

  return (
    <div className='talent-archive'>
      {/*Filters*/}
      <div className="filters">
        <h1>Filter</h1>
        {/* Search */}
        <div>
          <label htmlFor="searchTerm" className="filter-label">Search Talents</label>
          <input 
            className='filter-search'
            type="text" 
            id="searchTerm" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
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
        {/* Age */}
        <div>
          <label htmlFor="minAge" className="filter-label">Min Age:</label>
          <div className="age-input-container">
            <button onClick={() => decrementAge('min')}>-</button>
            <input
              type="number"
              id="minAge"
              value={ageRange.min}
              onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) })}
            />
            <button onClick={() => incrementAge('min')}>+</button>
          </div>
          <label htmlFor="maxAge" className="filter-label">Max Age:</label>
          <div className="age-input-container">
            <button onClick={() => decrementAge('max')}>-</button>
            <input
              type="number"
              id="maxAge"
              value={ageRange.max}
              onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
            />
            <button onClick={() => incrementAge('max')}>+</button>
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
              {item.statusLevel === 'pending' ? (
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
                      <h2>{item.firstName}</h2>
                    </div>
                    <div className='talent-id-status'>
                      <h3>Profile Id: {item._id}</h3>
                      <h3>Status: {item.statusLevel}</h3>
                    </div>
                    <div className='talent-over-view'>
                      <h2>OVERVIEW</h2>
                    </div>
                    <h3 className='h2'>Age: {item.age}</h3>
                    <div className='talent-appearance'>
                      <h2>Appearance:</h2>
                    </div>
                    <div>
                      <h3 className='h2'>Height: {item.height}Cm | Weight: {item.weight}Kg | Body Type: {item.bodyType}</h3>
                      <h3 className='h2'>Hair Color: {item.hairColor} | Skin Tone: {item.skinTone} | Eye Color: {item.eyeColor}</h3>
                    </div>
                    <div className="talent-button">
                    <button className='view-profile'>
                        <Link href={`talentedit/${item._id}`} target="_blank">
                          Edit Profile
                        </Link>
                      </button>
                      <button className='contact-us'>
                        <Link href="/contactUs" target="_blank">
                          Contact
                        </Link>
                      </button>
                      <button className='view-profile'>
                        <Link href={`talentsingle/${item._id}`} target="_blank">
                          View Profile
                        </Link>
                      </button>
                      <button className='share-button' onClick={() => setShareVisible(shareVisible === item._id ? null : item._id)}>
                        <HiShare size={24} />
                      </button>
                    </div>
                    {shareVisible === item._id && (
                      <div className='share-links'>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/talentsingle/${item._id}`} target="_blank" rel="noopener noreferrer">
                          <FaFacebook size={24} />
                        </a>
                        <a href={`https://wa.me/?text=${window.location.origin}/talentsingle/${item._id}`} target="_blank" rel="noopener noreferrer">
                          <FaWhatsapp size={24} />
                        </a>
                        <a href={`https://www.instagram.com/?url=${window.location.origin}/talentsingle/${item._id}`} target="_blank" rel="noopener noreferrer">
                          <FaInstagram size={24} />
                        </a>
                        <button onClick={() => copyToClipboard(item._id)}>Copy Link</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Talents;
