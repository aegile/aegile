from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy import Table, Column, ForeignKey
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

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
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

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    members: Mapped[List[User]] = relationship(secondary=userset_association)

    @property
    def member_count(self) -> int:
        return len(self.members)

    def member_add_one(self, user: User) -> None:
        if user in self.members:
            raise HTTPException(
                status_code=400,
                detail=f"User {user.handle} is already in this UserSet.",
            )
        self.members.append(user)

    def member_add_many(self, users: List[User]) -> None:
        if len(set(self.members) & set(users)) > 0:
            raise HTTPException(
                status_code=400,
                detail="Users are already in this UserSet.",
            )
        self.members.extend(users)

    def member_remove_one(self, user: User) -> None:
        try:
            self.members.remove(user)
        except ValueError:
            pass

    def member_remove_many(self, users: List[User]) -> None:
        self.members = list(set(self.members) - set(users))

    def __repr__(self) -> str:
        return f"UserSet(id={self.id!r})"
