import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";
import { getData } from "../utils/fetchData";
import ProductItem from "../components/product/ProductItem";
import filterSearch from "../utils/filterSearch";
import { useRouter } from "next/router";
import Filter from "../components/Filter";

const Home = (props) => {
  const [products, setProducts] = useState(props.products);

  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckALL = () => {
    products.forEach((product) => (product.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: "Delete all selected products?",
          type: "DELETE_PRODUCT",
        });
      }
    });

    dispatch({ type: "ADD_MODAL", payload: deleteArr });
  };

  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  return (
    <>
      <img className="img-responsive w-100" src="/ad.jpg" alt="ad" />

      <div className="home_page d-sm-flex">
        <Head>
          <title>Home Page</title>
        </Head>
        <Filter state={state}>
          {auth.user && auth.user.role === "admin" && (
            <div className="d-flex justify-content-end my-2">
              <button
                className="btn btn-danger"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={handleDeleteAll}
              >
                DELETE ALL
              </button>
            </div>
          )}
        </Filter>

        {auth.user?.role !== "admin" && (
          <div className="products">
            {products.length === 0 ? (
              <h2>No Products</h2>
            ) : (
              products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  handleCheck={handleCheck}
                />
              ))
            )}
          </div>
        )}
        {auth.user && auth.user.role === "admin" && (
          <div className="table-responsive ml-sm-2">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isCheck}
                      onChange={handleCheckALL}
                      style={{
                        width: "25px",
                        height: "25px",
                        transform: "translateY(8px)",
                      }}
                    />
                  </th>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>In Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} style={{ cursor: "pointer" }}>
                    <th>
                      {
                        <input
                          type="checkbox"
                          checked={product.checked}
                          className="position-absolute"
                          style={{ height: "20px", width: "20px" }}
                          onChange={() => handleCheck(product._id)}
                        />
                      }
                    </th>
                    <th>
                      <img
                        style={{
                          width: 120,
                        }}
                        src={product.images?.[0]?.url}
                        alt={product.images?.[0]?.url}
                      />
                    </th>
                    <th>{product._id}</th>
                    <th>{product.title}</th>
                    <th>{product.inStock}</th>
                    <th className="d-flex">
                      <Link href={`create/${product._id}`}>
                        <a
                          className="btn btn-primary"
                          style={{ marginRight: "5px", flex: 1 }}
                        >
                          Edit
                        </a>
                      </Link>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: "5px", flex: 1 }}
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() =>
                          dispatch({
                            type: "ADD_MODAL",
                            payload: [
                              {
                                data: "",
                                id: product._id,
                                title: product.title,
                                type: "DELETE_PRODUCT",
                              },
                            ],
                          })
                        }
                      >
                        Delete
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {props.result < page * 6 ? (
          ""
        ) : (
          <button
            className="btn btn-outline-info d-block mx-auto mb-4"
            onClick={handleLoadmore}
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&sort=${sort}&title=${search}`
  );
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default Home;
