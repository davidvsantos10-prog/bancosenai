const URL_API = 'https://localhost:7081/api/v1/Documento';

async function enviarDocumento() {
    const codigoCliente = document.getElementById("codigoCliente").value;
    const inputArquivo = document.getElementById("arquivo");
    const arquivo = inputArquivo.files[0];

    if (!codigoCliente || !arquivo) {
        alert("Informe o codigo do cliente e selecione um arquivo");
        return;
    }

    const dadosArquivos = new FormData();
    dadosArquivos.append("arquivo", arquivo);

    const responde = await fetch(`${URL_API}/upload/${codigoCliente}`, {
        method: "POST",
        body: dadosArquivos
    });

    if (responde.ok) {
        alert("Documento enviado com sucesso!");
        document.getElementById("codigoCliente").value = "";
        document.getElementById("arquivo").value = "";

    } else {
        alert("Erro. Falha ao enviar o documento")
    }
}
async function buscarDocumentos(codigoParam = null) {
    const codigoCliente = codigoParam || document.getElementById("buscaCodigoCliente").value;

    if (!codigoCliente) {
        alert("Informe o codigo do cliente para buscar");
        return;
    }

    try {
        const responde = await fetch(`${URL_API}/listar/${codigoCliente}`);
        if (!responde.ok) {
            alert("Erro ao buscar documentos");
            return;
        }

        const documentos = await responde.json();
        const tbody = document.getElementById("tabelaDocumentos");
        tbody.innerHTML = "";

        documentos.forEach(doc => {
            const id = doc.id || doc.Id;
            const nome = doc.nome || doc.Nome;
            const extensao = doc.extensao || doc.Extensao;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${id}</td>
                <td>${nome}</td>
                <td>${extensao}</td>
                <td>
                    <button style="background-color: #ffc107; border: none; padding: 5px 10px; cursor: pointer;" onclick="baixarDocumento(${id}, '${nome}')">Baixar</button>
                    <button style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer;" onclick="excluirDocumento(${id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error(erro);
        alert("Erro na conexao ao buscar documentos");
    }
}
async function baixarDocumento(id, nomeArquivo) {
    try {
        const responde = await fetch(`${URL_API}/dowload/${id}`);
        if (!responde.ok) {
            alert("Erro ao baixar o documento");
            return;
        }

        const blob = await responde.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (erro) {
        console.error(erro);
        alert("Erro na conexao ao baixar documento");
    }
}
async function excluirDocumento(id) {
    if (!confirm("Deseja realmente excluir este documento?")) return;

    try {
        const responde = await fetch(`${URL_API}/${id}`, {
            method: "DELETE"
        });

        if (responde.ok) {
            alert("Documento excluido com sucesso!");
            const codigoBusca = document.getElementById("buscaCodigoCliente").value;
            if (codigoBusca) {
                buscarDocumentos(codigoBusca);
            }
        } else {
            alert("Erro ao excluir o documento");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro na conexao ao excluir documento");
    }
}