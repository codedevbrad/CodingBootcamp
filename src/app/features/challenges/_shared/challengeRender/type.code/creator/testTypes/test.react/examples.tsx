
const conditionalCheck = {
  tests: [
    {
      props: { show: true },
      validations: {
        tags: [{ tag: "p", expectedToPass: true }],
        includesText: [{ text: "You can see me!", expectedToPass: true }],
      },
    },
    {
      props: { show: false },
      validations: {
        tags: [{ tag: "p", expectedToPass: false }],
        includesText: [{ text: "You can see me!", expectedToPass: false }],
      },
    },
  ],
  validations: {
    props: [{ name: "show", type: "boolean" }],
  },
};

export const templates = [
  { label: "Conditional Rendering Check", value: "conditionalCheck", json: conditionalCheck },
];
