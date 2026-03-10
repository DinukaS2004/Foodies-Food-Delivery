package com.dinukas2004.foodiesapi.repository;

import com.dinukas2004.foodiesapi.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository <UserEntity,String> {
    Optional <UserEntity> findByEmail (String email);

    String email(String email);
}
