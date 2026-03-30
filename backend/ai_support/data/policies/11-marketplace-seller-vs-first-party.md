# Marketplace (Seller) vs First-Party Fulfillment

**Document ID:** POL-MKT-001  
**Version:** 2026-01  
**Applies to:** All orders; **fulfillment_type** in order context determines primary handler.

---

## SEC-MKT-001 — Definitions

- **First-party (1P):** Sold and fulfilled by PurpleCart or designated **retail** fulfillment centers.  
- **Marketplace (3P):** Sold by **third-party seller**; may be **Fulfilled by Platform (FBP)** or **seller-shipped**.

Order UI and API must show **fulfillment_type** and **seller name** where applicable.

---

## SEC-MKT-002 — Returns and Refunds

- **1P:** Standard return and dispute policies (POL-RET-*, POL-DIS-*) apply.  
- **3P seller-shipped:** Seller’s **return window** and **restocking** rules apply if **stricter** than ours; our **minimum** protections apply where **we** guarantee the sale (see program terms).  
- **3P FBP:** Platform **returns hub** may apply; refunds may be **pending seller response** for **48 hours** unless **SLA breach**.

---

## SEC-MKT-003 — Disputes and A-to-z Protection

If a **seller** does not resolve a **valid** dispute within **48 hours**:

- Customer may request **platform decision** when **order value** and **evidence** meet **program thresholds** (documented internally).  
- **Do not** guarantee approval; state that claims are **reviewed** against policy and evidence.

---

## SEC-MKT-004 — Promotions on Marketplace Items

Coupons marked **“First-party only”** do **not** apply to **3P** lines. Mixed carts split discount **per line eligibility** (POL-PRM-001).

---

## SEC-MKT-005 — Shipping and Tracking

**Seller-shipped** tracking is **seller’s** responsibility. If **invalid tracking** or **no scan** within **carrier SLA**, treat as **non-shipment** path per POL-LOST-001 **after** seller contact attempt.

---

## SEC-MKT-006 — Escalation Between Policies

When **seller policy** conflicts with **1P policy** on the same ticket (e.g., customer bought **both** in one order), resolve **per line item** using **that line’s** fulfillment_type.

---

## Related Documents

- POL-PRM-001: Promotions  
- POL-LOST-001: Lost Packages  
