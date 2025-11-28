# CineMax - Parte 2: Assentos, Pagamento e Notificações

## 📋 Novos Models

### **Seat.js (Assentos)**

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id'
    }
  },
  seatNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Ex: A1, B5, C10'
  },
  row: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: 'Linha: A, B, C...'
  },
  column: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Coluna: 1, 2, 3...'
  },
  type: {
    type: DataTypes.ENUM('normal', 'vip', 'acessivel'),
    defaultValue: 'normal'
  }
}, {
  tableName: 'seats',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['roomId', 'seatNumber']
    }
  ]
});

// Relacionamentos
Seat.associate = (models) => {
  Seat.belongsTo(models.Room, {
    foreignKey: 'roomId',
    as: 'room'
  });
};

module.exports = Seat;
```

---

### **Ticket.js (Atualizado)**

**O QUE ARMAZENA:**
- Sessão do ingresso
- Assento selecionado
- Tipo de ingresso (inteira/meia/estudante)
- Dados do cliente (nome, email, telefone)
- Status (pendente/pago/cancelado)
- Código único do ingresso

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sessions',
      key: 'id'
    }
  },
  seatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'seats',
      key: 'id'
    }
  },
  ticketType: {
    type: DataTypes.ENUM('inteira', 'meia', 'estudante'),
    defaultValue: 'inteira'
  },
  customerName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Formato: (11) 98765-4321'
  },
  customerCpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
    comment: 'Formato: 123.456.789-00'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
    defaultValue: 'pendente'
  },
  ticketCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Código único do ingresso'
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tickets',
  timestamps: true
});

// Relacionamentos
Ticket.associate = (models) => {
  Ticket.belongsTo(models.Session, {
    foreignKey: 'sessionId',
    as: 'session'
  });
  
  Ticket.belongsTo(models.Seat, {
    foreignKey: 'seatId',
    as: 'seat'
  });
  
  Ticket.hasOne(models.Payment, {
    foreignKey: 'ticketId',
    as: 'payment'
  });
};

module.exports = Ticket;
```

---

### **Payment.js (Pagamento)**

**O QUE ARMAZENA:**
- Ingresso relacionado
- Método de pagamento
- Dados do cartão (últimos 4 dígitos)
- Valor total
- Status da transação
- Data/hora do pagamento

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  paymentMethod: {
    type: DataTypes.ENUM('credito', 'debito', 'pix'),
    allowNull: false
  },
  cardBrand: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Visa, Mastercard, Elo, etc'
  },
  cardLastDigits: {
    type: DataTypes.STRING(4),
    allowNull: true,
    comment: 'Últimos 4 dígitos do cartão'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'recusado', 'estornado'),
    defaultValue: 'pendente'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'ID da transação do gateway de pagamento'
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
});

// Relacionamentos
Payment.associate = (models) => {
  Payment.belongsTo(models.Ticket, {
    foreignKey: 'ticketId',
    as: 'ticket'
  });
};

module.exports = Payment;
```

---

## 🛠️ Utils e Validações

### **utils/validators.js**

**VALIDAÇÕES DE CARTÃO:**

```javascript
class Validators {
  // Validar número do cartão (Algoritmo de Luhn)
  static validateCardNumber(cardNumber) {
    // Remove espaços e hífens
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Verifica se tem apenas números
    if (!/^\d+$/.test(cleaned)) {
      return { valid: false, message: 'Número do cartão inválido' };
    }
    
    // Verifica tamanho (13-19 dígitos)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return { valid: false, message: 'Número do cartão deve ter entre 13 e 19 dígitos' };
    }
    
    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    const valid = sum % 10 === 0;
    return { 
      valid, 
      message: valid ? 'Cartão válido' : 'Número do cartão inválido'
    };
  }
  
  // Identificar bandeira do cartão
  static getCardBrand(cardNumber) {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      elo: /^(4011|4312|4389|4514|4576|5041|5066|5067|6277|6362|6363|6504|6505|6516)/,
      hipercard: /^(3841|6062)/,
      discover: /^6(?:011|5)/
    };
    
    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleaned)) {
        return brand;
      }
    }
    
    return 'desconhecida';
  }
  
  // Validar CVV
  static validateCVV(cvv, cardBrand) {
    const cvvLength = cardBrand === 'amex' ? 4 : 3;
    const regex = new RegExp(`^\\d{${cvvLength}}$`);
    
    return {
      valid: regex.test(cvv),
      message: regex.test(cvv) ? 'CVV válido' : `CVV deve ter ${cvvLength} dígitos`
    };
  }
  
  // Validar data de validade
  static validateExpiryDate(month, year) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    // Verifica formato
    if (expMonth < 1 || expMonth > 12) {
      return { valid: false, message: 'Mês inválido' };
    }
    
    // Verifica se não está vencido
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return { valid: false, message: 'Cartão vencido' };
    }
    
    return { valid: true, message: 'Data válida' };
  }
  
  // Validar CPF
  static validateCPF(cpf) {
    const cleaned = cpf.replace(/[^\d]/g, '');
    
    if (cleaned.length !== 11) {
      return { valid: false, message: 'CPF deve ter 11 dígitos' };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleaned)) {
      return { valid: false, message: 'CPF inválido' };
    }
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    if (digit !== parseInt(cleaned[9])) {
      return { valid: false, message: 'CPF inválido' };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    if (digit !== parseInt(cleaned[10])) {
      return { valid: false, message: 'CPF inválido' };
    }
    
    return { valid: true, message: 'CPF válido' };
  }
  
  // Validar telefone
  static validatePhone(phone) {
    const cleaned = phone.replace(/[^\d]/g, '');
    
    // Aceita 10 ou 11 dígitos (com ou sem 9 no celular)
    const regex = /^(\d{2})(\d{4,5})(\d{4})$/;
    
    return {
      valid: regex.test(cleaned),
      message: regex.test(cleaned) ? 'Telefone válido' : 'Telefone inválido'
    };
  }
}

module.exports = Validators;
```

---

## 📧 Services de Notificação

### **services/EmailService.js**

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  async sendTicket(ticket, session, movie, seat) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: ticket.customerEmail,
      subject: `Seu ingresso para ${movie.title} - CineMax`,
      html: this.generateTicketHTML(ticket, session, movie, seat)
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${ticket.customerEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  }
  
  generateTicketHTML(ticket, session, movie, seat) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .ticket { border: 2px solid #333; padding: 20px; max-width: 600px; }
          .header { background: #ff6b6b; color: white; padding: 15px; text-align: center; }
          .info { margin: 20px 0; }
          .qrcode { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>🎬 CineMax</h1>
            <h2>Seu Ingresso</h2>
          </div>
          <div class="info">
            <p><strong>Filme:</strong> ${movie.title}</p>
            <p><strong>Data:</strong> ${session.sessionDate}</p>
            <p><strong>Horário:</strong> ${session.sessionTime}</p>
            <p><strong>Sala:</strong> ${session.room.name}</p>
            <p><strong>Assento:</strong> ${seat.seatNumber}</p>
            <p><strong>Tipo:</strong> ${ticket.ticketType}</p>
            <p><strong>Código:</strong> ${ticket.ticketCode}</p>
          </div>
          <div class="qrcode">
            <p>Apresente este código na entrada:</p>
            <h2>${ticket.ticketCode}</h2>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
```

---

### **services/SmsService.js**

```javascript
// Exemplo usando Twilio (você pode usar outro provedor)
const twilio = require('twilio');

class SmsService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }
  
  async sendTicket(ticket, session, movie, seat) {
    const message = this.generateTicketMessage(ticket, session, movie, seat);
    
    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: ticket.customerPhone
      });
      
      console.log(`SMS enviado para ${ticket.customerPhone}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return { success: false, error: error.message };
    }
  }
  
  generateTicketMessage(ticket, session, movie, seat) {
    return `
🎬 CineMax - Seu Ingresso

Filme: ${movie.title}
Data: ${session.sessionDate}
Horário: ${session.sessionTime}
Assento: ${seat.seatNumber}
Código: ${ticket.ticketCode}

Apresente este código na entrada!
    `.trim();
  }
}

module.exports = new SmsService();
```

---

## 🎮 Controllers Atualizados

### **SeatController.js**

```javascript
const { Seat, Room, Ticket, Session } = require('../models');

class SeatController {
  // GET /seats?sessionId=1 - Buscar assentos disponíveis
  async getAvailableSeats(req, res) {
    try {
      const { sessionId } = req.query;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId é obrigatório' });
      }
      
      // Buscar sessão
      const session = await Session.findByPk(sessionId, {
        include: [{ model: Room, as: 'room' }]
      });
      
      if (!session) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      // Buscar todos os assentos da sala
      const seats = await Seat.findAll({
        where: { roomId: session.roomId }
      });
      
      // Buscar assentos ocupados nesta sessão
      const occupiedSeats = await Ticket.findAll({
        where: { 
          sessionId,
          status: ['pendente', 'pago']
        },
        attributes: ['seatId']
      });
      
      const occupiedSeatIds = occupiedSeats.map(t => t.seatId);
      
      // Marcar assentos como disponíveis ou ocupados
      const seatsWithStatus = seats.map(seat => ({
        ...seat.toJSON(),
        available: !occupiedSeatIds.includes(seat.id)
      }));
      
      return res.json(seatsWithStatus);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SeatController();
```

---

### **PaymentController.js**

```javascript
const { Payment, Ticket, Session, Movie, Seat } = require('../models');
const Validators = require('../utils/validators');
const EmailService = require('../services/EmailService');
const SmsService = require('../services/SmsService');
const sequelize = require('../database');

class PaymentController {
  // POST /payments - Processar pagamento
  async processPayment(req, res) {
    const t = await sequelize.transaction();
    
    try {
      const {
        ticketId,
        paymentMethod,
        cardNumber,
        cardHolderName,
        expiryMonth,
        expiryYear,
        cvv,
        notificationMethod // 'email', 'sms' ou 'both'
      } = req.body;
      
      // Buscar ingresso
      const ticket = await Ticket.findByPk(ticketId, {
        include: [
          { 
            model: Session, 
            as: 'session',
            include: [{ model: Movie, as: 'movie' }]
          },
          { model: Seat, as: 'seat' }
        ],
        transaction: t
      });
      
      if (!ticket) {
        await t.rollback();
        return res.status(404).json({ error: 'Ingresso não encontrado' });
      }
      
      if (ticket.status === 'pago') {
        await t.rollback();
        return res.status(400).json({ error: 'Ingresso já foi pago' });
      }
      
      // Validar cartão
      if (paymentMethod === 'credito' || paymentMethod === 'debito') {
        const cardValidation = Validators.validateCardNumber(cardNumber);
        if (!cardValidation.valid) {
          await t.rollback();
          return res.status(400).json({ error: cardValidation.message });
        }
        
        const cvvValidation = Validators.validateCVV(cvv, Validators.getCardBrand(cardNumber));
        if (!cvvValidation.valid) {
          await t.rollback();
          return res.status(400).json({ error: cvvValidation.message });
        }
        
        const expiryValidation = Validators.validateExpiryDate(expiryMonth, expiryYear);
        if (!expiryValidation.valid) {
          await t.rollback();
          return res.status(400).json({ error: expiryValidation.message });
        }
      }
      
      // Criar pagamento
      const cardBrand = Validators.getCardBrand(cardNumber);
      const lastDigits = cardNumber.replace(/[\s-]/g, '').slice(-4);
      
      const payment = await Payment.create({
        ticketId,
        paymentMethod,
        cardBrand,
        cardLastDigits: lastDigits,
        amount: ticket.price,
        status: 'aprovado', // Em produção, integrar com gateway real
        transactionId: `TXN${Date.now()}`,
        paidAt: new Date()
      }, { transaction: t });
      
      // Atualizar status do ingresso
      await ticket.update({ status: 'pago' }, { transaction: t });
      
      await t.commit();
      
      // Enviar notificações
      const notifications = [];
      
      if (notificationMethod === 'email' || notificationMethod === 'both') {
        const emailResult = await EmailService.sendTicket(
          ticket, 
          ticket.session, 
          ticket.session.movie, 
          ticket.seat
        );
        notifications.push({ type: 'email', ...emailResult });
      }
      
      if (notificationMethod === 'sms' || notificationMethod === 'both') {
        const smsResult = await SmsService.sendTicket(
          ticket, 
          ticket.session, 
          ticket.session.movie, 
          ticket.seat
        );
        notifications.push({ type: 'sms', ...smsResult });
      }
      
      // Atualizar flag de notificação
      await ticket.update({ notificationSent: true });
      
      return res.json({
        message: 'Pagamento aprovado!',
        payment,
        ticket,
        notifications
      });
      
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
```

---

## 🔄 Fluxo Completo de Compra

```
1. Cliente acessa o site
   GET /api/movies
   → Lista filmes em cartaz

2. Cliente escolhe filme
   GET /api/sessions?movieId=1&date=2025-11-28
   → Lista sessões disponíveis

3. Cliente escolhe sessão
   GET /api/seats?sessionId=5
   → Mostra mapa de assentos (disponíveis/ocupados)

4. Cliente seleciona assentos e tipo de ingresso
   POST /api/tickets
   Body: {
     sessionId: 5,
     seatId: 42,
     ticketType: "meia",
     customerName: "João Silva",
     customerEmail: "joao@email.com",
     customerPhone: "(11) 98765-4321",
     customerCpf: "123.456.789-00"
   }
   → Cria ingresso com status "pendente"
   → Reserva assento temporariamente

5. Cliente preenche dados de pagamento
   POST /api/payments
   Body: {
     ticketId: 1,
     paymentMethod: "credito",
     cardNumber: "4111 1111 1111 1111",
     cardHolderName: "JOAO SILVA",
     expiryMonth: "12",
     expiryYear: "2025",
     cvv: "123",
     notificationMethod: "both"
   }
   → Valida cartão (regex + Luhn)
   → Processa pagamento
   → Atualiza status para "pago"
   → Envia ingresso por email E SMS

6. Cliente recebe confirmação
   → Email com ingresso em HTML
   → SMS com código do ingresso
   → Código único para apresentar na entrada
```

---

## 📝 Variáveis de Ambiente (.env)

```env
# Servidor
PORT=8000

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=cinemax_dev

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
SMTP_FROM=CineMax <noreply@cinemax.com>

# SMS (Twilio)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+5511999999999
```

---

## 📦 Dependências Adicionais

```bash
npm install nodemailer twilio
```

---

Este guia completo cobre todo o fluxo de compra de ingressos com validação de cartão e envio de notificações! 🎬🍿
