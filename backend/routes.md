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

`GET /api/v1/c`
-  Retrieve a list of courses.

`GET /api/v1/c/<course_id>`
-  Retrieve details of a specific course.

`POST /api/v1/c`
-  Create a new course.

`PUT /api/v1/c/<course_id>`
- Update information about a course.

`DELETE /api/v1/c/<course_id>`
-  Delete a course.

`POST /api/v1/c/<course_id>/enroll`
- Given a list of **NON-EXISTENT** user details, create the users and enrol them in the course.

`PUT /api/v1/c/<course_id>/enroll`
- Enrol **EXISTING** users to the course.

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

