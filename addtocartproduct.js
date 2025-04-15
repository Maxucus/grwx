document.addEventListener("DOMContentLoaded", function () {

  const productCard = document.querySelector('.t922');
  if (!productCard) return;

  const skuBlock = document.querySelector('.t922__title_small');
  if (skuBlock) skuBlock.style.display = 'none';

  let attempts = 0;
  const wait = setInterval(() => {
    if (++attempts > 20) return clearInterval(wait);

    const priceVal = document.querySelector('.js-store-prod-price-val');
    const priceCur = document.querySelector('.js-product-price-currency');
    const variantSelect = document.querySelector('.js-product-edition-option-variants');
    const productName = document.querySelector('.js-product-name')?.textContent?.trim();
    const productSKU = document.querySelector('.js-product-sku');
    const realBtn = document.querySelector('.t922__btn');

    if (!priceVal || !priceCur || !variantSelect || !realBtn || !productName || !productSKU) return;

    clearInterval(wait);

    // ⛳ Функция обновления цены и артикула
    const updateSkuAndPrice = () => {
      dynamicPrice.textContent = `${priceVal.textContent.trim()} ${priceCur.textContent.trim()}`;
      skuEl.textContent = `Артикул: ${productSKU.textContent.trim()}`;
    };

    // --- Нижняя плашка ---
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; bottom: -100px; left: 0; right: 0; z-index: 9999;
      background: #fff; border-top: 1px solid #eee; padding: 12px 16px;
      display: flex; justify-content: center; align-items: center;
      font-family: Onest, sans-serif; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
      transition: bottom 0.3s ease-in-out; border-radius: 20px 20px 0 0;
    `;

    const triggerBtn = document.createElement('button');
    triggerBtn.innerText = 'Добавить в корзину';
    triggerBtn.style.cssText = `
      background: #15b125; color: white; padding: 14px 16px;
      font-size: 16px; font-weight: 600; border: none; border-radius: 12px;
      cursor: pointer; width: 100%;
    `;

    bar.appendChild(triggerBtn);
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      bar.style.bottom = window.scrollY > 400 ? '0' : '-100px';
    });

    // --- Popup ---
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.5);
      display: none; align-items: flex-end; justify-content: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: #fff; width: 100%; border-radius: 20px 20px 0 0;
      padding: 20px; animation: slideUp 0.3s ease; font-family: Onest, sans-serif;
    `;

    const contentWrap = document.createElement('div');
    contentWrap.style.cssText = 'text-align: left;';

    const nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 6px;';
    nameEl.textContent = productName;

    const skuEl = document.createElement('div');
    skuEl.style.cssText = 'font-size: 14px; color: #777; margin-bottom: 6px;';
    skuEl.textContent = `Артикул: ${productSKU.textContent.trim()}`;

    const dynamicPrice = document.createElement('div');
    dynamicPrice.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 16px;';
    dynamicPrice.textContent = `${priceVal.textContent.trim()} ${priceCur.textContent.trim()}`;

    // --- Выбор (варианта)
    const weightWrap = document.createElement('div');
    weightWrap.innerHTML = `<div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Фасовка</div>`;

    const options = document.createElement('div');
    options.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px;';

    [...variantSelect.options].forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.innerText = opt.textContent;
      btn.setAttribute('tabindex', '0');
      btn.style.cssText = `
        padding: 8px 14px; border-radius: 50px; border: 1px solid #ccc;
        background: ${idx === variantSelect.selectedIndex ? '#15b125' : '#f7f7f7'};
        color: ${idx === variantSelect.selectedIndex ? 'white' : 'black'};
        font-weight: 500; cursor: pointer;
      `;

      btn.addEventListener('click', () => {
        variantSelect.selectedIndex = idx;
        variantSelect.dispatchEvent(new Event('change', { bubbles: true }));

        [...options.children].forEach((b, i) => {
          b.style.background = i === idx ? '#15b125' : '#f7f7f7';
          b.style.color = i === idx ? 'white' : 'black';
        });

        updateSkuAndPrice();
      });

      options.appendChild(btn);
    });

    weightWrap.appendChild(options);

    // --- Кнопка подтверждения
    const confirm = document.createElement('button');
    confirm.innerText = 'Добавить';
    confirm.style.cssText = `
      margin-top: 20px; width: 100%; background: #15b125; color: white;
      padding: 14px; border-radius: 10px; font-size: 16px; font-weight: 600;
      border: none; cursor: pointer;
    `;
    confirm.addEventListener('click', () => {
      realBtn.click();
      modal.style.display = 'none';
    });

    contentWrap.append(nameEl, skuEl, dynamicPrice);
    modalContent.append(contentWrap, weightWrap, confirm);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // --- Показываем popup
    triggerBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    // --- Закрытие popup по клику вне области
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // --- Обновление popup при изменении основного select
    variantSelect.addEventListener('change', () => {
      const currentIdx = variantSelect.selectedIndex;

      [...options.children].forEach((btn, i) => {
        btn.style.background = i === currentIdx ? '#15b125' : '#f7f7f7';
        btn.style.color = i === currentIdx ? 'white' : 'black';
      });

      updateSkuAndPrice();
    });

    // --- Анимация
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, 300);
});
