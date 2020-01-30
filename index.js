const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let numeroDeRequisicoes = 0;

function verificaExistenciaProjeto(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project)
    return res.status(400).json({ error: `Projeto nao encontrado` });
  return next();
}

function logRequests(req, res, next) {
  numeroDeRequisicoes++;

  console.log(`Número de requisições: ${numeroDeRequisicoes}`);

  return next();
}

server.use(logRequests);

server.post("/project", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get("/project", verificaExistenciaProjeto, (req, res) => {
  return res.json(projects);
});

server.put("/project/:id", verificaExistenciaProjeto, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);
});

server.delete("/project/:id", verificaExistenciaProjeto, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.json(projects);
});

server.post("/project/:id/tasks", verificaExistenciaProjeto, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(projects);
});

console.log("Servidor rodando na porta 3000...");

server.listen(3000);
