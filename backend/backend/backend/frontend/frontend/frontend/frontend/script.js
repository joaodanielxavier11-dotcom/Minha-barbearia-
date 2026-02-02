fetch("http://localhost:3000/horarios")
  .then(r=>r.json())
  .then(h=>{
    horarios.innerHTML = h.map(x=>`<option>${x}</option>`).join("");
  });

function agendar(){
  fetch("http://localhost:3000/agendar",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      nome: nome.value,
      telefone: telefone.value,
      data: data.value,
      horario: horarios.value
    })
  }).then(()=>alert("Agendado com sucesso"));
}
