def handle_user_registration_event(user: User):
    pass


def handle_user_login_event(user: User):
    pass


def handle_password_reset_event(user: User):
    pass


def init_email_event_handlers():
    subscribe("user_registration", handle_user_registration_event)
    subscribe("user_login", handle_user_login_event)
