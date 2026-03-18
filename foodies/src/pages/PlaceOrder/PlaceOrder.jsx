import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createOrder, deleteOrder } from "../../service/orderService";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    province: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.province}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await createOrder(orderData, token);

      // Backend returns PayHere checkout params when order is created
      if (response && response.payhereOrderId && response.hash) {
        initiatePayherePayment(response);
      } else {
        toast.error("Unable to place order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Unable to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  /**
   * PayHere requires a form POST to their checkout URL.
   * We build a hidden form dynamically and submit it.
   * PayHere will then redirect to return_url / cancel_url.
   * Payment confirmation happens server-side via the notify_url.
   */
  const initiatePayherePayment = (order) => {
    // Build the items description string from cart
    const itemsDescription = cartItems
      .map((item) => `${item.name} x${quantities[item.id]}`)
      .join(", ");

    const formFields = {
      merchant_id:  order.merchantId,
      return_url:   order.returnUrl,
      cancel_url:   order.cancelUrl,
      notify_url:   order.notifyUrl,
      order_id:     order.payhereOrderId,
      items:        itemsDescription,
      currency:     order.currency || "LKR",
      amount:       Number(order.amount).toFixed(2),
      first_name:   data.firstName,
      last_name:    data.lastName,
      email:        data.email,
      phone:        data.phoneNumber,
      address:      data.address,
      city:         data.city,
      country:      "Sri Lanka",
      hash:         order.hash,
    };

    // Create a hidden form and submit it to PayHere
    const form = document.createElement("form");
    form.method = "POST";
    form.action = order.checkoutUrl; // e.g. https://sandbox.payhere.lk/pay/checkout

    Object.entries(formFields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit(); // Redirects the user to PayHere's hosted checkout page
  };

  // Cart items
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.logo}
            alt=""
            width="98"
            height="98"
          />
        </div>
        <div className="row g-5">
          {/* ── Order Summary ── */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    LKR {(item.price * quantities[item.id]).toFixed(2)}
                  </span>
                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between">
                <span>Shipping</span>
                <span className="text-body-secondary">
                  LKR {subtotal === 0 ? "0.00" : shipping.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Tax (10%)</span>
                <span className="text-body-secondary">
                  LKR {tax.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (LKR)</span>
                <strong>LKR {total.toFixed(2)}</strong>
              </li>
            </ul>

            {/* PayHere badge */}
            <div className="text-center mt-2">
              <small className="text-muted">
                Secured by{" "}
                <a
                  href="https://www.payhere.lk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none fw-semibold"
                >
                  PayHere
                </a>
              </small>
            </div>
          </div>

          {/* ── Billing Form ── */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Kasun"
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Perera"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    name="lastName"
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="you@example.com"
                      required
                      name="email"
                      onChange={onChangeHandler}
                      value={data.email}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="0771234567"
                    required
                    value={data.phoneNumber}
                    name="phoneNumber"
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="No. 12, Galle Road"
                    required
                    value={data.address}
                    name="address"
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-5">
                  <label htmlFor="province" className="form-label">
                    Province
                  </label>
                  <select
                    className="form-select"
                    id="province"
                    required
                    name="province"
                    value={data.province}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Western</option>
                    <option>Central</option>
                    <option>Southern</option>
                    <option>Northern</option>
                    <option>Eastern</option>
                    <option>North Western</option>
                    <option>North Central</option>
                    <option>Uva</option>
                    <option>Sabaragamuwa</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    placeholder="Colombo"
                    required
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    placeholder="10100"
                    required
                    name="zip"
                    value={data.zip}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Redirecting to PayHere...
                  </>
                ) : (
                  "Continue to checkout"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;