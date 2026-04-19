from fastapi import APIRouter

from .schemas import SupportRequest
from .agents import run_support_pipeline

router = APIRouter(
    prefix="/support",
    tags=["Support"]
)


@router.post("/resolve")
async def resolve_ticket(data: SupportRequest):
    order_context = {
        "order_date": "2026-03-20",
        "delivery_date": "2026-03-25",
        "item_category": "electronics",
        "fulfillment_type": "marketplace",
        "shipping_region": "India",
        "order_status": "delivered"
    }

    result = run_support_pipeline(
        ticket=data.ticket,
        order_context=order_context
    )

    return result