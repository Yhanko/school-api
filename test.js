const fs = require('fs');
const envStr = fs.readFileSync('.env', 'utf8');
envStr.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '');
});
const axios = require('axios');
async function runTests() {
  const testPhone = '943558106';
  const testEmail = 'romeucajamba@gmail.com';
  const testInstitution = 'YhankoEduca (Teste)';

  console.log('1. A testar envio de Email via Brevo...');
  try {
    const brevoKey = process.env.BREVO_API_KEY;
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { email: 'no-reply@yhankoeduca.com', name: 'YhankoEduca' },
      to: [{ email: testEmail }],
      subject: 'Teste de Integracao YhankoEduca',
      htmlContent: '<h1>Ola!</h1><p>Este e um email de teste disparado pelo sistema para confirmar a integracao do Brevo.</p>'
    }, { headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' }});
    console.log('[OK] Email enviado com sucesso!');
  } catch (err) {
    console.error('[ERRO] Falha ao enviar Email:', err.response ? JSON.stringify(err.response.data) : err.message);
  }

  console.log('\n2. A testar envio de SMS via Ombala...');
  try {
    const ombalaUrl = process.env.OMBALA_BASE_URL;
    const ombalaToken = process.env.OMBALA_API_TOKEN;
    const ombalaFrom = process.env.OMBALA_FROM || 'ESCOLA';
    
    await axios.post(ombalaUrl + '/v1/messages', {
      message: '[' + testInstitution + '] - Teste\n\nEsta e uma SMS de teste para confirmar a integracao do Ombala.',
      from: ombalaFrom, to: testPhone
    }, { headers: { 'Authorization': 'Token ' + ombalaToken, 'Content-Type': 'application/json' }});
    console.log('[OK] SMS enviado com sucesso!');
  } catch (err) {
    console.error('[ERRO] Falha ao enviar SMS:', err.response ? JSON.stringify(err.response.data) : err.message);
  }

  console.log('\n3. A testar envio de WhatsApp via Twilio...');
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    
    const data = new URLSearchParams();
    data.append('To', 'whatsapp:+244' + testPhone);
    data.append('From', fromNumber.startsWith('whatsapp:') ? fromNumber : 'whatsapp:' + fromNumber.replace('+', ''));
    data.append('Body', '[' + testInstitution + ']\n\nOla! Esta e uma mensagem de teste disparada pelo sistema para confirmar a integracao do WhatsApp via Twilio.');

    let authHeader = '';
    if (apiKey && apiSecret && apiKey !== 'undefined' && apiSecret !== 'undefined') {
      authHeader = 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64');
    } else {
      authHeader = 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64');
    }

    await axios.post('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', data.toString(), {
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('[OK] WhatsApp enviado com sucesso!');
  } catch (err) {
    console.error('[ERRO] Falha ao enviar WhatsApp:', err.response ? JSON.stringify(err.response.data) : err.message);
  }
}
runTests().catch(console.error);
