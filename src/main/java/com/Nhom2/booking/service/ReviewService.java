package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Review;
import com.Nhom2.booking.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repository;

    public List<Review> getAll() {
        return repository.findAll();
    }

    public Review save(Review entity) {
        return repository.save(entity);
    }
}
