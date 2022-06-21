import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";

import valid from "../utils/valid";
import { patchData } from "../utils/fetchData";

import { imageUpload } from "../utils/imageUpload";

const HistoryOrder = () => {
  const { state } = useContext(DataContext);
  const { auth, orders } = state;

  if (!auth.user) return null;
  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>

      <section className="row text-secondary my-3">
        <div className="col-md-12">
          <h3 className="text-uppercase">Orders</h3>

          <div className="my-3 table-responsive">
            <table
              className="table table-striped"
            >
              <thead className="thead-dark font-weight-bold">
                <tr>
                  <th className="p-2">id</th>
                  <th className="p-2">date</th>
                  <th className="p-2">total</th>
                  <th className="p-2">delivered</th>
                  <th className="p-2">paid</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered ? (
                        <i className="fas fa-check text-success"></i>
                      ) : (
                        <i className="fas fa-times text-danger"></i>
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <i className="fas fa-check text-success"></i>
                      ) : (
                        <i className="fas fa-times text-danger"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryOrder;
