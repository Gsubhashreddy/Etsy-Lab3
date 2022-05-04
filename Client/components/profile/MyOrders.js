import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import constants from "./../../utils/constants.json";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import Pagination from "../pagination/Pagination";
import Posts from "../pagination/Posts";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const MyOrders = () => {
  const [orders, setorders] = useState([]);
  const [currency, setCurrency] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(5);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = orders.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(async () => {
    const { data } = await axios.post(constants.uri + "/users/auth");
    console.log(data);
    const res = await axios.post(constants.uri + "/users/myorders", {
      id: data._id,
    });
    setorders(res.data);
    setLoading(false);

    const curr = window.localStorage.getItem("country_currency");
    setCurrency(curr.split(",")[1]);
  }, []);

  const handleSelect = (e) => {
    console.log(e);
    setPostPerPage(e);
  };

  return (

    <Fragment>


        <DropdownButton
            
            title="-- select --"
            onSelect={handleSelect}
                >
                    <Dropdown.Item eventKey="2">2</Dropdown.Item>
                    <Dropdown.Item eventKey="5">5</Dropdown.Item>
                    <Dropdown.Item eventKey="10">10</Dropdown.Item>
            </DropdownButton>
        
      <Card style={{ marginTop: 20, marginLeft: "15%", marginRight: "15%" }}>
        <Card.Header>My Purchases</Card.Header>
        <Card.Body>
          {orders && orders.length > 0 ? (
            currentPosts.map((order) => (
              <>
                <Card.Title>
                  <span style={{ fontWeight: "lighter" }}>Order Id:</span>{" "}
                  <span style={{ fontWeight: "light" }}>{order.orderId}</span>
                </Card.Title>
                <Card.Text>
                  <Row>
                    <Col sm={3}>
                      <Image
                        src={order.productImg}
                        style={{ width: "100%", height: "210px" }}
                      ></Image>
                    </Col>
                    <Col sm={1}></Col>
                    <Col sm={5}>
                      <br />
                      <Row>
                        <Col sm={3}>
                          <h5>{order.productName}</h5>
                        </Col>{" "}
                      </Row>
                      <Row>
                        <Col sm={3}>
                          <span>Quantity</span>
                        </Col>{" "}
                        <Col sm={3}>
                          <span>{order.quantity}</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={3}>
                          <span>Price</span>
                        </Col>
                        <Col sm={3}>
                          <span>
                            {order.price}{" "}
                            <span style={{ fontWeight: "lighter" }}>
                              {currency}
                            </span>
                          </span>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm={3}>
                          <span>Total Paid</span>
                        </Col>
                        <Col sm={3}>
                          <span>
                            {order.price * order.quantity}{" "}
                            <span style={{ fontWeight: "lighter" }}>
                              {currency}
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={2}>
                      <br />
                      <Row>
                        <span>Seller: {order.shopName}</span>
                      </Row>
                      <br />
                      <br />
                      <Row>
                        {order.date ? <span>Ordered on {order.date}</span> : ""}
                      </Row>
                      <Row>
                        {order.giftMsg ? (
                          <span> Gift Note : {order.giftMsg}</span>
                        ) : (
                          ""
                        )}
                      </Row>
                    </Col>
                  </Row>
                </Card.Text>
                <hr />
              </>
            ))
          ) : (
            <span>No Orders yet!</span>
          )}
        </Card.Body>
      </Card>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={orders.length}
        paginate={paginate}
      />
    </Fragment>
  );
};

export default MyOrders;
