# Routes


## Users

`GET /api/v1/u`
- List all active users.

`GET /api/v1/u/<user_id>`
- Retrieve a user profile details.

`POST /api/v1/u`
- Create a new user

`PUT /api/v1/u/<user_id>`
- Update a user profile details. 

`DELETE /api/v1/u/<user_id>`
- Delete a user


## Course Management


Courses
-------
Upon creation →
- [ ] Must have a creator
- [ ] Must have a name
- [ ] Must have a code
- [ ] Users are optional
- [ ] Creates a UserCourseStatus for all enrolled users


`POST v1/courses`
- create a course given the course `term`, `name`, course `code` and an optional description.
- **course term and code must be a unique pairing**
- the current auth user becomes the creator of the course
    - they are automatically enrolled
- default roles will be created for the course

`POST v1/courses/<string:course_code>/enroll`
- given a list of handles for **EXISTING** users, enroll them in the course.
- each enrolment creates a `UserCourseStatus` object tied to the user

`POST v1/courses/<string:course_code>/invite`
- Given a list of emails for **NON-EXISTENT** users, create inactive User, send email invite and enroll inactive User to the course
- each enrolment creates a `UserCourseStatus` object tied to the user


`PUT v1/courses/<string:course_code>`
- given the course `term`, `name`, course `code` and an optional description, edit these values accordingly.
- all `ForeignKeys` must be set to `ondelete='CASCADE'` and `onupdate='CASCADE'` 


`DELETE v1/courses/<string:course_code>/kick`
- given a list of handles for **EXISTING** users, kick them from the course.
- the kicked user's `UserCourseStatus` object is removed
- this means `course.members` should derive from `UserCourseStatus`



`GET v1/courses`
- fetches all courses the current auth user is a member of.
- will return a list of simple details like:
    - course term
    - course code
    - course name
    - number of members
    - other...

`GET v1/courses/<string:course_code>`
- fetches the specified course if the current auth user is a member of it.
- will return a list of simple details like:
    - course code
    - course name
    - whatever is meant to be on the home page.
    - other...
    
`GET v1/courses/<string:course_code>/members`
- fetches the specified course members if the current auth user is a member of it.
- returns the **full list of members** with their name, handle (zID), class and role.

`DELETE v1/courses/<string:course_code>`
- deletes the specified course if the current auth user is the creator or has the required permission.
- all ForeignKeys should cascade delete.

Roles
-------
Upon creation → 
- [ ] Must check that creator of role is either a course creator or has can_manage_role permission
- [ ] Name and color are optional

`POST v1/roles/course/<string:course_id>`
- check current auth user has permission to create role or is a course creator
- create a role given the role `name`

`PUT v1/roles/<string:role_id>`
- check current auth user has permission to edit role or is a course creator
- given the role `name` and `color`, edit these values accordingly.
- permissions will be updated here as well.
    - frontend will track which permissions are toggled, and send only a list of permission names to backend
    - backend will simply check if permission is enabled or not, and then flip the bit using XOR.

`PUT v1/roles/<string:role_id>/user/<string:user_id>/<string:state>`
- check current auth user has permission to edit role or is a course creator
- given a list of user handles, assign or unassign the role to the `UserCourseStatus` of the user for that course.
    - The course id can be found in the `Role` object.   

`GET v1/roles/<string:role_id>`
- check current auth user has permission to fetch role or is a course creator
- returns the details of a specific role, including its name, color, enabled permissions and assigned members.

`GET v1/roles/course/<string:course_id>`
- check current auth user has permission to fetch roles or is a course creator
- returns the simple status of all the roles within a course, such as name, color and member count.

`DELETE v1/roles/<string:role_id>`
- check current auth user has permission to delete role or is a course creator.
- deletes a specific role. 
- the user_course_statuses ForeignKey should be set to null on delete.
- all other ForeignKeys should cascade delete.

## Tutorial Management

`GET /api/v1/c/<course_id>/tut`
-  Retrieve a list of tutorials for a specific course.

`GET /api/v1/tut/<tut_id>`
-  Retrieve details of a specific tutorial.

`POST /api/v1/c/<course_id>/tut`
-  Create a new tutorial for a course.

`PUT /api/v1/tut/<tut_id>`
-  Update information about a tutorial.

`DELETE /api/v1/tut/<tut_id>`
-  Delete a tutorial.


## Group Management

`GET /api/v1/tut/<tut_id>/g`
-  Retrieve a list of groups for a tutorial.

`GET /api/v1/g/<group_id>`
-  Retrieve details of a specific group.

`POST /api/v1/tut/<tut_id>/g`
-  Create a new group for a tutorial.

`PUT /api/v1/g/<group_id>`
-  Update information about a group.

`DELETE /api/v1/g/<group_id>`
-  Delete a group.

## Project Management
`GET /api/v1/g/<group_id>/p`
-  Retrieve a list of projects for a group.


`GET /api/v1/p/<project_id>`
-  Retrieve details of a specific project.


`POST /api/v1/g/<group_id>/p`
-  Create a new project for a group.


`PUT /api/v1/p/<project_id>`
-  Update information about a project.


`DELETE /api/v1/p/<project_id>`
-  Delete a project.


## Tasks
`GET /api/v1/p/<project_id>/t`
- Retrieve a list of tasks for a project.

`GET /api/v1/p/<project_id>/t/<task_id>`
- Retrieve a specific task from a project.

`POST /api/v1/p/<project_id>/t`
- Create a new task for a project.

`PUT /api/v1/t/<task_id>`
-  Update information about a task.

`DELETE /api/v1/t/<task_id>`
-  Delete a task.

<!-- `GET /api/v1/t/<task_id>/comments`
-  -->

