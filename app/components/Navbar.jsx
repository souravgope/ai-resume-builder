import { Link } from "react-router";
import { usePuterStore } from "../lib/puter";
const Navbar = () => {
    const { auth } = usePuterStore();
    return (<nav className="navbar ">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex gap-5">
              <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
             {auth.isAuthenticated && (
          <button onClick={auth.signOut} className="logout-button">
            Logout
          </button>)}
            </div>
        </nav>);
};
export default Navbar;
