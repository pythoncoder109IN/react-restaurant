import {
  Html,
  Head,
  Heading,
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
                src={`${import.meta.env.VITE_BASE_URL}/src/assets/logo.jpg`}
                width="40"
                height="37"
                alt="React Restaurant"
              />
            <Heading as="h2" className="text-black text-[20px] font-normal text-center p-0 my-[30px] mx-0">
              Thank You for ordering from us: {name}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">{email}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{street}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{city}</Text>
            <Text className="text-black text-[14px] leading-[24px]">{postalCode}</Text>
          </Section>
          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Section className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Heading as="h4" className="text-white">
              Your Bill from React Restaurant
            </Heading>
            {customerOrder.map((item) => (
              <Row key={item.id}>
                <Column>
                  <Heading as="h4" className="text-white">
                    {item.name}
                  </Heading>
                  <Text className="text-white">{item.description}</Text>
                  <Text className="text-white">
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
