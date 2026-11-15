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

  markAsRead() {
    this.read = true;
  }

  markAsUnread() {
    this.read = false;
  }

  toggleStarred() {
    this.starred = !this.starred;
  }
}
