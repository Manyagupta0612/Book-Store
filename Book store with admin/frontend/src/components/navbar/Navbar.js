import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Admin Profile", link: "/profile" },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role=useSelector((state)=> state.auth.role);
  if (!isLoggedIn) {
    links.splice(2, 2);
  }

    if(isLoggedIn=== true && role==="user")
    {
      links.splice(4, 1);
    }

  if(isLoggedIn=== true && role==="admin")
  {
    links.splice(3, 1);
  }
  const [MobileNav, setMobileNav] = useState("hidden");

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-2 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="Logo"
          />
          <h1 className="text-2xl font-semibold">BookeHeaven</h1>
        </Link>

        <div className="nav-links-bookheaven flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((items, i) => (
              <Link
                to={items.link}
                className={`${
                  items.title === "Profile" || items.title==="Admin Profile"
                    ? "px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800"
                    : "hover:text-blue-500"
                } transition-all duration-300`}
                key={i}
              >
                {items.title}
              </Link>
            ))}
          </div>

          {!isLoggedIn && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/LogIn"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                LogIn
              </Link>
              <Link
                to="/SignUp"
                className="px-4 py-1 border bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                SignUp
              </Link>
            </div>
          )}

          <button
            className="block md:hidden text-white text-2xl hover:text-zinc-400"
            onClick={() =>
              setMobileNav(MobileNav === "hidden" ? "block" : "hidden")
            }
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      <div
        className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((items, i) => (
          <Link
            to={items.link}
            className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
            key={i}
            onClick={() => setMobileNav("hidden")}
          >
            {items.title}
          </Link>
        ))}

        {!isLoggedIn && (
          <>
            <Link
              to="/LogIn"
              className="px-8 py-2 mb-8 text-3xl font-semibold border text-white border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              LogIn
            </Link>
            <Link
              to="/SignUp"
              className="px-8 py-2 mb-8 text-3xl font-semibold bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
