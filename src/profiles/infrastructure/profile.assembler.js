import { Profile } from '../domain/model/profile.entity.js';

export const ProfileAssembler = {
  toEntity(resource) {
    return new Profile(resource);
  },
};
