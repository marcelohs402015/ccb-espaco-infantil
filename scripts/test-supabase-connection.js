#!/usr/bin/env node

/**
 * Script de Teste de Conexão com Supabase
 * CCB Espaço Infantil
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gppkhqsutgnnawbwsgji.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM';

console.log('🔍 Testando Conexão com Supabase...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

const runTests = async () => {
  let allPassed = true;

  // Teste 1: Conexão básica
  console.log('1️⃣  Testando conexão básica...');
  try {
    const { data, error } = await supabase
      .from('igrejas')
      .select('count')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('   ✅ Conexão estabelecida com sucesso!\n');
  } catch (error) {
    console.error('   ❌ Erro na conexão:', error.message);
    console.error('   💡 Dica: Execute database/migration.sql no Supabase SQL Editor\n');
    allPassed = false;
  }

  // Teste 2: Verificar tabelas
  console.log('2️⃣  Verificando tabelas...');
  const tables = ['igrejas', 'settings', 'children', 'culto_observacoes', 'historico_cultos', 'dias_uso'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error && error.code === '42P01') {
        console.error(`   ❌ Tabela "${table}" não encontrada`);
        allPassed = false;
      } else if (error) {
        throw error;
      } else {
        console.log(`   ✅ Tabela "${table}" existe`);
      }
    } catch (error) {
      console.error(`   ❌ Erro ao verificar tabela "${table}":`, error.message);
      allPassed = false;
    }
  }
  console.log('');

  // Teste 3: Verificar views
  console.log('3️⃣  Verificando views...');
  const views = ['v_criancas_hoje', 'v_estatisticas_igreja'];
  
  for (const view of views) {
    try {
      const { data, error } = await supabase
        .from(view)
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        console.error(`   ❌ View "${view}" não encontrada`);
        allPassed = false;
      } else if (error) {
        throw error;
      } else {
        console.log(`   ✅ View "${view}" existe`);
      }
    } catch (error) {
      console.error(`   ❌ Erro ao verificar view "${view}":`, error.message);
      allPassed = false;
    }
  }
  console.log('');

  // Teste 4: Inserir dados de teste
  console.log('4️⃣  Testando inserção de dados...');
  try {
    const testIgreja = {
      nome: 'Igreja Teste - ' + new Date().toISOString(),
      data_cadastro: new Date().toISOString()
    };

    const { data: igreja, error: igrejaError } = await supabase
      .from('igrejas')
      .insert(testIgreja)
      .select()
      .single();

    if (igrejaError) throw igrejaError;

    console.log('   ✅ Igreja de teste criada:', igreja.nome);

    // Criar settings
    const { error: settingsError } = await supabase
      .from('settings')
      .insert({
        igreja_id: igreja.id,
        capacidade_maxima: 30
      });

    if (settingsError) throw settingsError;

    console.log('   ✅ Settings criadas com sucesso');

    // Limpar dados de teste
    await supabase.from('settings').delete().eq('igreja_id', igreja.id);
    await supabase.from('igrejas').delete().eq('id', igreja.id);

    console.log('   ✅ Dados de teste removidos\n');
  } catch (error) {
    console.error('   ❌ Erro ao inserir dados:', error.message);
    allPassed = false;
    console.log('');
  }

  // Resultado final
  console.log('═══════════════════════════════════════════════════════');
  if (allPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM! ');
    console.log('✅ Supabase está configurado corretamente');
    console.log('✅ Pronto para deploy no Vercel');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Commit suas mudanças: git add . && git commit -m "Configure Supabase"');
    console.log('   2. Push para o GitHub: git push');
    console.log('   3. Deploy no Vercel: consulte DEPLOY-VERCEL.md');
  } else {
    console.log('⚠️  ALGUNS TESTES FALHARAM');
    console.log('❌ Verifique os erros acima');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('💡 Solução:');
    console.log('   1. Acesse: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji');
    console.log('   2. Vá em: SQL Editor');
    console.log('   3. Execute: database/migration.sql');
    console.log('   4. Execute este teste novamente: node scripts/test-supabase-connection.js');
  }
  console.log('');
};

runTests().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

