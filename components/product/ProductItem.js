import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { addToCart, addToFavorite } from "../../store/Actions";

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, favorite } = state;
  const isFavorite = (id) => {
    const check = favorite.every(item => {
      return item._id !== product._id
  })
    return !check
  };
  return (
    <Link href={`product/${product._id}`}>
      <div
        className="card position-relative"
        style={{ width: "18rem", cursor: "pointer" }}
      >
        <div
          className="bg-light position-absolute p-2 border border-light rounded-circle"
          style={{ right: 0, lineHeight: "16px" }}
          onClick={(event) => {
            event.cancelBubble = true;
            if (event.stopPropagation) event.stopPropagation();
            dispatch(addToFavorite(product, favorite));
          }}
        >
          {
            isFavorite(product._id) ? <img width={24} src="/black-filled-heart.png"/>: <img width={24} src="/black-outlined-heart.png"/>
          }
        </div>
        {auth.user && auth.user.role === "admin" && (
          <input
            type="checkbox"
            checked={product.checked}
            className="position-absolute"
            style={{ height: "20px", width: "20px" }}
            onChange={() => handleCheck(product._id)}
          />
        )}
        <img
          className="card-img-top"
          src={product.images[0].url}
          alt={product.images[0].url}
        />
        <div className="card-body">
          <h5 className="card-title text-capitalize" title={product.title}>
            {product.title}
          </h5>

          <div className="row justify-content-between mx-0">
            <h6 className="">${product.price}</h6>
            {product.inStock > 0 ? (
              ""
            ) : (
              <h6 className="text-danger">Out Stock</h6>
            )}
          </div>

          <p className="card-text text-secondary" title={product.description}>
            {product.description}
          </p>

          <div className="row justify-content-between mx-0">
            {/* <Link href={`product/${product._id}`}>
            <a
              className="btn btn-outline-dark"
              style={{ marginRight: "5px", flex: 1 }}
            >
              View
            </a>
          </Link> */}
            {/* <button
              className="btn btn-dark"
              style={{ marginLeft: "5px", flex: 1 }}
              disabled={product.inStock === 0 ? true : false}
              onClick={(event) => {
                event.cancelBubble = true;
                if (event.stopPropagation) event.stopPropagation();
                dispatch(addToCart(product, cart));
              }}
            >
              Buy
            </button> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
