from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, constr


# Define a custom type for role with constraints
class RoleType(str, Enum):
    student = "student"
    tutor = "tutor"
    admin = "admin"


class CourseMembership(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    handle: str
    role: Optional[RoleType] = "student"


class CourseMembershipUpdate(BaseModel):
    role: RoleType
