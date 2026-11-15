export class Message {
  constructor({
    id,
    sender = 'Sistema MarketGo',
    receiver = '',
    subject = 'Notificacion',
    body = '',
    read = false,
    starred = false,
    sentAt = '',
  } = {}) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.subject = subject;
    this.body = body;
    this.read = Boolean(read);
    this.starred = Boolean(starred);
    this.sentAt = sentAt;
  }

  isUnread() {
    return !this.read;
  }

  markAsRead() {
    this.read = true;
  }

  markAsUnread() {
    this.read = false;
  }

  toggleStarred() {
    this.starred = !this.starred;
  }

  toPlainObject() {
    return {
      id: this.id,
      sender: this.sender,
      receiver: this.receiver,
      subject: this.subject,
      body: this.body,
      read: this.read,
      starred: this.starred,
      sentAt: this.sentAt,
    };
  }
}
