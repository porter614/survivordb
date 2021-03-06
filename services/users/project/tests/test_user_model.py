# services/users/project/tests/test_user_model.py


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("justatest", "test@test.com", "greaterthaneight")
    user_two = add_user("justatest2", "test@test2.com", "greaterthaneight")
    assert user_one.password != user_two.password


def test_encode_token(test_app, test_database, add_user):
    user = add_user("justatest", "test@test.com", "test")
    token = user.encode_token(user.id, "access")  # updated
    assert isinstance(token, bytes)
    token = user.encode_token(user.id, "refresh")  # updated
    assert isinstance(token, bytes)
