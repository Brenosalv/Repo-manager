# Repo Manager
This API performs a CRUD (Create, Read, Update, Delete) of project repositories.

### Requirements
- Must be possible to create a new repo
- Must be possible to list all repos
- Must be possible to update an existent repo details
- Must be possible to like a repo
- Must be possible to delete a repo

### Repo structure
{
  id: uuid(),
  title,
  url,
  techs,
  likes: 0
}
