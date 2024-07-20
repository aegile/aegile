import math
import random
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    # model_config = ConfigDict(from_attributes=True)

    first_name: str
    last_name: str
    email: str
    # signup_ts: str


class UserInfo(UserBase):
    id: str
    handle: str
    image: Optional[str] = None


class UserProfile(UserBase):
    handle: str
    image: Optional[str] = None


class UserRegister(UserBase):
    password: str


class UserPrivate(UserBase):
    is_superuser: bool = False
    hashed_password: str


class UserEnrol(BaseModel):
    user_ids: List[str]
