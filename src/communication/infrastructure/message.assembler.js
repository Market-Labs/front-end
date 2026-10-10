import { Message } from '../domain/model/message.entity.js';

export const MessageAssembler = {
  toEntity(resource) {
    return new Message({
      id: resource.id,
      sender: resource.sender || 'Sistema MarketGo',
      receiver: resource.receiver || 'Minimarket Verde Sur',
      subject: resource.subject || resource.title,
      body: resource.body || resource.message,
      read: resource.read,
      starred: resource.starred || false,
      sentAt: resource.sentAt || resource.createdAt,
    });
  },
};
