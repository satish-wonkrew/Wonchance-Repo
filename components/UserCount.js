import { useEffect, useState } from 'react';

export default function UsersCount() {
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    async function fetchUsersCount(status) {
      const url = status ? `/api/usersCount?status=${status}` : '/api/usersCount';
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function getCounts() {
      const total = await fetchUsersCount();
      const pending = await fetchUsersCount('pending');
      const active = await fetchUsersCount('active');

      setTotalCount(total.totalCount);
      setPendingCount(pending.filteredCount);
      setActiveCount(active.filteredCount);
    }

    getCounts();
  }, []);

  return (
    <div className='flex gap-5 bg-red-200 p-2 text-lg justify-center m-5'>
      <h3>Total Talents Count: {totalCount}</h3>
      <h3>Active Talents Count: {activeCount}</h3>
      <h3>Pending Talents Count: {pendingCount}</h3>
    </div>
  );
}
