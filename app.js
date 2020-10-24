const items = document.querySelectorAll('.item');

[...items].forEach((item) => {
  // polyfill required for Safari 14
  item.addEventListener('pointerdown', (event) => {
    item.style.left = `${item.getBoundingClientRect().left}px`;
    item.style.top = `${item.getBoundingClientRect().top}px`;

    const clone = item.cloneNode();
    clone.classList.add('clone');

    item.before(clone);

    item.style.pointerEvents = 'none';

    item.classList.add('dragging');
    document.body.append(item);
    item.setPointerCapture(event.pointerId);

    const up = (event) => {
      clone.after(item);
      clone.remove();
      item.style.left = '';
      item.style.top = '';
      item.classList.remove('dragging');

      item.removeEventListener('pointerup', up);
      item.removeEventListener('pointermove', move);
      item.style.pointerEvents = '';

      item.releasePointerCapture(event.pointerId);
    };

    const move = (event) => {
      // Chrome only for now
      // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
      item.style.left = `${parseFloat(item.style.left) + event.movementX}px`;
      item.style.top = `${parseFloat(item.style.top) + event.movementY}px`;

      const hitTest = document.elementFromPoint(
        parseFloat(item.style.left),
        parseFloat(item.style.top)
      );

      const dropzone = hitTest.closest('[data-dropzone]');
      if (!dropzone) {
        return;
      }

      if (clone.closest('[data-dropzone]') !== dropzone) {
        dropzone.append(clone);
        return;
      }

      const dropzoneChildren = [...dropzone.children];

      const cloneIndex = dropzoneChildren.findIndex((c) => c === clone);
      dropzoneChildren.forEach((child, index) => {
        if (hitTest === clone) {
          return;
        }

        if (hitTest === child) {
          if (cloneIndex < index) {
            child.after(clone);
            return;
          } else {
            child.before(clone);
          }
        }
      });
    };

    item.addEventListener('pointerup', up);
    console.log('here');
    item.addEventListener('pointermove', move);
  });
});
