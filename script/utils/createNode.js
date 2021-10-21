export const createElement = (tag, attributes, content) => {
  const createdElement = document.createElement(tag);

  Object.keys(attributes).forEach((attributeKey) => {
    createdElement.setAttribute(attributeKey, attributes[attributeKey]);
  });

  if (content) {
    createElement.innerHTML = content;
  }

  return createdElement;
};
