# Order Cancellations

**Document ID:** POL-CAN-001  
**Version:** 2026-01  
**Applies to:** All purchase channels unless the order is governed by a separate contract (B2B bulk).

---

## SEC-CAN-001 — Before Fulfillment

Customers may **cancel free of charge** if the order status is **Placed** or **Processing** and **no shipment label** has been generated. Cancellations are requested through **Order History** or support.

Once a **carrier label** is created, the order is treated as **in fulfillment** and standard cancellation may no longer apply; see SEC-CAN-002.

---

## SEC-CAN-002 — After Label Created but Not Delivered

- **Intercept requests:** We attempt carrier intercept when supported; **success is not guaranteed**. If intercept fails, the customer may **refuse delivery** or use **return** after delivery (subject to return policy).
- **Fees:** Any carrier intercept or return-to-sender fees may be **deducted** from the refund if disclosed at checkout for the shipping method.

---

## SEC-CAN-003 — After Delivery

Cancellation is **not** applicable; use **returns** (POL-RET-001) or **disputes** (POL-DIS-001 / POL-DIS-002).

---

## SEC-CAN-004 — Marketplace Seller Orders

For **marketplace** orders, cancellation before seller shipment follows **seller processing time** shown at checkout. After the seller marks **shipped**, cancellation must go through **return** or **dispute** flows per POL-MKT-001.

---

## SEC-CAN-005 — Pre-Orders and Backorders

Cancellations of pre-orders are allowed **until** the item enters **preparing shipment** status. After that, SEC-CAN-001 and SEC-CAN-002 apply.

---

## SEC-CAN-006 — Payment Holds

If payment is **pending** or **authorization failed**, the order may be auto-cancelled after the timeframe in checkout messaging. Agents must not manually “uncancel” into a shipped state without payment success.

---

## Related Documents

- POL-MKT-001: Marketplace vs First-Party  
- POL-RET-001: Returns — General  
