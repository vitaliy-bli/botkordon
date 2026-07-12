# Kordon Bot — Transfer-Ready Package

Мета: коли покупець підпише LOI, ти за 1 вечір передаєш увесь стек так, щоб на наступний ранок він володіє продуктом повністю і твої особисті аккаунти залишаються твоїми.

---

## 0. Email strategy

Рекомендація: <b>один нейтральний email під усе</b> — <code>kordonbot.owner@gmail.com</code> (або будь-яка вільна варіація).

- Створюєш зараз → переприв'язуєш до нього всі сервіси нижче
- Твій <code>botkordon@gmail.com</code> залишається <b>тільки для sales/outbound</b> — не передається
- Твої особисті GitHub / Railway / Supabase / GCP аккаунти (де живуть інші проекти) — не чіпаємо
- При продажу передаєш пароль від kordonbot.owner@gmail — покупець змінює його першим ділом

Альтернатива (складніше): sales + ops два emails окремо. Використовуй якщо покупець критично вимагає, щоб ти НЕ бачив operations. Для більшості випадків — оверкіл.

---

## 1. Inventory — усі активи, що входять у продаж

### Код
| Актив | Де | Транзит |
|---|---|---|
| Border Bot repo (main) | github.com/vitaliy-bli/border-bot | GitHub transfer ownership |
| Border Bot repo (тест) | github.com/vitaliy-bli/border-bot-test | GitHub transfer ownership |
| Telegram listener | окремий репо (частина основного?) | + transfer |

### Інфраструктура
| Актив | Провайдер | Що передавати |
|---|---|---|
| Основний bot service | Railway (project border-bot) | Project ownership |
| Cron-парсери (3 шт: nakordoni-eu, granica-gov-pl, dpsu-map) | Railway (той самий project) | Разом з project |
| Telegram listener daemon | GCP (project border-bot-prod, VM border-tg-listener us-central1-a) | GCP project transfer |
| База даних + auth | Supabase (окремий project border-bot) | Supabase organization transfer |
| Static analytics beacon | n8n workflow (тільки для лендінгу — <b>НЕ передається</b>, зникає разом з лендінгом) | — |

### Telegram
| Актив | ID | Транзит |
|---|---|---|
| @NaKordon_bot (production) | 8952333365 | Через @BotFather → /transferbot |
| @NaKordon_test_bot | — | Через @BotFather → /transferbot |
| Telegram user accounts для listener (Python Telethon) | 4 сесії | Передати `.session` файли + API_ID/HASH |

### API-ключі (треба зробити fresh + видати покупцю)
- OpenRouter (Gemini 2.5 Flash — AI парсер)
- Deepgram (voice-to-text)
- ElevenLabs (text-to-speech)
- GraphHopper (routing/distances)
- Telegram Bot API (auto через BotFather transfer)
- Telegram MTProto (API_ID + API_HASH — my.telegram.org)

### Домени
- Свого домена нема. Лендінг <code>vitaliy-bli.github.io/botkordon</code> — НЕ входить у продаж, це sales tool
- <code>nakordoni.com.ua</code>, <code>nakordoni.eu</code> — це <b>чужі</b> джерела даних, не наші. Не передаємо

---

## 2. Pre-work checklist (що зробити ЗАРАЗ, до появи покупця)

Порядок важливий. Роби зверху вниз, ставлячи ✅ по мірі виконання.

### A. Створити handover email
- [ ] Створити <code>kordonbot.owner@gmail.com</code> (або варіант)
- [ ] Увімкнути 2FA + записати recovery codes у 1Password / KeePass
- [ ] Записати пароль у password manager (не у нотатках у телефоні)

### B. GitHub — додати kordonbot.owner як co-maintainer
- [ ] Прийняти invite на <code>kordonbot.owner@gmail.com</code>
- [ ] У repo `border-bot` → Settings → Collaborators → Add people → додати email/username → role Admin
- [ ] Аналогічно `border-bot-test`
- [ ] <b>Не transferring зараз</b> — тільки додаємо як admin, transfer робимо коли покупець прийде

### C. Railway — invite handover email у project
- [ ] Railway → Project border-bot → Settings → Members → Invite
- [ ] Роль Owner (щоб міг переслати далі)
- [ ] Прийняти invite з нового email

### D. Supabase — invite handover email в organization
- [ ] Supabase → Organization Settings → Members → Invite
- [ ] Роль Owner
- [ ] Прийняти invite з нового email

### E. GCP — invite handover email у project
- [ ] GCP → IAM → Grant Access → додати kordonbot.owner
- [ ] Роль Owner
- [ ] Прийняти invite з нового email

### F. Telegram — підготовка до /transferbot
Транзит через BotFather потребує щоб <b>обидва акаунти</b> були 2FA-active і мали recent activity.
- [ ] Створити Telegram account з номером, який залишиться після продажу (нейтральний номер)
- [ ] Увімкнути 2FA
- [ ] Додати цей аккаунт як admin у @NaKordon_bot (через /mybots → Bot Settings → Admins), логінитись
- [ ] Мати цю сесію активною хоча б 24 години перед /transferbot

### G. API-ключі — окремі для передачі
Зараз ключі, ймовірно, прив'язані до твоїх аккаунтів на кожному провайдері. Плану дві:

Варіант 1 (простіше): при трансфері <b>ти сам логінишся, генеруєш новий ключ у своєму аккаунті, віддаєш покупцю</b>. Він потім переєднує на свій аккаунт коли зручно. Ти закриваєш свій ключ на 30 день advisory-періоду.

Варіант 2 (чистіше): створити акаунти на handover email одразу зараз, згенерувати ключі, підмінити у Railway env. Тоді при трансфері нічого не змінюється, покупець отримує вже готові аккаунти.

Рекомендую <b>варіант 2</b> для:
- OpenRouter (сама грошова стаття, треба чистий billing)
- Deepgram (аналогічно)
- ElevenLabs (аналогічно)

Варіант 1 ок для:
- GraphHopper (free tier, малі витрати)
- Telegram MTProto (my.telegram.org — прив'язка до Telegram акаунта)

Checklist:
- [ ] OpenRouter: створити акаунт на kordonbot.owner@gmail, згенерувати key, замінити у Railway env `OPENROUTER_API_KEY`
- [ ] Deepgram: те саме → `DEEPGRAM_API_KEY`
- [ ] ElevenLabs: те саме → `ELEVENLABS_API_KEY`
- [ ] Перевірити що бот працює 24 години з новими ключами
- [ ] Пополнити баланс на кожному сервісі на 30 днів (щоб не відлетіло під час трансферу)

### H. Documentation — написати RUNBOOK
На лендінгу обіцяв «RUNBOOK з операційними процедурами». Треба реально написати. Мінімум:
- [ ] Як задеплоїти новий код (Railway push flow)
- [ ] Як подивитися логи (Railway logs, GCP logs)
- [ ] Як додати новий КПП (структура даних + parser)
- [ ] Як реагувати на incident (парсер впав, бот не відповідає)
- [ ] Опис env-змінних (що робить кожна)
- [ ] Опис таблиць БД (15 таблиць, RLS)
- [ ] Схема оновлення даних (30 хв, 3 джерела)
- [ ] AI-парсер: правила + известные edge cases

Файл: <code>~/projects/border-bot/RUNBOOK.md</code>

---

## 3. Buyer handover — runbook на день трансферу

Коли покупець підпише документи, ось порядок дій на 2-3 години:

### Step 1 — Комунікація (5 хв)
- [ ] Отримати від покупця: email їхнього нового owner аккаунта (для GitHub/Railway/Supabase/GCP invite), Telegram username їхньої особи-приймальника (для BotFather /transferbot)

### Step 2 — GitHub transfer (10 хв)
- [ ] Repo `border-bot` → Settings → General → Danger Zone → Transfer ownership → ввести username покупця
- [ ] Аналогічно `border-bot-test`
- [ ] Підтвердити email

### Step 3 — Railway transfer (10 хв)
- [ ] Project border-bot → Settings → Transfer project → ввести team покупця
- [ ] Переконатися що всі 4 сервіси (bot + 3 парсери) перейшли

### Step 4 — Supabase transfer (10 хв)
- [ ] Organization → Settings → General → Transfer ownership
- [ ] Спрацює тільки якщо покупець вже прийняв invite як member

### Step 5 — GCP project transfer (15 хв)
- [ ] IAM → надати purchaser email роль Owner
- [ ] Removing свій owner-role
- [ ] Purchaser'у: змінити billing на свій account

### Step 6 — Telegram bot transfer (10 хв)
- [ ] @BotFather → /mybots → @NaKordon_bot → Transfer Ownership
- [ ] Вибрати новий власник (він має бути у Telegram і мати 2FA)
- [ ] Аналогічно для @NaKordon_test_bot

### Step 7 — Handover email (5 хв)
- [ ] Змінити пароль <code>kordonbot.owner@gmail.com</code> на новий
- [ ] Передати покупцю через захищений канал: пароль + recovery codes + мнемоніка 2FA
- [ ] Порекомендувати покупцю змінити пароль першим ділом

### Step 8 — API keys (15 хв)
- [ ] На OpenRouter/Deepgram/ElevenLabs: увійти у аккаунт з <code>kordonbot.owner</code>
- [ ] Додати purchaser email як owner (якщо провайдер дозволяє transfer) або передати логін-пароль
- [ ] Purchaser відв'язує billing card, підв'язує свою

### Step 9 — .env файл + secrets (10 хв)
- [ ] Копія <code>.env.production</code> у Railway → Environment Variables
- [ ] Копія Supabase service_key
- [ ] Копія Telegram BOT_TOKEN
- [ ] Копія Google Service Account JSON (якщо використовується)
- [ ] Надіслати покупцю через 1Password shared vault або аналог

### Step 10 — Live handover call (30-60 хв)
- [ ] Screen-share показ де що: Railway dashboard, Supabase, GCP, GitHub
- [ ] Прогонка одного incident (наприклад: підняти впалий парсер вручну)
- [ ] Показати як подивитися метрики (users, revenue, парсер health)
- [ ] Q&A

### Step 11 — Advisory period (30 днів)
- [ ] Створити shared Telegram-чат або Slack channel з тобою + purchaser + їхнім engineer
- [ ] SLA на відповідь: 24 години робочих днів
- [ ] Логувати всі питання у shared doc — потенційно доповниш RUNBOOK

### Step 12 — Warranty period (60 днів)
- [ ] Моніторити metrics (тихо, з боку)
- [ ] Якщо станеться critical bug — виправляєш безкоштовно
- [ ] Post-warranty — ти абсолютно out

---

## 4. Що НЕ входить в трансфер (важливо явно сказати)

- <code>botkordon@gmail.com</code> — sales email, залишається у тебе
- <code>vitaliy-bli.github.io/botkordon</code> — лендінг, sales tool, не передається
- Всі UTM-tracking (n8n workflow "Kordon Bot Landing Tracker") — sales infrastructure
- CSV з outreach контактами страхових — це твоя робота у sales pipeline
- @mymailtrackerbot нотифікації — sales tool
- DigitalOcean droplet `constructor-vitaliy` — це інша інфра (AI-асистент, code-tunnel), не border-bot

Явно згадай це у Asset Purchase Agreement, щоб не було спорів.

---

## 5. Legal templates до підготовки

Ще не готово. Коли з'явиться реальний покупець:
- [ ] NDA (Ukrainian + English) — типовий mutual NDA для M&A
- [ ] LOI (Letter of Intent) — non-binding, з ціною і закритими днями
- [ ] Asset Purchase Agreement — головний контракт, треба юрист
- [ ] IP assignment — окремо для коду та бренду
- [ ] Employee non-solicit (якщо ти маєш команду)

Не парся зараз — це працює по потребі. Юрист коштує $500-2000 за pack, підключається після LOI.

---

## 6. Progress tracker

Використай цей файл як live-checklist. Ставиш [x] по мірі виконання.

<b>Що робити далі:</b>
1. Створи handover email (Section 2.A) — 15 хв
2. Пройди Sections 2.B-2.F (додати новий email як co-owner) — 30 хв
3. Sections 2.G, 2.H (API keys + RUNBOOK) — це може зайняти вечір, роби по мірі часу
4. Section 3 не робимо доки нема реального покупця
