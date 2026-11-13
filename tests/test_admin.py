from src.database import get_db


def user_id(username):
    with get_db() as connection:
        return connection.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()["id"]


def test_admin_can_promote_and_demote(api, client):
    other = type(api)(client.application.test_client())
    other.sign_up("nadia")
    api.sign_up(admin=True)
    nadia = user_id("nadia")

    assert api.post(f"/api/admin/users/{nadia}/admin", {"is_admin": True}).get_json()["is_admin"] is True
    assert other.get("/api/admin/users").status_code == 200

    api.post(f"/api/admin/users/{nadia}/admin", {"is_admin": False})
    # Her session still says admin, but access is checked against the database.
    assert other.get("/api/admin/users").status_code == 403


def test_admin_cannot_remove_own_access(api):
    api.sign_up(admin=True)
    response = api.post(f"/api/admin/users/{user_id('rafiq')}/admin", {"is_admin": False})
    assert response.status_code == 400
    assert api.get("/api/admin/users").status_code == 200


def test_unknown_user(api):
    api.sign_up(admin=True)
    assert api.post("/api/admin/users/999/admin", {"is_admin": True}).status_code == 404


def test_contact_messages_list_and_delete(api):
    api.post("/api/contact", {"name": "Karim", "email": "karim@example.com",
                              "subject": "Help", "message": "How do I file a GD?"})
    api.sign_up(admin=True)
    messages = api.get("/api/admin/messages").get_json()["messages"]
    assert [m["name"] for m in messages] == ["Karim"]

    assert api.post(f"/api/admin/messages/{messages[0]['id']}/delete").status_code == 200
    assert api.get("/api/admin/messages").get_json()["messages"] == []
    assert api.post(f"/api/admin/messages/{messages[0]['id']}/delete").status_code == 404


def test_non_admin_cannot_touch_admin_routes(api):
    api.sign_up()
    assert api.get("/api/admin/messages").status_code == 403
    assert api.post("/api/admin/users/1/admin", {"is_admin": True}).status_code == 403
    assert api.post("/api/admin/messages/1/delete").status_code == 403


def test_listed_username_registers_as_admin(api, monkeypatch):
    monkeypatch.setenv("ADMIN_USERNAMES", "someone, Rafiq")
    api.sign_up()
    assert api.get("/api/admin/users").status_code == 200
