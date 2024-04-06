from uuid import uuid4
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy import String, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base


userset_association = Table(
    "userset_association",
    Base.metadata,
    Column("userset_id", ForeignKey("usersets.id")),
    Column("user_id", ForeignKey("users.id")),
)


class User(Base):
    """User object class

    Args:
        id int: the user_id
        first_name str: the user's first name
        last_name str: the user's last name
        email str: the user's email
        hashed_password str: the user's hashed password
        handle str: the user's handle
        is_superuser bool: whether the user is a superuser
        image str: the user's profile image
        last_login str: the user's last login


    Returns:
        _type_: _description_
    """

    __tablename__ = "users"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "usr_" + str(uuid4().hex[:16]),
        index=True,
    )
    first_name: Mapped[str]
    last_name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str]
    handle: Mapped[str] = mapped_column(unique=True, default="")
    is_superuser: Mapped[bool] = mapped_column(default=False)
    image: Mapped[Optional[str]]
    last_login: Mapped[Optional[str]]

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.first_name!r} {self.last_name!r} handle={self.handle!r})"


class UserSet(Base):
    """UserSet object class

    Args:
        Base (_type_): _description_

    Returns:
        _type_: _description_
    """

    __tablename__ = "usersets"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "ust_" + str(uuid4().hex[:16]),
        index=True,
    )
    members: Mapped[List[User]] = relationship(
        secondary=userset_association, lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"UserSet(id={self.id!r})"


class UserSetManager:
    def __init__(self):
        self.userset: UserSet = None
        self.parent = None  # either a Course or a subclass of UserSetManager

    @property
    def member_count(self) -> int:
        return len(self.userset.members)

    @property
    def members(self) -> List[User]:
        # NOTE: compatability method between Course and UserSetManager subclasses
        return self.userset.members

    def verify_user_existing_enrolment(self, user: User) -> None:
        if user in self.userset.members:
            raise HTTPException(
                status_code=400,
                detail=f"User {user.handle} is already a member.",
            )

    def verify_user_parent_enrolment(self, user: User) -> None:
        print("CALLING")
        if self.parent and user not in self.parent.members:
            raise HTTPException(
                status_code=403,
                detail=f"User {user.handle} is not enrolled in parent {self.parent.__class__.__name__.lower()}",
            )

    def verify_userlist_parent_enrolment(self, users: List[User]) -> None:
        if self.parent and set(users) - set(self.parent.members):
            raise HTTPException(
                status_code=403,
                detail=f"Some or all users are not enrolled in parent {self.parent.__class__.__name__.lower()}",
            )

    def verify_userlist_existing_enrolment(self, users: List[User]) -> None:
        # intersection of existing and pending members is non-zero
        if len(set(self.userset.members) & set(users)) > 0:
            raise HTTPException(
                status_code=400,
                detail="Some or all users are already members.",
            )

    def member_add_one(self, user: User) -> None:
        self.verify_user_parent_enrolment(user)
        self.verify_user_existing_enrolment(user)
        self.userset.members.append(user)

    def member_add_many(self, users: List[User]) -> None:
        self.verify_userlist_parent_enrolment(users)
        self.verify_userlist_existing_enrolment(users)
        self.userset.members.extend(users)

    def member_remove_one(self, user: User) -> None:
        try:
            self.userset.members.remove(user)
        except ValueError:
            pass

    def member_remove_many(self, users: List[User]) -> None:
        self.userset.members = list(set(self.userset.members) - set(users))
