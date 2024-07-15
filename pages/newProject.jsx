import CreateProject from '../components/CreateProject';

export default function Home() {
  return (
    <div className='m-16  flex flex-col gap-6 justify-center items-center '>
      <div className=' p-12 border border-sky-500 rounded-2xl'>
      <h1 className='text-2xl text-center mb-5'>Create Project</h1>
      <CreateProject />
      </div>
        </div>
  );
}
