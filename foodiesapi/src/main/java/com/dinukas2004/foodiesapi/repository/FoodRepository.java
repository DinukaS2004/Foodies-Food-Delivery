package com.dinukas2004.foodiesapi.repository;

import com.dinukas2004.foodiesapi.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends MongoRepository <FoodEntity, String> {
}
