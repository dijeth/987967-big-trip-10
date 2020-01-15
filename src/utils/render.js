const RenderPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

const renderElement = (container, position, ...elements) => {
  switch (position) {
    case RenderPosition.BEFORE_BEGIN:
      container.before(...elements);
      break;

    case RenderPosition.AFTER_BEGIN:
      container.prepend(...elements);
      break;

    case RenderPosition.BEFORE_END:
      container.append(...elements);
      break;

    case RenderPosition.AFTER_END:
      container.after(...elements);
      break;
  }
};

const renderComponent = (container, position, ...components) => {
  const elements = components.map((it) => it.getElement());

  renderElement(container, position, ...elements);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const replaceComponent = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  parentElement.replaceChild(newComponent.getElement(), oldComponent.getElement());
};

const removeComponent = (component) => {
  if (!component) {
    return;
  }

  component.getElement().remove();
  component.removeElement();
};

const showErrorMessage = (message, container) => {
  let messageElement = container.querySelector(`.error-message`);

  if (!message) {
    if (messageElement) {
      messageElement.remove();
    }
    return;
  }

  if (!messageElement) {
    messageElement = createElement(`<div class="error-message">${message}</div>`);
    renderElement(container, RenderPosition.BEFORE_END, messageElement);
  } else {
    messageElement.textContent = message;
  }
};


export {
  RenderPosition,
  renderComponent,
  createElement,
  replaceComponent,
  removeComponent,
  renderElement,
  showErrorMessage
};
