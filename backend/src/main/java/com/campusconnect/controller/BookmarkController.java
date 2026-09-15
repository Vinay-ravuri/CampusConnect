package com.campusconnect.controller;

import com.campusconnect.entity.Bookmark;
import com.campusconnect.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getBookmarks(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(bookmarkService.getBookmarksForUser(userEmail));
    }

    @PostMapping
    public ResponseEntity<Bookmark> addBookmark(@AuthenticationPrincipal String userEmail, @RequestBody Map<String, String> body) {
        String targetType = body.get("targetType");
        String targetId = body.get("targetId");
        return ResponseEntity.ok(bookmarkService.addBookmark(userEmail, targetType, targetId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeBookmark(@AuthenticationPrincipal String userEmail, @PathVariable Long id) {
        bookmarkService.removeBookmark(id, userEmail);
        return ResponseEntity.ok(Map.of("message", "Bookmark removed successfully"));
    }
}
