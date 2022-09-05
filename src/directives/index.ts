import type { App, DirectiveBinding } from 'vue';

export function setupGlobalDirective(app: App) {
  //  元素旋转
  app.directive('rotate', (el, binding: DirectiveBinding<boolean>) => {
    el.style.transition = 'all ease-in-out 0.3s';
    if (binding.value === false) {
      el.style.transform = 'rotate(0deg)';
    } else if (binding.value === true) {
      el.style.transform = `rotate(${binding.arg}deg)`;
    }
    el = null;
  });

  //  元素旋转 X轴
  app.directive('rotateX', (el, binding: DirectiveBinding<boolean>) => {
    el.style.transition = 'all ease-in-out 0.3s';
    if (binding.value === false) {
      el.style.transform = 'rotateX(0deg)';
    } else if (binding.value === true) {
      el.style.transform = `rotateX(${binding.arg}deg)`;
    }
    el = null;
  });

  //  元素旋转 Y轴
  app.directive('rotateY', (el, binding: DirectiveBinding<boolean>) => {
    el.style.transition = 'all ease-in-out 0.3s';
    if (binding.value === false) {
      el.style.transform = 'rotateY(0deg)';
    } else if (binding.value === true) {
      el.style.transform = `rotateY(${binding.arg}deg)`;
    }
    el = null;
  });

  /**
   * 快元素高度折叠
   *  binding.arg [折叠后高度,展开后补充高度]
   */
  app.directive('collapseH', (el, binding: DirectiveBinding<boolean>) => {
    el.style.transition = 'all ease-in-out 0.3s';
    el.style.willChange = 'height';
    let closeH = 0;
    let openOffSetH = 0;
    if (Array.isArray(binding.arg) && binding.arg.length === 2) {
      closeH = binding.arg[0];
      openOffSetH = binding.arg[1];
    } else {
      el = null;
      return;
    }
    if (binding.value === false) {
      el.style.height = `${closeH}px`;
    } else if (binding.value === true) {
      el.style.height = el.scrollHeight + openOffSetH + 'px';
    }
    el = null;
  });

  /**
   * 快元素宽度折叠
   *  binding.arg [折叠后宽度,展开后补充宽度]
   */
  app.directive('collapseW', (el, binding: DirectiveBinding<boolean>) => {
    el.style.transition = 'all ease-in-out 0.3s';
    el.style.willChange = 'width';
    let closeW = 0;
    let openW = 0;
    let openOffSetW = 0;
    if (Array.isArray(binding.arg) && binding.arg.length === 3) {
      closeW = binding.arg[0];
      openW = binding.arg[1];
      openOffSetW = binding.arg[2];
    } else {
      el = null;
      return;
    }
    if (binding.value === false) {
      el.style.width = `${closeW}px`;
    } else if (binding.value === true) {
      el.style.width = openW + openOffSetW + 'px';
    }
    el = null;
  });
}
