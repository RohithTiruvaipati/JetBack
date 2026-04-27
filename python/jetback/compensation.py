from dataclasses import dataclass


@dataclass(frozen=True)
class FlightClassification:
    """
    Placeholder classification for MVP.
    Real rules depend on DOT / carrier policy; this keeps the prototype deterministic.
    """

    carrier_caused: bool
    delayed_minutes: int
    cancelled: bool = False


def eligible_compensation_message(cls: FlightClassification) -> str:
    if cls.cancelled:
        return "Eligible for refund and rebooking assistance (prototype)."
    if not cls.carrier_caused:
        return "Compensation may be limited for weather/ATC delays (prototype)."
    if cls.delayed_minutes >= 180:
        return "Eligible for hotel/meal voucher consideration (prototype)."
    if cls.delayed_minutes >= 60:
        return "Eligible for meal voucher consideration (prototype)."
    return "Delay below compensation threshold (prototype)."

