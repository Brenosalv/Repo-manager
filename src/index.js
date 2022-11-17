const express = require("express");
const cors = require("cors");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validatesRepositoryId = (request, response, next) => {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(404).json({ error: "Repository id is not valid." });
  }

  return next();
}

const checksLikesUpdate = (request, response, next) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const oldRepository = repositories.find(repository => repository.id === id);

  if (updatedRepository.likes && (updatedRepository.likes !== oldRepository.likes)) {
    return response.status(400).json({ likes: oldRepository.likes });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validatesRepositoryId, checksLikesUpdate, (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validatesRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validatesRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = repositories[repositoryIndex].likes + 1;

  repositories[repositoryIndex].likes = likes;

  return response.status(201).json({ likes });
});

module.exports = app;
