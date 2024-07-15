import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Talents = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Number of items to display initially
  const observer = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch('api/castings', { cache: 'no-store' });
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Render component
  return (
    <div>
      <h1>Casting Calls</h1>
      {filteredData.slice(0, visibleCount).map((item, index) => {
        const isLastElement = index === filteredData.slice(0, visibleCount).length - 1;
        const alreadyApplied = item.appliedTalentsId.some(entry => entry.userId === session.user.id);

        return (
          <div key={item._id} className="flex flex-col m-5" ref={isLastElement ? lastElementRef : null}>
            <div className="bg-yellow-500 p-5">
              <h2 className="h2">Casting Title: {item.castingTitle}</h2>
              <h3 className="h2">Company: {item.company}</h3>
              <h3 className="h2">Project Name: {item.projectName}</h3>
              <h3 className="h2">Role Types: {item.roleTypes}</h3>
                         
              <h3 className="h2">Shoot Start Date: {formatDate(item.shootDate)}</h3>
              <h3 className="h2">Shoot Last Date: {formatDate(item.lastDate)}</h3>

              <div>
                {alreadyApplied ? (
                  <p>You have already applied for this profile.</p>
                ) : null}
                <button className="view-profile">
                  <Link href={`castingcall/${item._id}`} target="_blank">
                    View And Apply
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
