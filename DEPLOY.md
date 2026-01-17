# Como Hospedar o DOCPRINT Gratuitamente

Existem duas formas principais e gratuitas de hospedar este projeto: **Vercel** (recomendado) ou **Netlify**.

## Opção 1: Vercel (Recomendado)

A Vercel é a criadora do Next.js e oferece uma hospedagem excelente para projetos React/Vite.

### Método A: Via GitHub (Automático)
1. Crie um repositório no [GitHub](https://github.com).
2. Envie este código para lá:
   ```bash
   git remote add origin <SEU_LINK_DO_GITHUB>
   git branch -M main
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com), faça login com o GitHub.
4. Clique em **"Add New..."** -> **"Project"**.
5. Selecione o repositório do DOCPRINT.
6. A Vercel detectará que é um projeto Vite. Apenas clique em **Deploy**.

### Método B: Via Linha de Comando (Sem GitHub)
1. Instale a CLI da Vercel:
   ```bash
   npm i -g vercel
   ```
2. Na pasta do projeto, rode:
   ```bash
   vercel
   ```
3. Siga as instruções na tela (Login, confirmar nome do projeto, etc). Use as configurações padrão.

---

## Opção 2: Netlify (Arrastar e Soltar)

Se você não quer configurar git ou contas complexas agora.

1. Gere a versão de produção do projeto:
   ```bash
   npm run build
   ```
   *Isso criará uma pasta chamada `dist` na raiz do projeto.*

2. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
3. Arraste a pasta `dist` para a área indicada na tela.
4. Pronto! Seu site estará no ar em segundos.

---

## Dica Importante para Mobile (HTTPS)

Ambas as opções acima fornecem **HTTPS automático** (o cadeadinho de segurança).
Isso é **essencial** para que a câmera e outras funcionalidades do navegador funcionem corretamente no celular, sem precisar daquelas "gambiarras" de IP que fizemos localmente.
