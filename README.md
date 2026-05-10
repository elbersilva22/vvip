# Grupo VIP — Servidor de Pagamento PIX

## Como subir no Render.com

### 1. Suba para o GitHub
- Crie um repositório novo no GitHub chamado `grupovip`
- Faça upload de todos os arquivos desta pasta

### 2. Configure no Render.com
- Clique em "New +" → "Web Service"
- Conecte seu GitHub e selecione o repositório `grupovip`
- Preencha:
  - **Name:** grupovip
  - **Runtime:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`

### 3. Adicione as variáveis de ambiente
- Clique em "Environment"
- Adicione:
  - `CI` = sua chave ci nova
  - `CS` = sua chave cs nova

### 4. Clique em "Create Web Service"
- Aguarde o deploy (2-3 minutos)
- Pronto! Seu site estará no ar com pagamento PIX funcionando ✅
