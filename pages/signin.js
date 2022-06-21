import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const Signin = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/login", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <div>
      <Head>
        <title>Sign in Page</title>
      </Head>
      <div className="d-flex flex-column justify-content-center mt-5">
        <div className="mx-auto">
          <img
            style={{ height: 50, cursor: "pointer" }}
            src="/logo.png"
            alt="logo"
          />
        </div>

        <h3 className="font-weight-bold text-center my-3">
          YOUR ACCOUNT FOR <br /> EVERYTHING NIKE
        </h3>
      </div>

      <form
        className="mx-auto my-4"
        style={{ maxWidth: "350px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            placeholder="Email address"
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group mb-5">
          <input
            placeholder="Password"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>

        <p className="my-2 text-center">
          <small>
          <span className="text-muted">Not a Member?</span>
          <Link href="/register">
            <a style={{ textDecoration: "underline" }}>Join Us.</a>
          </Link>
          </small>
        </p>
      </form>
    </div>
  );
};

export default Signin;
