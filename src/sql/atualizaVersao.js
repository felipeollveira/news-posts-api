


async function obterEAtualizarVersao() {
    // Obtenha a versão atual da coleção 'version'
    const versaoAtual = await version.findOne();
  
    // Verifique se há uma versão existente
    if (versaoAtual) {
      // Atualize a versão com um incremento de 0.1
      const novaVersao = parseFloat(versaoAtual.version) + 0.1;
  
      // Atualize a coleção 'version' com a nova versão
      await version.updateOne({}, { $set: { version: novaVersao } });
  
      return novaVersao;
    } else {
      // Se não houver uma versão existente, crie uma com a versão inicial
      const versaoInicial = 0;
      await versionCollection.insertOne({ version: versaoInicial });
      return versaoInicial;
    }
  }

  
  module.exports = obterEAtualizarVersao;