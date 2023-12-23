from werkzeug.exceptions import HTTPException


class AccessError(HTTPException):
    code = 403
    message = "Forbidden"


class InputError(HTTPException):
    code = 400
    message = "Bad Request"


class AuthError(HTTPException):
    code = 401
    message = "Unauthorized"
