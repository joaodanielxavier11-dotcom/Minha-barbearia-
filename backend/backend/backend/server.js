import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "SEU_TOKEN_DO_TELEGRAM";
const CHAT_ID = "SEU_CHAT_ID";

const DB = "./db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB));
}

function saveDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// Listar horários
app.get("/horarios", (req, res) => {
  const db = readDB();
  res.json(db.horarios);
});

// Agendar
app.post("/agendar", async (req, res) => {
  const { nome, telefone, data, horario } = req.body;
  const db = readDB();

  db.agendamentos.push({ nome, telefone, data, horario });
  saveDB(db);

  const msg = `💈 Novo agendamento\n\nNome: ${nome}\nTelefone: ${telefone}\nData: ${data}\nHorário: ${horario}`;

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
  });

  res.json({ ok: true });
});

// ADMIN - login simples
app.post("/admin/login", (req, res) => {
  if (req.body.senha === "admin123") {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
});

// ADMIN - alterar horários
app.post("/admin/horarios", (req, res) => {
  const db = readDB();
  db.horarios = req.body.horarios;
  saveDB(db);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor rodando"));
