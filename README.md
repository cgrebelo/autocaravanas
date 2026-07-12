# Rota Livre Autocaravanas

Aplicação web MVP para aluguer de autocaravanas em modelo marketplace: clientes reservam, proprietários anunciam as suas autocaravanas e uma conta de administrador valida e gere a plataforma. A interface está em português de Portugal e foi criada sem copiar marca, textos, design, logótipo ou estrutura visual proprietária de terceiros.

## Stack

- Next.js, React e TypeScript
- Tailwind CSS
- API routes para preço, reservas, documentos, mensagens e pagamentos
- Supabase/PostgreSQL preparado com RLS
- Supabase Auth e Storage preparados
- Stripe preparado para pagamento de sinal/reserva
- Estrutura pronta para provider com MB Way/Multibanco
- Resend ou SMTP preparado para emails transacionais

## Instalação

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

## Ambiente

Copie `.env.example` para `.env.local` e preencha as chaves necessárias:

```bash
cp .env.example .env.local
```

Em produção, configure as mesmas variáveis no Cloudflare:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY` ou variáveis SMTP

## Supabase

1. Crie um projeto Supabase.
2. Execute `supabase/schema.sql` no SQL editor.
3. Execute `supabase/seed.sql` para dados iniciais.
4. Crie buckets privados:
   - `vehicle-images`
   - `booking-documents`
   - `handover-photos`
5. Configure as políticas de Storage para documentos visíveis apenas ao locatário da reserva e ao administrador.

O esquema inclui tabelas para `profiles`, `vehicles`, imagens, equipamentos, camas, preços, épocas, extras, bloqueios de disponibilidade, reservas, mensagens, documentos, pagamentos, cauções, avaliações, checklists, fotos, notas internas e configurações.

## Funcionalidades do MVP

- Página inicial turística e responsiva
- Listagem de autocaravanas com filtros visuais
- Página individual com galeria, características, condições e extras
- Calendário de disponibilidade com bloqueios
- Pedido de reserva com cálculo automático de preço
- Área do cliente com reservas, documentos e mensagens
- Área do proprietário com veículos, pedidos de reserva e estado de pagamentos
- Painel admin para veículos, reservas, calendário, documentos, pagamentos e configurações
- Painel admin para validar proprietários, gerir utilizadores e publicar/arquivar anúncios
- Validação Zod nas APIs
- Estrutura preparada para Supabase, Stripe, emails e uploads protegidos

## Rotas principais

- `/`
- `/autocaravanas`
- `/autocaravanas/[slug]`
- `/login`
- `/registo`
- `/cliente`
- `/cliente/reservas`
- `/cliente/documentos`
- `/cliente/mensagens`
- `/proprietario`
- `/proprietario/veiculos`
- `/proprietario/reservas`
- `/admin`
- `/admin/utilizadores`
- `/admin/veiculos`
- `/admin/reservas`
- `/admin/calendario`
- `/admin/documentos`
- `/admin/pagamentos`
- `/admin/configuracoes`

## APIs

- `POST /api/price`
- `POST /api/bookings`
- `PATCH /api/bookings/[id]/status`
- `POST /api/documents`
- `POST /api/messages`
- `POST /api/payments/checkout`
- `POST /api/auth/register`
- `POST /api/vehicles`

## Conta de administrador

Depois de configurar `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, crie a primeira conta admin:

```bash
ADMIN_EMAIL=admin@rotalivre.pt ADMIN_USERNAME=admin ADMIN_PASSWORD=adm123 ADMIN_NAME="Administrador" pnpm create-admin
```

O script cria a conta no Supabase Auth e grava o perfil `administrador` na base de dados.

Também pode definir uma password manual:

```bash
ADMIN_EMAIL=admin@rotalivre.pt ADMIN_PASSWORD="uma-password-forte" pnpm create-admin
```

Se criar manualmente um utilizador no Supabase Auth, atualize o perfil:

```sql
update profiles
set role = 'administrador', status = 'ativo'
where id = '<uuid-do-utilizador-admin>';
```

As contas de proprietário devem começar como `pendente`; o administrador valida o perfil de proprietário e publica os anúncios.

## Produção

O site usa Supabase para registos, autenticação, veículos e reservas quando as variáveis de ambiente estão configuradas. Os dados em `lib/sample-data.ts` servem apenas como fallback local sem Supabase.

## App Android

O site está preparado como app instalável em Android através de PWA:

1. Abra o site no Chrome do Android.
2. Toque no menu do Chrome.
3. Escolha `Adicionar à página inicial` ou `Instalar app`.

Também existe uma base para gerar uma APK em `android-webview`. Antes de gerar a APK, altere o URL em `android-webview/app/src/main/res/values/strings.xml` para o endereço real do site no Cloudflare. Depois abra a pasta `android-webview` no Android Studio e escolha `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.

## Dados de exemplo

O projeto inclui 3 autocaravanas:

- Serra Atlântica
- Costa Vicentina
- Douro Livre

Inclui também reservas, documentos e mensagens de exemplo no ficheiro `lib/sample-data.ts`.

## Próximas melhorias recomendadas

- Pagamentos online reais
- Assinatura digital avançada
- Geração automática de contrato PDF
- Integração WhatsApp
- Integração Google Calendar
- Sistema de cupões
- Área de manutenção da frota
- Estatísticas avançadas
