import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";

function NavBar() {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Logged out!" } });
    return router.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-right"
          href="#"
          id="navbarDropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt={auth.user.avatar}
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-3px)",
              marginRight: "3px",
            }}
          />{" "}
          {auth.user.name}
        </a>

        <div
          style={{ position: "absolute", left: -55, top: 40 }}
          className="dropdown-menu"
          aria-labelledby="navbarDropdownMenuLink"
        >
          <Link href="/profile">
            <a className="dropdown-item">Profile</a>
          </Link>
          <Link href="/order">
            <a className="dropdown-item">Order</a>
          </Link>
          {auth.user.role === "admin" && adminRouter()}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </li>
    );
  };

  return (
    <nav className="d-flex justify-content-between sticky-top navbar navbar-expand-lg navbar-dark " style={{backgroundColor:"black"}}>
      <Link href="/">
        <div>
          <img
            style={{ height: 50, cursor: "pointer" }}
            src="/logo.png"
            alt="logo"
          />
        </div>
      </Link>
      {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button> */}
      <div className="justify-content-end">
        <ul className="navbar-nav p-1 d-flex flex-row">
          <li className="nav-item mr-3 mr-lg-1">
            <Link href="/favorite">
              <a className={"nav-link text-right" + isActive("/favorite")}>
                <i class="fa fa-solid fa-heart"></i>
              </a>
            </Link>
          </li>
          <li className="nav-item mr-3 mr-lg-1">
            <Link href="/cart">
              <a className={"nav-link text-right" + isActive("/cart")}>
                <i
                  className="fas fa-shopping-cart position-relative"
                  aria-hidden="true"
                >
                  <span
                    className="position-absolute"
                    style={{
                      padding: "3px 6px",
                      background: "#ed143dc2",
                      borderRadius: "50%",
                      top: "-10px",
                      right: "-10px",
                      color: "white",
                      fontSize: "14px",
                      font: "icon",
                    }}
                  >
                    {cart.length}
                  </span>
                </i>
              </a>
            </Link>
          </li>
          {Object.keys(auth).length === 0 ? (
            <>
              <li className="nav-item">
                <Link href="/signin">
                  <a className={"nav-link text-right" + isActive("/signin")}>
                    Sign in
                  </a>
                </Link>
              </li>
              <li className="d-flex align-items-center mx-lg-0 mx-1 text-secondary">
                <a>|</a>
              </li>
              <li className="nav-item">
                <Link href="/register">
                  <a className={"nav-link text-right" + isActive("/register")}>
                    Sign up
                  </a>
                </Link>
              </li>
            </>
          ) : (
            loggedRouter()
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
