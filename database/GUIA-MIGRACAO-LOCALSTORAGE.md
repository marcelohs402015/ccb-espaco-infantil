# 📦 Guia de Migração: localStorage → Supabase

## 🎯 Objetivo

Este guia explica como exportar os dados do **localStorage** e importá-los para o **Supabase**.

## 🔄 Processo de Migração

### Passo 1: Exportar Dados do localStorage

1. **Acesse a aplicação** no navegador onde os dados estão salvos
2. **Abra o Console do Navegador**:
   - Chrome/Edge: `F12` ou `Ctrl+Shift+J`
   - Firefox: `F12` ou `Ctrl+Shift+K`
   - Safari: `Cmd+Option+C`

3. **Cole este código no Console** para exportar todos os dados:

```javascript
// Exportar dados do localStorage
const storageKey = 'ccb-espaco-infantil-storage';
const data = localStorage.getItem(storageKey);

if (data) {
  const parsedData = JSON.parse(data);
  console.log('Dados encontrados:', parsedData);
  
  // Criar arquivo para download
  const blob = new Blob([JSON.stringify(parsedData.state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ccb-dados-localstorage-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Arquivo baixado com sucesso!');
} else {
  console.log('❌ Nenhum dado encontrado no localStorage');
}
```

4. **Um arquivo JSON será baixado** com todos os dados

### Passo 2: Converter JSON para SQL

Depois de baixar o arquivo JSON, você tem duas opções:

#### Opção A: Usar o Script de Conversão (Recomendado)

Vou criar um script Node.js que converte o JSON para SQL automaticamente.

Crie um arquivo `converter-dados.js`:

```javascript
const fs = require('fs');

// Ler arquivo JSON exportado do localStorage
const jsonData = JSON.parse(fs.readFileSync('ccb-dados-localstorage-YYYY-MM-DD.json', 'utf8'));

let sql = '';
sql += '-- ============================================================\n';
sql += '-- DADOS MIGRADOS DO LOCALSTORAGE\n';
sql += '-- Data da migração: ' + new Date().toISOString() + '\n';
sql += '-- ============================================================\n\n';

// Gerar UUID v4 simples (ou use biblioteca)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Escapar strings para SQL
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// Mapear IDs antigos (string) para novos UUIDs
const igrejaIdMap = {};

// 1. MIGRAR IGREJAS
if (jsonData.igrejas && jsonData.igrejas.length > 0) {
  sql += '-- ============================================================\n';
  sql += '-- IGREJAS\n';
  sql += '-- ============================================================\n\n';
  
  jsonData.igrejas.forEach(igreja => {
    const newId = generateUUID();
    igrejaIdMap[igreja.id] = newId;
    
    sql += `INSERT INTO igrejas (id, nome, data_cadastro) VALUES (\n`;
    sql += `  '${newId}',\n`;
    sql += `  '${escapeSql(igreja.nome)}',\n`;
    sql += `  '${igreja.dataCadastro}'\n`;
    sql += `);\n\n`;
  });
}

// 2. MIGRAR SETTINGS
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- CONFIGURAÇÕES (SETTINGS)\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.settings) {
      sql += `INSERT INTO settings (igreja_id, capacidade_maxima) VALUES (\n`;
      sql += `  '${newIgrejaId}',\n`;
      sql += `  ${igrejaData.settings.capacidadeMaxima}\n`;
      sql += `);\n\n`;
    }
  });
}

// 3. MIGRAR CHILDREN (apenas do dia atual, se houver)
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- CRIANÇAS\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.children && igrejaData.children.length > 0) {
      igrejaData.children.forEach(child => {
        sql += `INSERT INTO children (\n`;
        sql += `  igreja_id,\n`;
        sql += `  nome,\n`;
        sql += `  nome_responsavel,\n`;
        sql += `  tipo_responsavel,\n`;
        sql += `  celular_responsavel,\n`;
        sql += `  observacoes,\n`;
        sql += `  hora_entrada,\n`;
        sql += `  is_chamado_ativo,\n`;
        sql += `  data_cadastro\n`;
        sql += `) VALUES (\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${escapeSql(child.nome)}',\n`;
        sql += `  '${escapeSql(child.nomeResponsavel)}',\n`;
        sql += `  '${child.tipoResponsavel}',\n`;
        sql += `  '${escapeSql(child.celularResponsavel)}',\n`;
        sql += `  '${escapeSql(child.observacoes || '')}',\n`;
        sql += `  '${child.horaEntrada}',\n`;
        sql += `  ${child.isChamadoAtivo ? 'TRUE' : 'FALSE'},\n`;
        sql += `  CURRENT_DATE\n`;
        sql += `);\n\n`;
      });
    }
  });
}

// 4. MIGRAR CULTO OBSERVAÇÕES
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- OBSERVAÇÕES DO CULTO\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.cultoObservacoes) {
      const co = igrejaData.cultoObservacoes;
      
      // Só inserir se tiver alguma informação
      if (co.palavraLida || co.hinosCantados || co.aprendizado) {
        sql += `INSERT INTO culto_observacoes (\n`;
        sql += `  igreja_id,\n`;
        sql += `  data,\n`;
        sql += `  palavra_lida,\n`;
        sql += `  hinos_cantados,\n`;
        sql += `  aprendizado\n`;
        sql += `) VALUES (\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${co.data}',\n`;
        sql += `  '${escapeSql(co.palavraLida || '')}',\n`;
        sql += `  '${escapeSql(co.hinosCantados || '')}',\n`;
        sql += `  '${escapeSql(co.aprendizado || '')}'\n`;
        sql += `);\n\n`;
      }
    }
  });
}

// 5. MIGRAR HISTÓRICO DE CULTOS
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- HISTÓRICO DE CULTOS\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.historicoCultos && igrejaData.historicoCultos.length > 0) {
      igrejaData.historicoCultos.forEach(hist => {
        sql += `INSERT INTO historico_cultos (\n`;
        sql += `  igreja_id,\n`;
        sql += `  data,\n`;
        sql += `  palavra_lida,\n`;
        sql += `  hinos_cantados,\n`;
        sql += `  aprendizado,\n`;
        sql += `  total_criancas\n`;
        sql += `) VALUES (\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${hist.data}',\n`;
        sql += `  '${escapeSql(hist.palavraLida || '')}',\n`;
        sql += `  '${escapeSql(hist.hinosCantados || '')}',\n`;
        sql += `  '${escapeSql(hist.aprendizado || '')}',\n`;
        sql += `  ${hist.totalCriancas}\n`;
        sql += `);\n\n`;
      });
    }
  });
}

// 6. MIGRAR DIAS DE USO
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- DIAS DE USO\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.diasDeUso && igrejaData.diasDeUso.length > 0) {
      igrejaData.diasDeUso.forEach(dia => {
        sql += `INSERT INTO dias_uso (\n`;
        sql += `  igreja_id,\n`;
        sql += `  data,\n`;
        sql += `  total_criancas,\n`;
        sql += `  culto_realizado\n`;
        sql += `) VALUES (\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${dia.data}',\n`;
        sql += `  ${dia.totalCriancas},\n`;
        sql += `  ${dia.cultoRealizado ? 'TRUE' : 'FALSE'}\n`;
        sql += `);\n\n`;
      });
    }
  });
}

sql += '-- ============================================================\n';
sql += '-- FIM DA MIGRAÇÃO\n';
sql += '-- ============================================================\n';

// Salvar arquivo SQL
fs.writeFileSync('dados-migrados.sql', sql);
console.log('✅ Arquivo SQL gerado com sucesso: dados-migrados.sql');
console.log('📊 Resumo da migração:');
console.log('  - Igrejas:', jsonData.igrejas?.length || 0);
```

**Como usar o script:**

1. Salve o script acima como `converter-dados.js`
2. Coloque o arquivo JSON exportado na mesma pasta
3. Execute: `node converter-dados.js`
4. Um arquivo `dados-migrados.sql` será gerado

#### Opção B: Conversão Manual

Se preferir converter manualmente, siga este template:

```sql
-- 1. Inserir Igreja
INSERT INTO igrejas (id, nome, data_cadastro) VALUES
('UUID-GERADO', 'Nome da Igreja', '2025-10-11');

-- 2. Inserir Settings
INSERT INTO settings (igreja_id, capacidade_maxima) VALUES
('UUID-DA-IGREJA', 30);

-- 3. Inserir Crianças (para cada criança do JSON)
INSERT INTO children (
  igreja_id, nome, nome_responsavel, tipo_responsavel,
  celular_responsavel, observacoes, hora_entrada,
  is_chamado_ativo, data_cadastro
) VALUES (
  'UUID-DA-IGREJA',
  'Nome da Criança',
  'Nome do Responsável',
  'mae',
  '(11) 99999-9999',
  'Observações',
  '19:00:00',
  FALSE,
  CURRENT_DATE
);

-- Continue para: culto_observacoes, historico_cultos, dias_uso
```

### Passo 3: Importar para o Supabase

1. **Acesse o Supabase SQL Editor**
2. **Cole o SQL gerado** (dados-migrados.sql)
3. **Execute** (Run)
4. **Verifique** se os dados foram importados:

```sql
-- Ver todas as igrejas
SELECT * FROM igrejas;

-- Ver crianças de hoje
SELECT * FROM v_criancas_hoje;

-- Contar registros
SELECT 
  'igrejas' AS tabela, COUNT(*) AS total FROM igrejas
UNION ALL
SELECT 'children' AS tabela, COUNT(*) AS total FROM children
UNION ALL
SELECT 'historico_cultos' AS tabela, COUNT(*) AS total FROM historico_cultos;
```

## 🔒 Backup do localStorage (Importante!)

**ANTES de fazer qualquer coisa, faça backup dos dados:**

```javascript
// No Console do navegador
const storageKey = 'ccb-espaco-infantil-storage';
const data = localStorage.getItem(storageKey);
console.log('BACKUP:', data);

// Salve o resultado em um arquivo .txt como segurança!
```

## ⚠️ Considerações Importantes

### IDs: String → UUID

- **localStorage**: Usa `Date.now().toString()` (ex: "1728648000000")
- **Supabase**: Usa UUID v4 (ex: "550e8400-e29b-41d4-a716-446655440000")

**Solução**: O script de conversão mapeia automaticamente os IDs antigos para novos UUIDs.

### Data/Hora

- **localStorage**: Strings ISO (`"2025-10-11"`, `"19:00:00"`)
- **Supabase**: Tipos nativos (`DATE`, `TIME`, `TIMESTAMP`)

**Solução**: O PostgreSQL aceita strings ISO e converte automaticamente.

### Estrutura de Dados

**localStorage (Zustand):**
```json
{
  "igrejas": [...],
  "igrejaAtiva": "id-da-igreja",
  "dadosPorIgreja": {
    "id-igreja-1": {
      "children": [...],
      "settings": {...},
      "cultoObservacoes": {...},
      "historicoCultos": [...],
      "diasDeUso": [...]
    }
  }
}
```

**Supabase (Relacional):**
```
igrejas (tabela pai)
  ├─ settings (1:1)
  ├─ children (1:N)
  ├─ culto_observacoes (1:N)
  ├─ historico_cultos (1:N)
  └─ dias_uso (1:N)
```

## 🧪 Teste a Migração

Após importar os dados, execute estes testes:

```sql
-- 1. Verificar se todas as igrejas foram importadas
SELECT COUNT(*) AS total_igrejas FROM igrejas;

-- 2. Verificar se cada igreja tem settings
SELECT 
  i.nome,
  CASE WHEN s.id IS NULL THEN '❌ SEM CONFIG' ELSE '✅ OK' END AS status
FROM igrejas i
LEFT JOIN settings s ON i.id = s.igreja_id;

-- 3. Ver resumo geral
SELECT 
  i.nome AS igreja,
  (SELECT COUNT(*) FROM children WHERE igreja_id = i.id) AS criancas,
  (SELECT COUNT(*) FROM historico_cultos WHERE igreja_id = i.id) AS cultos,
  (SELECT COUNT(*) FROM dias_uso WHERE igreja_id = i.id) AS dias_uso
FROM igrejas i;
```

## 🔄 Estratégia de Migração Gradual

Se quiser testar antes de migrar tudo:

1. **Fase 1**: Criar tabelas (migration.sql)
2. **Fase 2**: Inserir dados de exemplo (dados-exemplo.sql)
3. **Fase 3**: Testar aplicação com dados de exemplo
4. **Fase 4**: Migrar dados reais do localStorage
5. **Fase 5**: Validar que tudo funciona
6. **Fase 6**: Limpar dados de exemplo
7. **Fase 7**: Produção! 🚀

## 🆘 Problemas Comuns

### "Nenhum dado encontrado no localStorage"

**Causa**: Você está em um navegador/dispositivo diferente  
**Solução**: Acesse a aplicação no mesmo navegador onde usou antes

### "duplicate key value violates unique constraint"

**Causa**: Você está tentando inserir dados que já existem  
**Solução**: 
```sql
-- Limpar tabelas antes de re-importar
TRUNCATE TABLE dias_uso CASCADE;
TRUNCATE TABLE historico_cultos CASCADE;
TRUNCATE TABLE culto_observacoes CASCADE;
TRUNCATE TABLE children CASCADE;
TRUNCATE TABLE settings CASCADE;
TRUNCATE TABLE igrejas CASCADE;
```

### "insert or update on table violates foreign key constraint"

**Causa**: Tentando inserir dados filhos antes da igreja pai  
**Solução**: Sempre inserir na ordem: igrejas → settings → children → etc.

## 📚 Recursos Adicionais

- [Supabase SQL Editor Docs](https://supabase.com/docs/guides/database/overview)
- [PostgreSQL INSERT Docs](https://www.postgresql.org/docs/current/sql-insert.html)
- [localStorage MDN Docs](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

---

<div align="center">

**Que Deus abençoe a migração! 🙏**

Qualquer dúvida, consulte os outros arquivos da pasta `database/`

</div>

