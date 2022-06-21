import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Register = () => {
  const initialState = { name: "", email: "", password: "", cf_password: "" };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password, cf_password } = userData;

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
    const errMsg = valid(name, email, password, cf_password);
    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/register", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <div>
      <Head>
        <title>Register Page</title>
      </Head>

      <div className="d-flex flex-column justify-content-center mt-5">
        <div className="mx-auto">
          <img
            style={{ height: 50, cursor: "pointer" }}
            src="/logo.png"
            alt="logo"
          />
        </div>

        <h4 className="font-weight-bold text-center my-3">
          BECOME A NIKE MEMBER
        </h4>
        <p className="text-center">
          <small className=" text-muted">
            Create your Nike Member profile and get first <br /> access to the
            very best of Nike products, inspiration <br /> and community.{" "}
          </small>
        </p>
      </div>

      <form
        className="mx-auto my-4"
        style={{ maxWidth: "350px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            placeholder="Name"
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeInput}
          />
        </div>

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

        <div className="form-group">
          <input
            placeholder="password"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Confirm password"
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100 mt-5">
          Join us
        </button>

        <p className="my-2 text-center">
          <small>
          <span className="text-muted">Already a Member? </span>
          <Link href="/signin">
            <a style={{ textDecoration: "underline" }}> Sign In </a>
          </Link>
          </small>
        </p>
      </form>
    </div>
  );
};

export default Register;
