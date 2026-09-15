package com.campusconnect.service;

import com.campusconnect.entity.Bookmark;
import com.campusconnect.repository.BookmarkRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    public List<Bookmark> getBookmarksForUser(String userEmail) {
        return bookmarkRepository.findByUserEmail(userEmail);
    }

    public Bookmark addBookmark(String userEmail, String targetType, String targetId) {
        Optional<Bookmark> existing = bookmarkRepository.findByUserEmailAndTargetTypeAndTargetId(userEmail, targetType, targetId);
        if (existing.isPresent()) {
            return existing.get();
        }
        Bookmark bookmark = new Bookmark(userEmail, targetType, targetId);
        return bookmarkRepository.save(bookmark);
    }

    public void removeBookmark(Long id, String userEmail) {
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookmark not found"));
        if (!bookmark.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized to remove this bookmark");
        }
        bookmarkRepository.delete(bookmark);
    }
}
