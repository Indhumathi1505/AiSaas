package com.nexus.ai.repository;

import com.nexus.ai.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserProfile, String> {
}
