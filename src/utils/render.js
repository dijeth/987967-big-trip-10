export const RenderElementPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

export const renderComponent = (container, position, ...components) => {
  const elements = components.map((it) => it.getElement());

  switch (position) {
    case RenderElementPosition.BEFORE_BEGIN:
      container.before(...elements);
      break;

    case RenderElementPosition.AFTER_BEGIN:
      container.prepend(...elements);
      break;

    case RenderElementPosition.BEFORE_END:
      container.append(...elements);
      break;

    case RenderElementPosition.AFTER_END:
      container.after(...elements);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const replaceComponent = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  parentElement.replaceChild(newComponent.getElement(), oldComponent.getElement());
};

export const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};
