package com.travel.backend.repository;

import com.travel.backend.entity.BusService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusServiceRepository extends JpaRepository<BusService, Long> {
    boolean existsByName(String name);
}
