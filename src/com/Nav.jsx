import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { auth } from "../Firebase";
import { signOut } from "firebase/auth";

export default function Nav({ user }) {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <nav>
      {/* Logo goes to /Home */}
      <div className="nav__logo">
        <Link to="/Home">HoopCast</Link>
      </div>

      <ul className="nav__links">
        {/* Home link goes to /Home */}
        <li className="link"><Link to="/Home">Home</Link></li>

        <li className="link"><Link to="/Teams">Teams</Link></li>
        <li className="link"><Link to="/Savegames">Save Games</Link></li>

        {auth.currentUser ? (
          <>
            <li className="link"><span>{user?.email}</span></li>
            <li className="link">
              <button
                style={{ backgroundColor: "red" }}
                onClick={handleSignOut}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="link">
            <Link to="/Register" className="nav__btn">Register</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
