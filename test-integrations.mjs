/**
 * Script de Teste Real - Email, WhatsApp e SMS
 *
 * Como executar (na pasta school-api):
 *   node --env-file=.env test-integrations.mjs
 */

import axios from 'axios';
import { Buffer } from 'buffer';

const CONFIG = {
  BREVO_API_KEY:        process.env.BREVO_API_KEY,
  SMTP_FROM_EMAIL:      process.env.SMTP_FROM_EMAIL || 'eliseugaspar4@gmail.com',
  SMTP_FROM_NAME:       process.env.SMTP_FROM_NAME  || 'YhankoEduca',
  TWILIO_ACCOUNT_SID:   process.env.TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY:       process.env.TWILIO_API_KEY,
  TWILIO_API_SECRET:    process.env.TWILIO_API_SECRET,
  TWILIO_AUTH_TOKEN:    process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+244947315059',
  OMBALA_BASE_URL:      process.env.OMBALA_BASE_URL  || 'https://api.useombala.ao',
  OMBALA_API_TOKEN:     process.env.OMBALA_API_TOKEN,
  OMBALA_FROM:          process.env.OMBALA_FROM       || 'ESCOLA',
  TARGET_PHONE:  '+244943558106',
  TARGET_EMAIL:  'romeucajamba@gmail.com',
};

const SEP = '─'.repeat(55);
let passed = 0, failed = 0;

function log(emoji, label, msg) {
  console.log(`${emoji}  [${label}] ${msg}`);
}

async function testEmail() {
  console.log(`\n${SEP}\n📧  TESTE: E-mail via Brevo\n${SEP}`);
  if (!CONFIG.BREVO_API_KEY) { log('❌','EMAIL','BREVO_API_KEY não configurada'); failed++; return; }
  try {
    const r = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: CONFIG.SMTP_FROM_NAME, email: CONFIG.SMTP_FROM_EMAIL },
      to: [{ email: CONFIG.TARGET_EMAIL }],
      subject: '✅ Teste de E-mail - YhankoEduca',
      htmlContent: `<div style="font-family:Arial,sans-serif;padding:24px;background:#f9fafb;border-radius:12px;max-width:600px">
        <h2 style="color:#4f46e5">🎉 Teste de Integração - E-mail</h2>
        <p>Olá Romeu,</p>
        <p>Esta mensagem confirma que o envio de <strong>e-mail via Brevo</strong> na plataforma <em>YhankoEduca</em> está a funcionar corretamente.</p>
        <hr style="border:1px solid #e5e7eb"/>
        <p style="font-size:12px;color:#6b7280">Enviado automaticamente em ${new Date().toLocaleString('pt-AO')}.</p>
      </div>`,
    }, { headers: { 'api-key': CONFIG.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' } });
    if ([200,201,202].includes(r.status)) { log('✅','EMAIL',`Enviado para ${CONFIG.TARGET_EMAIL} (status ${r.status})`); passed++; }
  } catch (err) {
    log('❌','EMAIL',`Falha: ${err.response?.data?.message || err.message}`);
    if (err.response?.data) console.error('   Detalhes:', JSON.stringify(err.response.data, null, 2));
    failed++;
  }
}

async function testWhatsapp() {
  console.log(`\n${SEP}\n📱  TESTE: WhatsApp via Twilio\n${SEP}`);
  const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_AUTH_TOKEN } = CONFIG;
  if (!TWILIO_ACCOUNT_SID) { log('❌','WHATSAPP','TWILIO_ACCOUNT_SID não configurado'); failed++; return; }

  let authHeader;
  if (TWILIO_API_KEY && TWILIO_API_SECRET) {
    authHeader = `Basic ${Buffer.from(`${TWILIO_API_KEY}:${TWILIO_API_SECRET}`).toString('base64')}`;
    log('ℹ️ ','WHATSAPP','Usando autenticação via API Key');
  } else if (TWILIO_AUTH_TOKEN) {
    authHeader = `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`;
    log('ℹ️ ','WHATSAPP','Usando autenticação via Auth Token');
  } else { log('❌','WHATSAPP','Nenhuma credencial encontrada'); failed++; return; }

  const toNum = CONFIG.TARGET_PHONE.replace('+', '');
  const from  = CONFIG.TWILIO_WHATSAPP_FROM.startsWith('whatsapp:') ? CONFIG.TWILIO_WHATSAPP_FROM : `whatsapp:${CONFIG.TWILIO_WHATSAPP_FROM.replace('+','')}`;
  const data  = new URLSearchParams();
  data.append('To',   `whatsapp:${toNum}`);
  data.append('From', from);
  data.append('Body', `🎉 *Teste de Integração - YhankoEduca*\n\nOlá Romeu! O envio de mensagens via *WhatsApp (Twilio)* está a funcionar na plataforma.\n\n📅 ${new Date().toLocaleString('pt-AO')}`);

  try {
    const r = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      data.toString(),
      { headers: { Authorization: authHeader, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    log('✅','WHATSAPP',`Enviado para ${CONFIG.TARGET_PHONE} (SID: ${r.data?.sid})`);
    passed++;
  } catch (err) {
    const d = err.response?.data;
    log('❌','WHATSAPP',`Falha: ${d?.message || err.message}`);
    if (d) { console.error('   Código Twilio:', d.code); console.error('   Mais info:', d.more_info); }
    failed++;
  }
}

async function testSms() {
  console.log(`\n${SEP}\n💬  TESTE: SMS via Ombala\n${SEP}`);
  if (!CONFIG.OMBALA_API_TOKEN || CONFIG.OMBALA_API_TOKEN === 'your_ombala_api_token') {
    log('⚠️ ','SMS','OMBALA_API_TOKEN não configurada — a ignorar este teste.');
    return;
  }
  const num = CONFIG.TARGET_PHONE.replace(/[\+\s\-]/g,'').replace(/^0+/,'').replace(/^244/,'');
  try {
    await axios.post(`${CONFIG.OMBALA_BASE_URL}/v1/messages`, {
      message: `[YhankoEduca] Teste SMS - A integracao com Ombala esta a funcionar! ${new Date().toLocaleString('pt-AO')}`,
      from: CONFIG.OMBALA_FROM,
      to: num,
    }, { headers: { Authorization: `Token ${CONFIG.OMBALA_API_TOKEN}`, 'Content-Type': 'application/json' } });
    log('✅','SMS',`Enviado para ${CONFIG.TARGET_PHONE}`);
    passed++;
  } catch (err) {
    log('❌','SMS',`Falha: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n' + '═'.repeat(55));
  console.log('   🚀 SUITE DE TESTES — YhankoEduca Integrations');
  console.log('═'.repeat(55));
  await testEmail();
  await testWhatsapp();
  await testSms();
  console.log(`\n${SEP}`);
  console.log(`📊  RESULTADO FINAL:`);
  console.log(`   ✅ Passou : ${passed}`);
  console.log(`   ❌ Falhou : ${failed}`);
  console.log(SEP + '\n');
}

run();
