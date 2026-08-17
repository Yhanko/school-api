import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function test() {
  try {
    const toNum = '+244947315059';
    const fromNum = process.env.TWILIO_WHATSAPP_NUMBER;
    
    if (!fromNum) throw new Error('TWILIO_WHATSAPP_NUMBER missing in .env');
    
    const message = await client.messages.create({
      from: fromNum,
      to: `whatsapp:${toNum}`,
      body: 'Teste direto com o SDK oficial da Twilio sem ContentSid!',
    });
    console.log('Success! Message SID:', message.sid);
  } catch (error) {
    console.error('Failed!', error.message);
    if (error.code) console.error('Error Code:', error.code);
  }
}

test();
