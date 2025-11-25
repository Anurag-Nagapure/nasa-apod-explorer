package com.nasa.apod.controller;

import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.CrossOrigin;


import com.nasa.apod.model.ApodResponse;
import com.nasa.apod.service.NasaApodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/apod")
public class ApodController {

    private final NasaApodService nasaApodService;

    public ApodController(NasaApodService nasaApodService) {
        this.nasaApodService = nasaApodService;
    }

    @GetMapping("/today")
    public ApodResponse getTodayApod() {
        return nasaApodService.getApodForToday();
    }

    @GetMapping
    public ApodResponse getApodByDate(@RequestParam("date") String date) {
        // date expected in format YYYY-MM-DD
        return nasaApodService.getApodByDate(date);
    }

    @GetMapping("/recent")
    public List<ApodResponse> getRecentApods(@RequestParam(name = "days", defaultValue = "10") int days) {
        // limit max days to avoid abusing NASA API
        if (days > 30) {
            days = 30;
        } else if (days < 1) {
            days = 1;
        }
        return nasaApodService.getRecentApods(days);
    }

}

