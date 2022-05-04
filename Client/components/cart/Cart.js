import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Card, Row, Col, Image, Form, Button, Display } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import constants from "./../../utils/constants.json";
import { useSelector, useDispatch } from "react-redux";

const Cart = () => {
  const [giftPack, setGiftPack] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currency, setCurrency] = useState();
  const [subtotal, setsubtotal] = useState(0);
  const dispatch = useDispatch();

  const [quntityCounter, setCounter] = useState(1);
  const incrementCounter = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        return { ...item, quantity: String(parseInt(item.quantity) + 1) };
      } else {
        return item;
      }
    });
    //setCounter(quntityCounter + 1);
    setCartItems(updatedCart);
    let total = 0;
    updatedCart.forEach((item) => {
      total += item.quantity * item.price;
    });
    setsubtotal(total);
  };
  const decrementCounter = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        return { ...item, quantity: String(parseInt(item.quantity) - 1) };
      } else {
        return item;
      }
    });
    //setCounter(quntityCounter + 1);
    setCartItems(updatedCart);
    let total = 0;
    updatedCart.forEach((item) => {
      total += item.quantity * item.price;
    });
    setsubtotal(total);
  };

  let cart_Items = useSelector((state) => state.cartItems);
  //console.log(cart_Items)
  //setCartItems(cartItems)
  useEffect(async () => {
    const { data } = await axios.post(constants.uri + "/users/auth");
    const userId = data._id;
    setUserId(data._id);
    const res = await axios.post(constants.uri + "/order/cart-items", {
      userId,
    });
    setCartItems(res.data);
    dispatch({ type: "FETCH_ALL", payload: res.data });
    const items = res.data;

    //calculate subtotal
    var total = 0;
    items.map((item) => {
      total = total + item.quantity * item.price;
    });
    setsubtotal(total);

    const curr = window.localStorage.getItem("country_currency");
    setCurrency(curr.split(",")[1]);
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    var i = 0;
    cart_Items.map(async (item) => {
      i++;
      //console.log(item,"----------------------------")
      const res = await axios.post(constants.uri + "/order/place-order", {
        elasticId: item.elasticId,
        productId: item.productId,
        userId,
        price: item.price,
        quantity: item.quantity,
        giftMsg: giftMsg,
        
      });
      //console.log(cart_Items.length,i)
      if (i == cart_Items.length) {
        //toast.success("Order Placed")
        alert("Order Placed");
        setOrderPlaced(true);
      }
      window.localStorage.setItem(
        "cart",
        window.localStorage.getItem("cart") - 1
      );
    });
    toast.success();
  };

  console.log('consoletest',giftMsg);

  const removeFromCart = async (item) => {
    //console.log(item)
    const res = await axios.post(constants.uri + "/order/cart/remove-item", {
      userId: item.userId,
      productId: item.productId,
    });
    if (res.data) {
      //setCartItems(cartItems.filter(ele=> ele.id != item.id))
      //cart_Items = cart_Items.filter(ele=> ele._id != item._id);
      dispatch({ type: "REMOVE_ITEM", payload: item });
      //console.log(cart_Items)
      //toast('Item removed from cart')
      alert("Item removed from cart");

      //Calculate subtotal
      var total = 0;
      // cart_Items.filter(ele=> ele._id !== item._id).map(item=>{
      //     total = total + (item.quantity*item.price)
      // })
      cartItems
        .filter((ele) => ele._id !== item._id)
        .map((item) => {
          total = total + item.quantity * item.price;
        });

      setsubtotal(total);

      window.localStorage.setItem(
        "cart",
        window.localStorage.getItem("cart") - 1
      );
    }
  };

  if (orderPlaced) {
    return <Navigate to="/myOrders" />;
  }

  return (
    <Fragment>
      <Row style={{ marginLeft: "10%", marginRight: "10%", marginTop: 25 }}>
        <Col sm={7}>
          <Card>
            <Card.Body>
              <Row>
                <h4 style={{ textAlign: "center" }}>Cart Items</h4>
              </Row>
              <hr />
              {cart_Items &&
                cart_Items.map((item,index) => (
                  <Row>
                    <Col onSubmit={3}>
                      <Image src={item.img} />
                    </Col>
                    <Col sm={6}>
                      <Row>
                        <h4>{item.product_name}</h4>
                      </Row>
                      <Row>
                        <Col>
                          <span>Price per Unit:</span>
                        </Col>
                        <Col>
                          {" "}
                          <span>
                            {item.price}{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {currency}
                            </span>
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <span>Quantity:</span>
                        </Col>
                        <Button
                          style={{ height: "25px", width: "40px" }}
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            decrementCounter(item._id);
                          }}
                        >
                          -
                        </Button>

                        <Col>
                          {" "}
                          <span>
                            <label style={{ marginLeft: ".5rem" }}>
                              {cartItems.map((tempitem) => {
                                if (tempitem._id === item._id) {
                                  return tempitem.quantity;
                                }
                              })}
                            </label>
                          </span>
                        </Col>
                        <Button
                          style={{ height: "25px", width: "40px" }}
                          size="sm"
                          variant="success"
                          onClick={() => {
                            incrementCounter(item._id);
                          }}
                        >
                          +
                        </Button>
                      </Row>
                      <br />
                      <Row>
                        <Col>
                          <span style={{ fontWeight: "bold" }}>Total:</span>
                        </Col>
                        <Col>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>
                            {cartItems.map((tempitem) => {
                              if (tempitem._id === item._id) {
                                return parseFloat(
                                  tempitem.quantity * item.price
                                ).toFixed(2);
                              }
                            })}
                          </span>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Form.Check
                          type="checkbox"
                          label="Gift Options"
                          onClick={() => setGiftPack(!giftPack)}
                        />
                        {giftPack && (
                          <input
                            onChange={(e) => {
                              e.preventDefault();
                              setGiftMsg(e.target.value);
                            }}
                          />
                        )}

                        {/* <input type="checkbox">Gift Card</input> */}
                      </Row>
                      <Row>
                        <Button
                          variant="outline-danger"
                          onClick={() => removeFromCart(item)}
                          className="rounded"
                        >
                          Remove from Cart
                        </Button>
                      </Row>
                    </Col>
                    <Col sm={1}></Col>
                    <hr />
                  </Row>
                ))}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Row>
                <h4 style={{ textAlign: "center" }}>Total</h4>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Sub Total:</h6>
                </Col>
                <Col>
                  <span style={{ fontWeight: "lighter" }}>
                    {subtotal}{" "}
                    <span style={{ fontWeight: "lighter" }}>{currency}</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6>Delivery:</h6>
                </Col>
                <Col>
                  <span style={{ fontWeight: "lighter" }}>
                    0.00{" "}
                    <span style={{ fontWeight: "lighter" }}>{currency}</span>
                  </span>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <h6>Total:</h6>
                </Col>
                <Col>
                  <span style={{ fontWeight: "lighter" }}>
                    {subtotal}{" "}
                    <span style={{ fontWeight: "lighter" }}>{currency}</span>
                  </span>
                </Col>
              </Row>
              <br />

              <br />
              <Row>
                <Button
                  variant="success"
                  onClick={(e) => {
                    placeOrder(e);
                  }}
                  className="rounded-pill"
                >
                  Place Order
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Cart;
