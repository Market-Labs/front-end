import { Message } from '../domain/model/message.entity.js';

export const MessageAssembler = {
  toEntity(resource) {
    return new Message(resource);
  },
};
