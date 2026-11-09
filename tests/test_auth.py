def test_post_without_csrf_token_is_rejected(client):
    response = client.post("/api/login", json={"username": "a", "password": "b"})
    assert response.status_code == 403


def test_register_login_and_logout(api):
    assert api.post("/api/register", {"username": "rafiq", "password": "password123"}).status_code == 201
    assert api.get("/api/me").status_code == 401

    response = api.post("/api/login", {"username": "rafiq", "password": "password123"})
    assert response.status_code == 200
    assert response.get_json()["user"]["username"] == "rafiq"
    assert api.get("/api/me").status_code == 200

    assert api.post("/api/logout").status_code == 200
    assert api.get("/api/me").status_code == 401


def test_register_rejects_short_values_and_duplicates(api):
    assert api.post("/api/register", {"username": "ab", "password": "password123"}).status_code == 400
    assert api.post("/api/register", {"username": "rafiq", "password": "short"}).status_code == 400
    api.post("/api/register", {"username": "rafiq", "password": "password123"})
    assert api.post("/api/register", {"username": "rafiq", "password": "password123"}).status_code == 409


def test_wrong_password(api):
    api.post("/api/register", {"username": "rafiq", "password": "password123"})
    response = api.post("/api/login", {"username": "rafiq", "password": "wrong-password"})
    assert response.status_code == 401


def test_admin_pages_need_an_admin(api):
    api.sign_up()
    assert api.get("/api/admin/users").status_code == 403
    assert api.get("/api/admin/sync-status").status_code == 403


def test_admin_can_list_users(api):
    api.sign_up(admin=True)
    response = api.get("/api/admin/users")
    assert response.status_code == 200
    assert response.get_json()["users"][0]["username"] == "rafiq"
