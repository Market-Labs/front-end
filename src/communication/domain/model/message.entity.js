export class Message {
  constructor({ id, sender, receiver, subject, body, read = false, starred = false, sentAt }) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.subject = subject;
    this.body = body;
    this.read = read;
    this.starred = starred;
    this.sentAt = sentAt;
  }

  markAsRead() {
    this.read = true;
  }

  toggleStarred() {
    this.starred = !this.starred;
  }
}
