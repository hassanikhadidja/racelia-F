/** Online payment icons, left to right as shown in checkout. */
export const ONLINE_PAYMENT_METHODS = [
  {
    id: "visa",
    label: "Visa",
    icon: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780593338/4_1_mkifgk.png",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    icon: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780593348/5_1_xehqh0.png",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780593325/3_1_a3lb26.png",
  },
  {
    id: "cib",
    label: "CIB",
    icon: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780593318/2_1_upmphv.png",
  },
  {
    id: "edahabia",
    label: "Edahabia",
    icon: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780593310/1_1_gdfsts.png",
  },
];

export const PAYMENT_METHOD_LABELS = Object.fromEntries(
  ONLINE_PAYMENT_METHODS.map((m) => [m.id, m.label])
);

PAYMENT_METHOD_LABELS.cod = "Cash on delivery";

export const ONLINE_PAYMENT_METHOD_IDS = ONLINE_PAYMENT_METHODS.map((m) => m.id);
