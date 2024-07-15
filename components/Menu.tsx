// components/Header.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import WonchanceLogo from '../images/WonchanceLogo.png';

const Menu = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
        const closeBtn = document.getElementById('close-btn') as HTMLButtonElement;
        const overlay = document.getElementById('overlay') as HTMLDivElement;
        const nav = document.getElementById('nav') as HTMLElement;

        const toggleMenu = () => {
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
        };

        menuToggle.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        const handleDropdownMouseEnter = (event: Event) => {
            const dropdown = event.currentTarget as HTMLElement;
            if (window.innerWidth > 768) {
                dropdown.classList.add('active');
            }
        };

        const handleDropdownMouseLeave = (event: Event) => {
            const dropdown = event.currentTarget as HTMLElement;
            if (window.innerWidth > 768) {
                dropdown.classList.remove('active');
            }
        };

        const handleDropdownClick = (event: Event) => {
            const element = event.currentTarget as HTMLElement;
            if (window.innerWidth <= 768) {
                event.preventDefault();
                const dropdown = element.parentElement as HTMLElement;
                dropdown.classList.toggle('active');
            }
        };

        document.querySelectorAll('.dropdown').forEach((dropdown) => {
            dropdown.addEventListener('mouseenter', handleDropdownMouseEnter);
            dropdown.addEventListener('mouseleave', handleDropdownMouseLeave);
        });

        document.querySelectorAll('.dropdown-toggle').forEach((element) => {
            element.addEventListener('click', handleDropdownClick);
        });

        return () => {
            menuToggle.removeEventListener('click', toggleMenu);
            closeBtn.removeEventListener('click', toggleMenu);
            overlay.removeEventListener('click', toggleMenu);

            document.querySelectorAll('.dropdown').forEach((dropdown) => {
                dropdown.removeEventListener('mouseenter', handleDropdownMouseEnter);
                dropdown.removeEventListener('mouseleave', handleDropdownMouseLeave);
            });

            document.querySelectorAll('.dropdown-toggle').forEach((element) => {
                element.removeEventListener('click', handleDropdownClick);
            });
        };
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <>
            <header className="menu-body">
                <div className="header">
                    <div className="logo">
                        <Link href="/">
                            <Image width={150} height={50} src={WonchanceLogo} className="h-8" alt="Flowbite Logo" />
                        </Link>
                    </div>
                    {status === 'authenticated' ? (
                    <>
                    <nav className="nav" id="nav">
                        <button className="close-btn" id="close-btn">×</button>
                        <ul className="menu">
                            <li><a href="/">Home</a></li>
                            <li className="dropdown">
                                <a href="/talents" className="dropdown-toggle">Talents <span className="arrow-down">▼</span></a>
                                <ul className="dropdown-menu">
                                    <li><a href="/pendingTalent">Pending Talents</a></li>
                                    <li><a href="/newCompany">Create Company</a></li>
                                    <li><a href="/newProject">Create Project</a></li>
                                    <li><a href="/newRole">Create Role</a></li>
                                    <li><a href="/newCastingCall">Create CastingCalls</a></li>
                                </ul>
                            </li>
                            <li><a href="/addUser">Add User</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </nav>
                    <div className="profile-view">
                            <>
                                <button onClick={handleLogout}>Logout</button>
                                <img src="profile.jpg" alt="Profile Image" className="profile-img" />
                            </>
                        
                    </div>
                    </>
                    ):(
                        <>
                         <nav className="nav" id="nav">
                        <button className="close-btn" id="close-btn">×</button>
                        <ul className="menu">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/info">Info</a></li>
                        </ul>
                    </nav>

                    <div >
                            <>
                                <button onClick={handleLogout}>Login</button>
                            </>
                        
                    </div>
                        </>
                )}
                    <button className="menu-toggle" id="menu-toggle">☰</button>
                    <div className="overlay" id="overlay"></div>
                </div>
            </header>
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');

                .menu-body {
                    display: flex;
                    justify-content: center;
                    background-color: #F7FBFF;
                    height: 100px;
                    z-index: 999;
                }
                .header {
                    display: flex;
                    width: 1240px;
                    justify-content: space-between;
                    align-items: center;
                    color: #232323;
                    position: relative;
                }
                .logo {
                    font-size: 1.5em;
                }
                .nav {
                    flex-grow: 1;
                    text-align: center;
                }
                .menu {
                    list-style: none;
                    display: flex;
                    gap: 40px;
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 18px;
                    justify-content: center;
                }
                .menu li {
                    margin: 0 15px;
                    position: relative;
                }
                .menu a {
                    color: #232323;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }
                .profile-view {
                    margin-left: auto;
                    display: flex;
                    gap: 25px;
                }
                .profile-view button {
                    font-size: 16px;
                    font-weight: 600;
                    padding: 10px 30px;
                    background-color: #000000;
                    border: 1px solid #232323;
                    border-radius: 4px;
                    color: #F7FBFF;
                }
                .profile-img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
                .menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #232323;
                    font-size: 1.5em;
                    cursor: pointer;
                }
                .close-btn {
                    display: none;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 2em;
                    cursor: pointer;
                }
                .overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                .dropdown-menu {
                    display: none;
                    position: absolute;
                    width: 200px;
                    z-index: 999;
                    top: 100%;
                    left: 0;
                    background-color: #444;
                    list-style: none;
                    margin: 0;
                    padding: 5px;
                    border-radius: 5px;
                    text-align: left;
                }
                .dropdown-menu li {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 400;
                }
                .dropdown-menu a {
                    padding: 10px 20px;
                    display: block;
                    color: #fff;
                }
                .dropdown-toggle .arrow-down {
                    margin-left: 5px;
                    font-size: 0.8em;
                    transition: transform 0.3s ease;
                }
                .dropdown.active .dropdown-menu {
                    display: block;
                }
                .dropdown.active .arrow-down {
                    transform: rotate(180deg);
                }
                @media (max-width: 768px) {
                    .nav {
                        display: block;
                        position: fixed;
                        top: 0;
                        left: -90%;
                        width: 90%;
                        height: 100%;
                        background-color: #FBFBFB;
                        z-index: 1000;
                        transition: left 0.3s ease;
                        padding-top: 60px;
                        text-align: left;
                    }
                    .menu-body {
                        height: 10vh;
                    }
                    .header {
                        padding: 0px 10px;
                    }
                    .profile-view button {
                        display: none;
                    }
                    .profile-view .profile-img {
                        margin-right: 15px;
                    }
                    .nav.active {
                        left: 0;
                    }
                    .menu {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0;
                    }
                    .menu li {
                        width: 100%;
                    }
                    .menu a {
                        padding: 10px 0;
                        width: 100%;
                    }
                    .menu-toggle {
                        display: block;
                    }
                    .close-btn {
                        display: block;
                        color:#000;
                    }
                    .overlay.active {
                        display: block;
                    }
                    .dropdown-menu {
                        position: relative;
                        top: 0;
                        left: 0;
                        width: 80%;
                        background: #444;
                        border: none;
                        border-radius: 0;
                        padding: 20px;
                    }
                    .dropdown-menu a {
                        color: #fff;
                    }
                }
            `}</style>
        </>
    );
};

export default Menu;
