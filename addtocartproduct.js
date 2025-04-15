document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 768) return;

  const t922 = document.querySelector('.t922');
  const t744 = document.querySelector('.t744');
  const productCard = t922 || t744;
  if (!productCard) return;

  const isT922 = !!t922;
  const realBtn = document.querySelector(isT922 ? '.t922__btn' : '.t744__btn');

  let attempts = 0;
  const wait = setInterval(() => {
    if (++attempts > 30) return clearInterval(wait);

    const priceVal = document.querySelector('.js-store-prod-price-val');
    const priceCur = document.querySelector('.js-product-price-currency');
    const productName = document.querySelector('.js-product-name')?.textContent?.trim();
    const productSKU = document.querySelector('.js-product-sku');

    const allOptions = [...document.querySelectorAll('.js-product-edition-option')];

    if (!priceVal || !priceCur || !realBtn || !productName || !productSKU || allOptions.length === 0) return;

    clearInterval(wait);

    const updateSkuAndPrice = () => {
      dynamicPrice.textContent = `${priceVal.textContent.trim()} ${priceCur.textContent.trim()}`;
      skuEl.textContent = `Артикул: ${productSKU.textContent.trim()}`;
    };

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

    contentWrap.append(nameEl, skuEl, dynamicPrice);

    // Обрабатываем каждую группу options
    allOptions.forEach((group) => {
      const label = group.querySelector('.js-product-edition-option-name')?.textContent?.trim();
      const select = group.querySelector('select');

      if (!label || !select) return;

      const weightWrap = document.createElement('div');
      weightWrap.innerHTML = `<div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${label}</div>`;

      const optionsBox = document.createElement('div');
      optionsBox.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px;';

      [...select.options].forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt.textContent;
        btn.setAttribute('tabindex', '0');
        btn.style.cssText = `
          padding: 8px 14px; border-radius: 50px; border: 1px solid #ccc;
          background: ${idx === select.selectedIndex ? '#15b125' : '#f7f7f7'};
          color: ${idx === select.selectedIndex ? 'white' : 'black'};
          font-weight: 500; cursor: pointer;
        `;

        btn.addEventListener('click', () => {
          select.selectedIndex = idx;
          select.dispatchEvent(new Event('change', { bubbles: true }));

          [...optionsBox.children].forEach((b, i) => {
            b.style.background = i === idx ? '#15b125' : '#f7f7f7';
            b.style.color = i === idx ? 'white' : 'black';
          });

          updateSkuAndPrice();
        });

        optionsBox.appendChild(btn);
      });

      weightWrap.appendChild(optionsBox);
      contentWrap.appendChild(weightWrap);

      // Синхронизация при смене значения в основном select
      select.addEventListener('change', () => {
        const idx = select.selectedIndex;
        [...optionsBox.children].forEach((b, i) => {
          b.style.background = i === idx ? '#15b125' : '#f7f7f7';
          b.style.color = i === idx ? 'white' : 'black';
        });
        updateSkuAndPrice();
      });
    });

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

    modalContent.append(contentWrap, confirm);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    triggerBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

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
