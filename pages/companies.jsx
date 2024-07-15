import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Talents = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Number of items to display initially
  const observer = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch Users Data
  const fetchData = async () => {
    try {
      const response = await fetch('api/companies', { cache: 'no-store' });
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

  // Check user session and role
  useEffect(() => {
    if (status === 'authenticated' && session?.user.role !== 'admin' && session?.user.role !== 'talent') {
      router.push('/');
    }
  }, [status, session, router]);

  // Render loading state
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render if user is not signed in
  if (!session) {
    return <div>You are not signed in.</div>;
  }


  // Render component
  return (
    <div>
      {filteredData.slice(0, visibleCount).map((item, index) => {
        const isLastElement = index === filteredData.slice(0, visibleCount).length - 1;
        return (
          <div key={item._id} className="flex flex-col m-5" ref={isLastElement ? lastElementRef : null}>
           
              <div className="bg-yellow-500 p-5">
              <h2 className="h2">Company Image</h2>
              <Image
               width={300}
               height={50}
               alt='Company Logo'
                src= {item.companyImage}/>
                <h2 className="h2">Company Name: {item.companyName}</h2>
                <h3 className="h2">Company Type: {item.companyType}</h3>

                <div className='ml-5 flex'>
                <h3>Categories: </h3>
                  <ul>
                    {item.categories &&
                    item.categories.map((categories, index) => (
                        <li key={index}>{categories}</li>
                      ))}
                  </ul>
                  </div> 

                <h3 className="h2">owner FirstName: {item.ownerFirstName}</h3>
                <h3 className="h2">Owner LastName: {item.ownerLastName}</h3>
                <h3 className="h2">Owner Phone Number: {item.ownerPhoneNumber}</h3>
                <h3 className="h2">Owner Email Id: {item.ownerEmailId}</h3>             

                <div className="talent-button">
                  <button className="view-profile">
                    <Link href={`companiessingle/${item._id}`} target="_blank">
                      View Profile
                    </Link>
                  </button>
                </div>
              </div>

          </div>
        );
      })}
    </div>
  );
};

export default Talents;
