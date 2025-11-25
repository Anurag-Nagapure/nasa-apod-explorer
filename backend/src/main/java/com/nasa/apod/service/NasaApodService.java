package com.nasa.apod.service;

import com.nasa.apod.model.ApodResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class NasaApodService {

    @Value("${nasa.apod.base-url}")
    private String baseUrl;

    @Value("${nasa.apod.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // Cache config
    private static final int MAX_CACHE_SIZE = 50;
    private static final long CACHE_TTL_MILLIS = 60 * 60 * 1000; // 60 minutes

    // Cache entry structure
    private static class CacheEntry {
        private final ApodResponse data;
        private final long cachedAtMillis;

        public CacheEntry(ApodResponse data, long cachedAtMillis) {
            this.data = data;
            this.cachedAtMillis = cachedAtMillis;
        }

        public ApodResponse getData() {
            return data;
        }

        public long getCachedAtMillis() {
            return cachedAtMillis;
        }
    }

    // LinkedHashMap with removal policy for max size
    private final Map<String, CacheEntry> cache = new LinkedHashMap<String, CacheEntry>(16, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<String, CacheEntry> eldest) {
            return size() > MAX_CACHE_SIZE;
        }
    };


    public ApodResponse getApodForToday() {
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DateTimeFormatter.ISO_DATE);
        return getApodByDate(dateStr);
    }

    public ApodResponse getApodByDate(String date) {
        // 1) Try cache first
        ApodResponse cached = getFromCache(date);
        if (cached != null) {
            return cached;
        }

        // 2) If not in cache, call NASA API
        String url = String.format("%s?api_key=%s&date=%s", baseUrl, apiKey, date);
        ApodResponse response = restTemplate.getForObject(url, ApodResponse.class);

        // 3) Store in cache
        putInCache(date, response);

        return response;
    }


    private boolean isExpired(CacheEntry entry) {
        long now = System.currentTimeMillis();
        return (now - entry.getCachedAtMillis()) > CACHE_TTL_MILLIS;
    }

    private ApodResponse getFromCache(String date) {
        synchronized (cache) {
            CacheEntry entry = cache.get(date);
            if (entry == null) {
                return null;
            }
            if (isExpired(entry)) {
                cache.remove(date);
                return null;
            }
            return entry.getData();
        }
    }

    private void putInCache(String date, ApodResponse response) {
        if (response == null) {
            return;
        }
        synchronized (cache) {
            cache.put(date, new CacheEntry(response, System.currentTimeMillis()));
        }
    }

    public List<ApodResponse> getRecentApods(int days) {
        List<ApodResponse> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < days; i++) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_DATE);
            ApodResponse apod = getApodByDate(dateStr);
            if (apod != null) {
                result.add(apod);
            }
        }

        return result;
    }


}

