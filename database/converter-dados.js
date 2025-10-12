#!/usr/bin/env node

/**
 * Script de Conversão: localStorage JSON → SQL
 * CCB Espaço Infantil
 * 
 * Uso: node converter-dados.js <arquivo-json>
 * Exemplo: node converter-dados.js ccb-dados-localstorage-2025-10-11.json
 */

const fs = require('fs');
const path = require('path');

// Gerar UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Escapar strings para SQL
const escapeSql = (str) => {
  if (!str) return '';
  return String(str).replace(/'/g, "''");
};

// Validar e formatar data
const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  return dateStr.split('T')[0]; // Remove hora se houver
};

// Validar e formatar hora
const formatTime = (timeStr) => {
  if (!timeStr) return '00:00:00';
  // Se já está no formato HH:MM:SS, retorna
  if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) return timeStr;
  // Se está no formato HH:MM, adiciona :00
  if (timeStr.match(/^\d{2}:\d{2}$/)) return `${timeStr}:00`;
  return '00:00:00';
};

// Processar argumentos
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ ERRO: Nenhum arquivo JSON especificado!');
  console.log('');
  console.log('📖 Uso: node converter-dados.js <arquivo-json>');
  console.log('   Exemplo: node converter-dados.js ccb-dados-localstorage-2025-10-11.json');
  process.exit(1);
}

const inputFile = args[0];

// Verificar se arquivo existe
if (!fs.existsSync(inputFile)) {
  console.error(`❌ ERRO: Arquivo não encontrado: ${inputFile}`);
  process.exit(1);
}

console.log('🔄 Iniciando conversão...');
console.log(`📂 Arquivo de entrada: ${inputFile}`);

// Ler arquivo JSON
let jsonData;
try {
  const fileContent = fs.readFileSync(inputFile, 'utf8');
  jsonData = JSON.parse(fileContent);
  console.log('✅ Arquivo JSON lido com sucesso');
} catch (error) {
  console.error('❌ ERRO ao ler arquivo JSON:', error.message);
  process.exit(1);
}

// Inicializar SQL
let sql = '';
sql += '-- ============================================================\n';
sql += '-- DADOS MIGRADOS DO LOCALSTORAGE\n';
sql += `-- Data da migração: ${new Date().toISOString()}\n`;
sql += `-- Arquivo de origem: ${inputFile}\n`;
sql += '-- ============================================================\n\n';

sql += '-- Desabilitar triggers temporariamente para velocidade\n';
sql += 'SET session_replication_role = replica;\n\n';

// Contadores para estatísticas
const stats = {
  igrejas: 0,
  settings: 0,
  children: 0,
  cultoObservacoes: 0,
  historicoCultos: 0,
  diasUso: 0
};

// Mapear IDs antigos para novos UUIDs
const igrejaIdMap = {};

// ============================================================
// 1. MIGRAR IGREJAS
// ============================================================
if (jsonData.igrejas && Array.isArray(jsonData.igrejas) && jsonData.igrejas.length > 0) {
  sql += '-- ============================================================\n';
  sql += '-- IGREJAS\n';
  sql += '-- ============================================================\n\n';
  
  jsonData.igrejas.forEach(igreja => {
    const newId = generateUUID();
    igrejaIdMap[igreja.id] = newId;
    
    sql += `INSERT INTO igrejas (id, nome, data_cadastro) VALUES (\n`;
    sql += `  '${newId}',\n`;
    sql += `  '${escapeSql(igreja.nome)}',\n`;
    sql += `  '${formatDate(igreja.dataCadastro)}'\n`;
    sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    
    stats.igrejas++;
  });
  
  console.log(`✅ ${stats.igrejas} igreja(s) processada(s)`);
} else {
  console.log('⚠️  Nenhuma igreja encontrada no JSON');
}

// ============================================================
// 2. MIGRAR SETTINGS
// ============================================================
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- CONFIGURAÇÕES (SETTINGS)\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    if (!newIgrejaId) {
      console.warn(`⚠️  ID de igreja não encontrado no mapa: ${oldIgrejaId}`);
      return;
    }
    
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.settings) {
      sql += `INSERT INTO settings (igreja_id, capacidade_maxima) VALUES (\n`;
      sql += `  '${newIgrejaId}',\n`;
      sql += `  ${igrejaData.settings.capacidadeMaxima || 30}\n`;
      sql += `) ON CONFLICT (igreja_id) DO UPDATE SET\n`;
      sql += `  capacidade_maxima = EXCLUDED.capacidade_maxima;\n\n`;
      
      stats.settings++;
    }
  });
  
  console.log(`✅ ${stats.settings} configuração(ões) processada(s)`);
}

// ============================================================
// 3. MIGRAR CHILDREN
// ============================================================
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- CRIANÇAS\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    if (!newIgrejaId) return;
    
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.children && Array.isArray(igrejaData.children) && igrejaData.children.length > 0) {
      igrejaData.children.forEach(child => {
        const childId = generateUUID();
        
        sql += `INSERT INTO children (\n`;
        sql += `  id,\n`;
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
        sql += `  '${childId}',\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${escapeSql(child.nome)}',\n`;
        sql += `  '${escapeSql(child.nomeResponsavel)}',\n`;
        sql += `  '${child.tipoResponsavel}',\n`;
        sql += `  '${escapeSql(child.celularResponsavel)}',\n`;
        sql += `  '${escapeSql(child.observacoes || '')}',\n`;
        sql += `  '${formatTime(child.horaEntrada)}',\n`;
        sql += `  ${child.isChamadoAtivo ? 'TRUE' : 'FALSE'},\n`;
        sql += `  CURRENT_DATE\n`;
        sql += `);\n\n`;
        
        stats.children++;
      });
    }
  });
  
  console.log(`✅ ${stats.children} criança(s) processada(s)`);
}

// ============================================================
// 4. MIGRAR CULTO OBSERVAÇÕES
// ============================================================
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- OBSERVAÇÕES DO CULTO\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    if (!newIgrejaId) return;
    
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
        sql += `  '${formatDate(co.data)}',\n`;
        sql += `  '${escapeSql(co.palavraLida || '')}',\n`;
        sql += `  '${escapeSql(co.hinosCantados || '')}',\n`;
        sql += `  '${escapeSql(co.aprendizado || '')}'\n`;
        sql += `) ON CONFLICT (igreja_id, data) DO UPDATE SET\n`;
        sql += `  palavra_lida = EXCLUDED.palavra_lida,\n`;
        sql += `  hinos_cantados = EXCLUDED.hinos_cantados,\n`;
        sql += `  aprendizado = EXCLUDED.aprendizado;\n\n`;
        
        stats.cultoObservacoes++;
      }
    }
  });
  
  console.log(`✅ ${stats.cultoObservacoes} observação(ões) de culto processada(s)`);
}

// ============================================================
// 5. MIGRAR HISTÓRICO DE CULTOS
// ============================================================
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- HISTÓRICO DE CULTOS\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    if (!newIgrejaId) return;
    
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.historicoCultos && Array.isArray(igrejaData.historicoCultos)) {
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
        sql += `  '${formatDate(hist.data)}',\n`;
        sql += `  '${escapeSql(hist.palavraLida || '')}',\n`;
        sql += `  '${escapeSql(hist.hinosCantados || '')}',\n`;
        sql += `  '${escapeSql(hist.aprendizado || '')}',\n`;
        sql += `  ${hist.totalCriancas || 0}\n`;
        sql += `) ON CONFLICT (igreja_id, data) DO UPDATE SET\n`;
        sql += `  palavra_lida = EXCLUDED.palavra_lida,\n`;
        sql += `  hinos_cantados = EXCLUDED.hinos_cantados,\n`;
        sql += `  aprendizado = EXCLUDED.aprendizado,\n`;
        sql += `  total_criancas = EXCLUDED.total_criancas;\n\n`;
        
        stats.historicoCultos++;
      });
    }
  });
  
  console.log(`✅ ${stats.historicoCultos} histórico(s) de culto processado(s)`);
}

// ============================================================
// 6. MIGRAR DIAS DE USO
// ============================================================
if (jsonData.dadosPorIgreja) {
  sql += '-- ============================================================\n';
  sql += '-- DIAS DE USO\n';
  sql += '-- ============================================================\n\n';
  
  Object.keys(jsonData.dadosPorIgreja).forEach(oldIgrejaId => {
    const newIgrejaId = igrejaIdMap[oldIgrejaId];
    if (!newIgrejaId) return;
    
    const igrejaData = jsonData.dadosPorIgreja[oldIgrejaId];
    
    if (igrejaData.diasDeUso && Array.isArray(igrejaData.diasDeUso)) {
      igrejaData.diasDeUso.forEach(dia => {
        sql += `INSERT INTO dias_uso (\n`;
        sql += `  igreja_id,\n`;
        sql += `  data,\n`;
        sql += `  total_criancas,\n`;
        sql += `  culto_realizado\n`;
        sql += `) VALUES (\n`;
        sql += `  '${newIgrejaId}',\n`;
        sql += `  '${formatDate(dia.data)}',\n`;
        sql += `  ${dia.totalCriancas || 0},\n`;
        sql += `  ${dia.cultoRealizado ? 'TRUE' : 'FALSE'}\n`;
        sql += `) ON CONFLICT (igreja_id, data) DO UPDATE SET\n`;
        sql += `  total_criancas = EXCLUDED.total_criancas,\n`;
        sql += `  culto_realizado = EXCLUDED.culto_realizado;\n\n`;
        
        stats.diasUso++;
      });
    }
  });
  
  console.log(`✅ ${stats.diasUso} dia(s) de uso processado(s)`);
}

// Finalizar SQL
sql += '-- Reabilitar triggers\n';
sql += 'SET session_replication_role = DEFAULT;\n\n';

sql += '-- ============================================================\n';
sql += '-- VERIFICAÇÃO\n';
sql += '-- ============================================================\n\n';

sql += '-- Contar registros inseridos\n';
sql += 'SELECT \n';
sql += '  \'igrejas\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM igrejas\n\n';
sql += 'UNION ALL\n\n';
sql += 'SELECT \n';
sql += '  \'settings\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM settings\n\n';
sql += 'UNION ALL\n\n';
sql += 'SELECT \n';
sql += '  \'children\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM children\n\n';
sql += 'UNION ALL\n\n';
sql += 'SELECT \n';
sql += '  \'culto_observacoes\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM culto_observacoes\n\n';
sql += 'UNION ALL\n\n';
sql += 'SELECT \n';
sql += '  \'historico_cultos\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM historico_cultos\n\n';
sql += 'UNION ALL\n\n';
sql += 'SELECT \n';
sql += '  \'dias_uso\' AS tabela,\n';
sql += '  COUNT(*) AS total\n';
sql += 'FROM dias_uso\n';
sql += 'ORDER BY tabela;\n\n';

sql += '-- ============================================================\n';
sql += '-- FIM DA MIGRAÇÃO\n';
sql += '-- ============================================================\n';

// Salvar arquivo SQL
const outputFile = 'dados-migrados.sql';
try {
  fs.writeFileSync(outputFile, sql);
  console.log('');
  console.log('✅ Arquivo SQL gerado com sucesso!');
  console.log(`📄 Arquivo: ${outputFile}`);
  console.log('');
  console.log('📊 RESUMO DA MIGRAÇÃO:');
  console.log('─────────────────────────────');
  console.log(`  Igrejas:            ${stats.igrejas}`);
  console.log(`  Configurações:      ${stats.settings}`);
  console.log(`  Crianças:           ${stats.children}`);
  console.log(`  Culto Observações:  ${stats.cultoObservacoes}`);
  console.log(`  Histórico Cultos:   ${stats.historicoCultos}`);
  console.log(`  Dias de Uso:        ${stats.diasUso}`);
  console.log('─────────────────────────────');
  console.log('');
  console.log('📌 PRÓXIMOS PASSOS:');
  console.log('  1. Abra o Supabase SQL Editor');
  console.log(`  2. Cole o conteúdo de ${outputFile}`);
  console.log('  3. Execute o script (Run)');
  console.log('  4. Verifique os dados importados');
  console.log('');
  console.log('🙏 Que Deus abençoe!');
} catch (error) {
  console.error('❌ ERRO ao salvar arquivo SQL:', error.message);
  process.exit(1);
}

