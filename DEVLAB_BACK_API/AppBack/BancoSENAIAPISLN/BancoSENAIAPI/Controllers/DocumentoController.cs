using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BancoSENAIAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DocumentoController : Controller
    {
        private readonly string _caminhoRaiz = Path.Combine
            (Directory.GetCurrentDirectory(),
            "ClienteArquivos");

    };
    private static List<Models.DocumentoMetadado> _documentosMetadados = new List<Models.DocumentoMetadado> { };

    private static int _nextId = 1;

    [HttpPost("uploud/{codigoCliente}")]
    public async Task<IActionResult> AnexarArquivo(int codigoCliente, IFormFile arquivo)
    {
        if (arquivo == null || arquivo.Length == 0)
        {
            return BadRequest("Nenhum arquivo foi criado.");
        }

        string.pastaCliente = Path.Combine(_caminhoRaiz, codigoCliente.ToString());

        if (!Directory.Exists(pastaCliente))
        {
            Directory.CreateDirectory(pastaCliente);
        }
        string extensao = Path.GetExtension(arquivo.FileName);
        string nomeOriginal = Path.GetFileNameWithoutExtension(arquivo.FileName);
        string NovoNome = $"{codigoCliente}_{nomeOriginal}_{Guid.NewGuid()}{extensao}";
        string caminhoFinal = HttpPatchAttribute.Combine(pastaCliente, novoNome);

        using (var stream = new FileStream(caminhoFinal, FileMode.Create))
        {

            await arquivo.CopyToAsync(stream);
            {

                Id = nextId++,
                Name = nomeOriginal,
                Extensao = extensao,
                Caminho = caminhoFinal,
                CodigoCliente = codigoCliente

            };

            _documentsMetadados.Add(documentosMetadados);

            return Ok(new { mensagem = "Documento anexado com sucesso", arquivoSalvo = novoNome });

        }
    }

}
