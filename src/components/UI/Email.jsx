import {
  Html,
  Head,
  Text,
  Row,
  Column,
  Section,
  Container,
  Hr,
  Tailwind,
  Body,
  Img,
} from "@react-email/components";
import { currencyFormatter } from "../../util/formatting";

export default function Email({ order }) {
  const {
    name,
    email,
    street,
    "postal-code": postalCode,
    city,
  } = order.customer;
  const customerOrder = order.items;
  console.log(name);
  const cartTotal = order.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Your Order from React Restaurant</title>
      </Head>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Section className="mt-[32px]">
            <Img
                src={`${import.meta.env.VITE_BASE_URL}/assets/logo-BG5OLuJH.jpg`}
                width="200"
                height="200"
                alt="React Restaurant"
            />
            <Text className="text-black text-[14px] leading-[24px]">React Restaurant</Text>
            <Text className="text-black text-[14px] leading-[24px]">Thank You for ordering from us:</Text>
            <Text className="text-black text-[14px] leading-[24px]">{name}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{email}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{street}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{city}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{postalCode}</Text>
          </Section>
          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Your Bill from React Restaurant
            </Text>
            {customerOrder.map((item) => (
              <Row key={item.id}>
                <Column>
                  <Text className="text-black text-[14px] leading-[24px]">
                    {item.name}
                  </Text>
                  <Text>{item.description}</Text>
                  <Text>
                    ₹{item.price} x {item.quantity}
                  </Text>
                  <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                </Column>
              </Row>
            ))}
            <Text className="text-black text-[14px] leading-[24px]">Total:- ₹{currencyFormatter.format(cartTotal)}</Text>
          </Section>
        </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
