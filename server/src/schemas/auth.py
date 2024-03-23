from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    permissions: str = "user"


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
