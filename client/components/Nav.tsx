import React from "react";
import Link from "next/link";
import Readit from "../images/logo.svg";
import { useAuthDispatch, useAuthState } from "../context/authContext";
import axios from "axios";

const Nav = () => {
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      {/* LOGO & TITLE */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Readit className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">
            <a>Readit</a>
          </Link>
        </span>
      </div>

      {/* Search Input */}
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 pr-3 leading-5 bg-transparent rounded w-160 focus:outline-none"
          placeholder="Search"
        />
      </div>

      {/* Auth buttons */}
      <div className="flex">
        {authenticated ? (
          // show logout
          <button
            className="w-32 py-1 mr-4 leading-5 hollow blue button"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                Login
              </a>
            </Link>

            <Link href="/register">
              <a className="w-32 py-1 blue button">Sign up</a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Nav;
