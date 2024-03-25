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
    first_name: str = "Alex"
    last_name: str = "Xu"
    email: str = "alex@email.com"
    password: str = "AlexXu123!"
