import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import ProductItem from "../components/product/ProductItem";


const Home = (props) => {
  const [products, setProducts] = useState([]);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  useEffect(() => {
    const favoriteLocal = JSON.parse(localStorage.getItem("favorite"));
    setProducts(favoriteLocal);
  }, []);

  return (
    <>
      <h3 className="text-uppercase">Wishlist</h3>
      <div className="home_page d-sm-flex">
        <Head>
          <title>Wishlist</title>
        </Head>
        {auth.user?.role !== "admin" && (
          <div className="products">
            {products.length === 0 ? (
              <h4>No Products</h4>
            ) : (
              products.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
