package com.campusconnect.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AiChatService {

    private final GeminiService geminiService;

    public AiChatService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public Map<String, Object> chat(List<Map<String, String>> history, String userMessage, String contextInfo) {
        String reply = null;

        if (geminiService.hasApiKey()) {
            reply = geminiService.generateChatResponse(history, userMessage, contextInfo);
        }

        if (reply == null || reply.isBlank()) {
            reply = generateRobustChatReply(userMessage, contextInfo);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reply", reply);
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private String generateRobustChatReply(String userMessage, String contextInfo) {
        String q = userMessage.toLowerCase().trim();

        if (q.contains("interface") || q.contains("abstract class")) {
            return "### 📘 Java Interfaces vs Abstract Classes\n\n" +
                   "In Java, both **Interfaces** and **Abstract Classes** achieve abstraction, but they serve distinct architectural purposes:\n\n" +
                   "| Feature | Interface | Abstract Class |\n" +
                   "| :--- | :--- | :--- |\n" +
                   "| **Multiple Inheritance** | Yes (`implements A, B`) | No (Single inheritance only) |\n" +
                   "| **State / Fields** | `public static final` constants only | Can have instance variables |\n" +
                   "| **Methods** | `abstract`, `default`, `static` (Java 8+) | Abstract & concrete methods |\n" +
                   "| **Constructors** | None | Yes, invoked via `super()` |\n\n" +
                   "#### 💡 Code Example:\n" +
                   "```java\n" +
                   "// Defines a contract without state\n" +
                   "public interface PaymentService {\n" +
                   "    boolean processPayment(double amount);\n" +
                   "    default void logReceipt() {\n" +
                   "        System.out.println(\"Payment logged.\");\n" +
                   "    }\n" +
                   "}\n" +
                   "```\n\n" +
                   "> **🎯 Interview Tip:** Interviewers often ask *'When would you pick an abstract class over an interface?'*. The answer: Choose an **abstract class** when subclasses share common state or internal helper logic; choose an **interface** when defining a capability/contract across unrelated classes.";
        }

        if (q.contains("spring boot") || q.contains("spring")) {
            return "### 🍃 Spring Boot Architecture & Key Concepts\n\n" +
                   "**Spring Boot** streamlines Java enterprise development through three core pillars:\n\n" +
                   "1. **Auto-Configuration (`@EnableAutoConfiguration`)**: Scans classpaths and auto-configures beans (e.g. DataSource, Jackson, DispatcherServlet).\n" +
                   "2. **Embedded Servers**: Bundles Tomcat / Jetty so apps run as standalone JARs (`java -jar app.jar`).\n" +
                   "3. **Starter Dependencies (`spring-boot-starter-*`)**: Aggregates verified, conflict-free dependency versions.\n\n" +
                   "#### 🚀 Standard 3-Tier Layering in CampusConnect:\n" +
                   "```\n" +
                   "Client Request -> Controller (@RestController) \n" +
                   "                     -> Service (@Service) [Business Logic & @Transactional]\n" +
                   "                     -> Repository (@Repository / JpaRepository)\n" +
                   "                     -> Database (PostgreSQL / H2)\n" +
                   "```\n\n" +
                   "> **🎯 Interview Tip:** Always mention `@Transactional` rollback behavior: by default, Spring rolls back on unchecked (`RuntimeException` and `Error`), but **not** on checked exceptions unless configured with `@Transactional(rollbackFor = Exception.class)`.";
        }

        if (q.contains("resume") || q.contains("ats")) {
            return "### 📄 High-Impact ATS Resume Strategy\n\n" +
                   "For engineering campus placements in India (TCS, Infosys, Amazon, Microsoft):\n\n" +
                   "- **Use Clean Hierarchy**: Single-column layout, standard headings (`Summary`, `Technical Skills`, `Projects`, `Education`, `Certifications`).\n" +
                   "- **Quantify Project Bullets**: Apply Google's XYZ formula: *'Accomplished [X], measured by [Y], by doing [Z]'*.\n" +
                   "  - ❌ *Weak:* 'Created a campus portal with React and Java.'\n" +
                   "  - ✅ *Strong:* 'Architected a responsive campus portal using React, Spring Boot, and PostgreSQL, serving 1,200+ students with sub-100ms API response times.'\n" +
                   "- **Hard Skills Over Soft Words**: List actual technologies (`Java 17`, `Spring Boot`, `React.js`, `Docker`, `SQL`, `Git`) instead of buzzwords like 'fast learner'.\n\n" +
                   "> **🎯 Next Step:** Head over to our **AI Resume Score Checker** above to get your real ATS score and bullet-by-bullet improvement suggestions!";
        }

        if (q.contains("interview") || q.contains("mock")) {
            return "### 🎙️ Cracking Technical & Behavioral Interviews\n\n" +
                   "Here are the four phases recruiters look for:\n\n" +
                   "1. **Self-Introduction (First 90 seconds)**: Name, academic branch, your core tech superpower (e.g. Java & backend systems), 1 standout project (CampusConnect), and career ambition.\n" +
                   "2. **DSA & Problem Solving**: Think out loud, clarify constraints, start with brute force, then optimize time/space complexity before coding.\n" +
                   "3. **System & Project Deep-Dive**: Be ready to justify every technology choice. E.g., *'Why PostgreSQL over MongoDB?'*, *'How did you secure JWT tokens?'*.\n" +
                   "4. **Behavioral (STAR Method)**: Situation, Task, Action, Result for leadership and teamwork questions.\n\n" +
                   "> **🎯 Try It Now:** Launch our **AI Mock Interview** above for a voice-to-voice simulation tailored to your target role!";
        }

        return "### 🤖 CampusConnect Career Intelligence\n\n" +
               "I'm here to assist your engineering placement journey. You asked:\n\n" +
               "> *\"" + userMessage + "\"*\n\n" +
               "Here are tailored guidelines for your preparation:\n\n" +
               "- **Core Engineering Focus**: Ensure a strong balance between **DSA problem solving** (LeetCode patterns: Two Pointers, Trees, Dynamic Programming) and **practical full-stack projects**.\n" +
               "- **Production Best Practices**: When presenting your projects to recruiters, emphasize code modularity, API error handling, and database indexing.\n" +
               "- **Continuous Feedback**: Use the **AI Skill Checker** to test your role readiness and discover missing skills for top hiring companies.\n\n" +
               "Feel free to ask me to explain any technical topic (e.g., *'Explain DBMS Indexing'*, *'How does Redis caching work?'*, or *'Give me an interview question on Java Multithreading'*).";
    }
}
