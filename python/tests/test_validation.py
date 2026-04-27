from jetback.validation import validate_username, validate_password, sha256_hex


def test_username_valid():
    ok, err = validate_username("JoeJoe12")
    assert ok is True
    assert err is None


def test_username_too_short():
    ok, err = validate_username("Joe")
    assert ok is False
    assert "4-16" in (err or "")


def test_username_special_chars():
    ok, err = validate_username("Joe!Joe")
    assert ok is False
    assert "special" in (err or "").lower()


def test_password_rules():
    ok, _ = validate_password("Password1!")
    assert ok is True

    ok, err = validate_password("Pass")
    assert ok is False
    assert "8" in (err or "")

    ok, err = validate_password("Password")
    assert ok is False
    assert "special" in (err or "").lower()


def test_sha256_hex():
    h = sha256_hex("Password1!")
    assert isinstance(h, str)
    assert len(h) == 64

