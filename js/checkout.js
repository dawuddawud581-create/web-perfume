/* =========================================================================
   NAC PERFUME — CHECKOUT LOGIC
   ========================================================================= */

function renderOrderReview() {
  const items = NACCart.getAll();
  document.getElementById('orderReviewItems').innerHTML = items.map(i =>
    `<div class="order-review-item"><span>${i.name} (${i.volume}ml) x${i.qty}</span><strong>${NAC_DATA.formatIDR(i.price * i.qty)}</strong></div>`
  ).join('');
}

function currentShippingCost() {
  const checked = document.querySelector('input[name="courier"]:checked');
  return checked ? Number(checked.dataset.cost) : 0;
}

function currentDiscount(subtotal) {
  const voucherCode = NACStore.get('nac_voucher', '');
  const VOUCHERS = { NAC10: { type: 'percent', value: 10 }, NACWELCOME: { type: 'percent', value: 15, max: 300000 }, FREESHIP: { type: 'freeship' } };
  if (voucherCode && VOUCHERS[voucherCode]) {
    const v = VOUCHERS[voucherCode];
    if (v.type === 'percent') return Math.min(subtotal * (v.value / 100), v.max || Infinity);
  }
  return 0;
}

function isFreeShipVoucher() {
  const voucherCode = NACStore.get('nac_voucher', '');
  return voucherCode === 'FREESHIP';
}

function updateSummary() {
  const subtotal = NACCart.subtotal();
  const discount = currentDiscount(subtotal);
  const shipping = isFreeShipVoucher() ? 0 : currentShippingCost();
  const total = Math.max(0, subtotal - discount + shipping);

  document.getElementById('sumSubtotal').textContent = NAC_DATA.formatIDR(subtotal);
  document.getElementById('sumDiscount').textContent = discount ? '−' + NAC_DATA.formatIDR(discount) : NAC_DATA.formatIDR(0);
  document.getElementById('sumShipping').textContent = NAC_DATA.formatIDR(shipping);
  document.getElementById('sumTotal').textContent = NAC_DATA.formatIDR(total);
  return { subtotal, discount, shipping, total };
}

function bindCourierSelect() {
  document.querySelectorAll('.courier-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.courier-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
      updateSummary();
    });
  });
}

function bindPaymentSelect() {
  document.querySelectorAll('.pay-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
      const val = opt.querySelector('input').value;
      document.getElementById('qrisBox').classList.toggle('show', val === 'qris');
      document.getElementById('bankBox').classList.toggle('show', val === 'bank');
    });
  });
}

async function submitOrder(payload) {
  // Coba kirim ke backend REST API (lihat /backend/routes/orderRoutes.js).
  // Jika backend belum berjalan (mode demo frontend-only), fallback ke mock lokal.
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.orderNumber || mockOrderNumber();
  } catch (err) {
    return mockOrderNumber();
  }
}

function mockOrderNumber() {
  return 'NAC-' + Date.now().toString().slice(-8);
}

function bindFormSubmit() {
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const items = NACCart.getAll();
    if (!items.length) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

    const totals = updateSummary();
    const payload = {
      customer: {
        name: document.getElementById('fName').value,
        phone: document.getElementById('fPhone').value,
        address: document.getElementById('fAddress').value,
        city: document.getElementById('fCity').value,
        province: document.getElementById('fProvince').value,
        postalCode: document.getElementById('fPostal').value
      },
      courier: document.querySelector('input[name="courier"]:checked').value,
      paymentMethod: document.querySelector('input[name="payment"]:checked').value,
      items, totals
    };

    const orderNumber = await submitOrder(payload);

    document.getElementById('orderNumber').textContent = `No. Pesanan: ${orderNumber}`;
    document.getElementById('successModal').classList.add('show');
    NACCart.clear();
    NACStore.set('nac_voucher', '');

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Buat Pesanan <i class="fa-solid fa-lock"></i>';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!NACCart.getAll().length) {
    document.getElementById('checkoutEmptyNotice').classList.remove('hidden');
    document.getElementById('checkoutForm').classList.add('hidden');
    return;
  }
  renderOrderReview();
  updateSummary();
  bindCourierSelect();
  bindPaymentSelect();
  bindFormSubmit();
});