package com.shopeasy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
    
    public String saveFile(MultipartFile file, String subFolder) {
        try {
            
            Path dirPath = Paths.get(UPLOAD_DIR + subFolder);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(filename);
            file.transferTo(filePath.toFile());
            
            return System.getProperty("user.dir") + "/uploads/" + subFolder + "/" + filename;
        } catch (IOException e) {
            log.error("File upload failed: {}", e.getMessage());
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}
