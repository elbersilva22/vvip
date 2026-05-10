const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ⚠️ TROQUE AQUI pelas suas chaves novas da MisticPay
const CI = process.env.CI || 'SUA_CHAVE_CI_AQUI';
const CS = process.env.CS || 'SUA_CHAVE_CS_AQUI';

// Gerar PIX
app.post('/criar-pix', async (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ erro: 'Nome e CPF obrigatórios' });
  }

  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ erro: 'CPF inválido' });
  }

  const transactionId = `vip-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  try {
    const response = await fetch('https://api.misticpay.com/api/transactions/create', {
      method: 'POST',
      headers: {
        'ci': CI,
        'cs': CS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 23.99,
        payerName: nome,
        payerDocument: cpfLimpo,
        transactionId: transactionId,
        description: 'Acesso Grupo VIP 🔥'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ erro: data.message || 'Erro ao gerar PIX' });
    }

    res.json({
      transactionId: data.data.transactionId,
      qrCodeBase64: data.data.qrCodeBase64,
      copyPaste: data.data.copyPaste
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Verificar pagamento
app.post('/verificar-pix', async (req, res) => {
  const { transactionId } = req.body;

  try {
    const response = await fetch('https://api.misticpay.com/api/transactions/check', {
      method: 'POST',
      headers: {
        'ci': CI,
        'cs': CS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transactionId })
    });

    const data = await response.json();
    res.json({ status: data.transaction?.transactionState || 'PENDENTE' });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
