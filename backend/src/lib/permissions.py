from src.extensions import db
from src.models.role import Permission, Role


def fetch_permission(permission_type: str):
    permission = db.session.execute(
        db.select(Permission).filter_by(name=permission_type)
    ).scalar_one()
    return permission


def init_permission(permission_type: str):
    permission = fetch_permission(permission_type)
    if not permission:
        permission = Permission(name=permission_type)
        db.session.add(permission)
        return permission
    return permission


def query_roles():
    query = db.session.query(Role).options(db.selectinload(Role.permissions))
    results = query.all()

    for role in results:
        print(f"{role.name}")
        for permission in role.permissions:
            print(f"    {permission.name}")


def new_role(role_name: str, course_code: str, permissions: list[str]):
    role = Role(name=role_name, course=course_code, permissions=permissions)
    db.session.add(role)


PERMISSION_MAPPING = {
    "read_access": init_permission("read"),
    "write_access": init_permission("write"),
    "admin_access": init_permission("admin"),
}
