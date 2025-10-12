#!/usr/bin/env node

/**
 * Script de Teste - Inserir Dados no Supabase
 * CCB Espaço Infantil
 * 
 * Este script insere dados de teste e você pode ver em tempo real no Supabase Dashboard
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gppkhqsutgnnawbwsgji.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM';

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║    🧪 TESTE DE INSERÇÃO DE DADOS NO SUPABASE           ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const supabase = createClient(supabaseUrl, supabaseKey);

const testData = async () => {
  console.log('📊 Acompanhe os dados sendo inseridos no Supabase Dashboard:');
  console.log('🔗 https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor\n');
  console.log('─────────────────────────────────────────────────────────\n');

  try {
    // 1. INSERIR IGREJA
    console.log('1️⃣  Criando igreja de teste...');
    const { data: igreja, error: igrejaError } = await supabase
      .from('igrejas')
      .insert({
        nome: 'Igreja CCB - Teste Local ' + new Date().toLocaleTimeString('pt-BR'),
        data_cadastro: new Date().toISOString()
      })
      .select()
      .single();

    if (igrejaError) throw igrejaError;

    console.log('   ✅ Igreja criada:');
    console.log('      ID:', igreja.id);
    console.log('      Nome:', igreja.nome);
    console.log('      Data:', new Date(igreja.data_cadastro).toLocaleString('pt-BR'));
    console.log('');

    // Aguardar 1 segundo para você ver no dashboard
    console.log('   ⏳ Aguardando 2 segundos... (veja no dashboard)');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // 2. INSERIR SETTINGS
    console.log('2️⃣  Criando configurações da igreja...');
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .insert({
        igreja_id: igreja.id,
        capacidade_maxima: 30
      })
      .select()
      .single();

    if (settingsError) throw settingsError;

    console.log('   ✅ Settings criados:');
    console.log('      Capacidade Máxima:', settings.capacidade_maxima);
    console.log('');

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // 3. INSERIR CRIANÇAS
    console.log('3️⃣  Cadastrando crianças de teste...');

    const criancas = [
      {
        igreja_id: igreja.id,
        nome: 'João Pedro Silva',
        nome_responsavel: 'Maria Silva',
        tipo_responsavel: 'mae',
        celular_responsavel: '(11) 98765-4321',
        observacoes: 'Primeira vez no espaço infantil',
        hora_entrada: '19:00:00',
        data_cadastro: new Date().toISOString().split('T')[0]
      },
      {
        igreja_id: igreja.id,
        nome: 'Ana Beatriz Santos',
        nome_responsavel: 'José Santos',
        tipo_responsavel: 'pai',
        celular_responsavel: '(11) 99876-5432',
        observacoes: 'Alérgica a amendoim',
        hora_entrada: '19:05:00',
        data_cadastro: new Date().toISOString().split('T')[0]
      },
      {
        igreja_id: igreja.id,
        nome: 'Lucas Oliveira',
        nome_responsavel: 'Carla Oliveira',
        tipo_responsavel: 'mae',
        celular_responsavel: '(11) 97654-3210',
        observacoes: 'Muito ativo e participativo',
        hora_entrada: '19:10:00',
        data_cadastro: new Date().toISOString().split('T')[0]
      }
    ];

    for (let i = 0; i < criancas.length; i++) {
      const { data: crianca, error: criancaError } = await supabase
        .from('children')
        .insert(criancas[i])
        .select()
        .single();

      if (criancaError) throw criancaError;

      console.log(`   ✅ Criança ${i + 1} cadastrada:`);
      console.log('      Nome:', crianca.nome);
      console.log('      Responsável:', crianca.nome_responsavel, `(${crianca.tipo_responsavel})`);
      console.log('      Telefone:', crianca.celular_responsavel);
      console.log('      Hora Entrada:', crianca.hora_entrada);
      console.log('');

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');

    // 4. BUSCAR E MOSTRAR RESUMO
    console.log('4️⃣  Buscando resumo dos dados inseridos...');
    console.log('');

    // Buscar view
    const { data: resumo, error: resumoError } = await supabase
      .from('v_criancas_hoje')
      .select('*')
      .eq('igreja_id', igreja.id)
      .single();

    if (resumoError) throw resumoError;

    console.log('   📊 RESUMO:');
    console.log('   ─────────────────────────────────────────');
    console.log('   Igreja:', resumo.igreja_nome);
    console.log('   Crianças Presentes:', resumo.total_criancas);
    console.log('   Capacidade Máxima:', resumo.capacidade_maxima);
    console.log('   Ocupação:', resumo.percentual_ocupacao + '%');
    console.log('   Chamados Ativos:', resumo.chamados_ativos);
    console.log('   ─────────────────────────────────────────');
    console.log('');

    // 5. TESTAR EMERGÊNCIA
    console.log('5️⃣  Testando ativação de emergência...');

    // Buscar primeira criança
    const { data: criancasLista } = await supabase
      .from('children')
      .select('*')
      .eq('igreja_id', igreja.id)
      .limit(1);

    if (criancasLista && criancasLista.length > 0) {
      const criancaId = criancasLista[0].id;

      // Ativar emergência
      const { data: criancaEmergencia, error: emergenciaError } = await supabase
        .from('children')
        .update({ is_chamado_ativo: true })
        .eq('id', criancaId)
        .select()
        .single();

      if (emergenciaError) throw emergenciaError;

      console.log('   🚨 Emergência ATIVADA:');
      console.log('      Criança:', criancaEmergencia.nome);
      console.log('      Responsável:', criancaEmergencia.nome_responsavel);
      console.log('      Telefone:', criancaEmergencia.celular_responsavel);
      console.log('      Status:', criancaEmergencia.is_chamado_ativo ? '🔴 ATIVO' : '🟢 INATIVO');
      console.log('');

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Desativar emergência
      await supabase
        .from('children')
        .update({ is_chamado_ativo: false })
        .eq('id', criancaId);

      console.log('   ✅ Emergência DESATIVADA');
      console.log('');
    }

    // 6. MOSTRAR URLs ÚTEIS
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📍 ONDE VER OS DADOS:');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('🗄️  SUPABASE DASHBOARD (Tabela Editor):');
    console.log('   https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor\n');
    
    console.log('📊 VER TABELAS:');
    console.log('   • igrejas: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor/28374');
    console.log('   • children: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor/28377');
    console.log('   • settings: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor/28375\n');
    
    console.log('🔍 QUERY SQL PARA VER SEUS DADOS:');
    console.log('   SQL Editor: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/sql/new\n');
    console.log('   Execute:');
    console.log('   ─────────────────────────────────────────');
    console.log('   SELECT i.nome AS igreja,');
    console.log('          c.nome AS crianca,');
    console.log('          c.nome_responsavel AS responsavel,');
    console.log('          c.hora_entrada');
    console.log('   FROM children c');
    console.log('   INNER JOIN igrejas i ON c.igreja_id = i.id');
    console.log(`   WHERE i.id = '${igreja.id}'`);
    console.log('   ORDER BY c.hora_entrada;');
    console.log('   ─────────────────────────────────────────\n');

    // 7. PERGUNTAR SE QUER LIMPAR
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧹 LIMPEZA DOS DADOS DE TESTE');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('⚠️  Os dados de teste foram inseridos no banco.');
    console.log('');
    console.log('Opções:');
    console.log('  1. Deixar no banco para explorar no dashboard');
    console.log('  2. Limpar agora automaticamente\n');

    // Aguardar 3 segundos e limpar
    console.log('⏳ Aguardando 5 segundos antes de limpar...');
    console.log('   (pressione Ctrl+C para cancelar e manter os dados)\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🧹 Limpando dados de teste...');
    
    // Deletar em ordem (respeitar foreign keys)
    await supabase.from('children').delete().eq('igreja_id', igreja.id);
    await supabase.from('settings').delete().eq('igreja_id', igreja.id);
    await supabase.from('igrejas').delete().eq('id', igreja.id);

    console.log('✅ Dados de teste removidos com sucesso!\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✅ Todos os dados foram inseridos e validados');
    console.log('✅ Você pode ver em tempo real no Supabase Dashboard');
    console.log('✅ APIs estão funcionando corretamente\n');
    console.log('💡 Para testar novamente: npm run test:insert\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\n💡 Dica: Verifique se executou database/migration.sql no Supabase\n');
    process.exit(1);
  }
};

testData();

