import { useContext, useState } from "react";
import axios from "axios";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";
import Email from "./UI/Email";
import { render } from "@react-email/render";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [order, setOrder] = useState();
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(`${import.meta.env.BACKEND_URL}/orders`, requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  const initPayment = (data) => {
    const options = {
      key: import.meta.env.RZPY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "React Restaurant",
      description: "Test Transaction",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${import.meta.env.BACKEND_URL}/api/payment/verify`;
          const { data } = await axios.post(verifyUrl, response);
          if (data.message === "Payment verified successfully") {
            userProgressCtx.showCheckout();
            setPaymentSuccess(true);
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const orderUrl = `${import.meta.env.BACKEND_URL}/api/payment/orders`;
      const { data } = await axios.post(orderUrl, { amount: cartTotal });
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function sendEmail() {
    const emailHtml = render(<Email order={order} />);
    fetch(`${import.meta.env.BACKEND_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailBody: emailHtml, email: order.customer.email }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    sendEmail();
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    const order = {
      items: cartCtx.items,
      customer: customerData,
    };
    setOrder(order);
    sendRequest(
      JSON.stringify({
        order: order,
      })
    );
    handleClose();
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button onClick={handlePayment}>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error && paymentSuccess) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={() => handleFinish()}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
