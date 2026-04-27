import re
import hashlib


_USERNAME_RE = re.compile(r"^[A-Za-z0-9]{4,16}$")
_SPECIAL_RE = re.compile(r"[^A-Za-z0-9]")


def validate_username(username: str) -> tuple[bool, str | None]:
    """
    Matches SE doc:
    - 4-16 chars
    - no special characters (alphanumeric only)
    """
    if not (4 <= len(username) <= 16):
        return False, "username must be 4-16 characters long"
    if _SPECIAL_RE.search(username):
        return False, "username may not contain any special characters"
    if not _USERNAME_RE.match(username):
        return False, "username may only contain letters and numbers"
    return True, None


def validate_password(password: str) -> tuple[bool, str | None]:
    """
    Matches SE doc:
    - minimum 8 chars
    - requires at least 1 special character
    """
    if len(password) < 8:
        return False, "password must be 8 characters long"
    if re.search(r"[^A-Za-z0-9]", password) is None:
        return False, "password must contain a special character"
    return True, None


def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

