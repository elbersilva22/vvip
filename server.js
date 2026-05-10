const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CI = process.env.CI;
const CS = process.env.CS;

app.post('/criar-pix', async (req, res) => {
  const { amount } = req.body;
  const valor = amount || 23.99;
  const transactionId = `vip-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.misticpay.com/api/transactions/create', {
      method: 'POST',
      headers: { 'ci': CI, 'cs': CS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: valor,
        payerName: 'Cliente VIP',
        payerDocument: '00000000000',
        transactionId,
        description: valor <= 15 ? 'Acesso Basico Grupo VIP' : 'Acesso Completo Grupo VIP'
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(400).json({ erro: data.message || 'Erro ao gerar PIX' });
    res.json({
      transactionId: data.data.transactionId,
      qrCodeBase64: data.data.qrCodeBase64,
      copyPaste: data.data.copyPaste
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.post('/verificar-pix', async (req, res) => {
  const { transactionId } = req.body;
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.misticpay.com/api/transactions/check', {
      method: 'POST',
      headers: { 'ci': CI, 'cs': CS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId })
    });
    const data = await response.json();
    res.json({ status: data.transaction?.transactionState || 'PENDENTE' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
