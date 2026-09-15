package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RegulationRepository regulationRepository;
    private final SubjectRepository subjectRepository;
    private final UnitRepository unitRepository;
    private final ResourceRepository resourceRepository;
    private final PlacementResourceRepository placementResourceRepository;
    private final PlacementTrackRepository placementTrackRepository;
    private final PlacementQuestionRepository placementQuestionRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RegulationRepository regulationRepository,
                      SubjectRepository subjectRepository, UnitRepository unitRepository,
                      ResourceRepository resourceRepository, PlacementResourceRepository placementResourceRepository,
                      PlacementTrackRepository placementTrackRepository, PlacementQuestionRepository placementQuestionRepository,
                      CompanyRepository companyRepository, JobRepository jobRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.regulationRepository = regulationRepository;
        this.subjectRepository = subjectRepository;
        this.unitRepository = unitRepository;
        this.resourceRepository = resourceRepository;
        this.placementResourceRepository = placementResourceRepository;
        this.placementTrackRepository = placementTrackRepository;
        this.placementQuestionRepository = placementQuestionRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try { seedUsers(); } catch (Exception e) { System.err.println("User seed notice: " + e.getMessage()); }
        try { seedRegulations(); } catch (Exception e) { System.err.println("Reg seed notice: " + e.getMessage()); }
        try { seedSubjectsAndUnits(); } catch (Exception e) { System.err.println("Subject seed notice: " + e.getMessage()); }
        try { seedPlacementResources(); } catch (Exception e) { System.err.println("Placement seed notice: " + e.getMessage()); }
        try { seedPlacementTracksAndModules(); } catch (Exception e) { System.err.println("Track seed notice: " + e.getMessage()); }
        try { seedPlacementQuestions(); } catch (Exception e) { System.err.println("Question seed notice: " + e.getMessage()); }
        try { seedCompanies(); } catch (Exception e) { System.err.println("Company seed notice: " + e.getMessage()); }
        try { seedJobs(); } catch (Exception e) { System.err.println("Job seed notice: " + e.getMessage()); }
        System.out.println("🚀 CampusConnect Spring Boot Backend initialized & database ready!");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@campusconnect.com")) {
            User admin = new User("Admin User", "admin@campusconnect.com", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
        }
        if (!userRepository.existsByEmail("student@college.edu")) {
            User student = new User("Rajesh Kumar", "student@college.edu", passwordEncoder.encode("student123"), "STUDENT");
            userRepository.save(student);
        }
    }

    private void seedRegulations() {
        if (regulationRepository.count() == 0) {
            regulationRepository.saveAll(List.of(
                new Regulation("JNTUK", "JNTUK Regulation", "Official JNTUK Jawaharlal Nehru Technological University Kakinada syllabus, R23, R20 & R19 regulations."),
                new Regulation("AU", "Andhra University", "Andhra University Visakhapatnam engineering course structure and unit-wise syllabus."),
                new Regulation("UNI", "University Syllabus", "Unified autonomous engineering colleges syllabus database across Andhra Pradesh.")
            ));
        }
    }

    private void seedSubjectsAndUnits() {
        if (subjectRepository.count() == 0) {
            Subject ds = new Subject("Data Structures & Algorithms", "JNTUK", "2nd Year", "Sem 1", "CSE", "R23");
            Subject java = new Subject("Java Programming & OOPs", "JNTUK", "2nd Year", "Sem 2", "CSE", "R23");
            Subject dbms = new Subject("Database Management Systems", "JNTUK", "3rd Year", "Sem 1", "CSE", "R20");
            Subject cn = new Subject("Computer Networks", "AU", "3rd Year", "Sem 2", "ECE", "R20");
            Subject os = new Subject("Operating Systems", "AU", "2nd Year", "Sem 2", "IT", "R20");

            subjectRepository.saveAll(List.of(ds, java, dbms, cn, os));

            List<Subject> allSubs = List.of(ds, java, dbms, cn, os);
            for (Subject sub : allSubs) {
                for (int i = 1; i <= 5; i++) {
                    String title = getSubjectUnitTitle(sub.getName(), i);
                    String desc = "Core syllabus concepts, exam blueprints, and solved problem sets for Unit " + i + " of " + sub.getName();
                    Unit u = new Unit(i, "Unit " + i + ": " + title, desc, sub.getId());
                    Unit savedUnit = unitRepository.save(u);

                    resourceRepository.saveAll(List.of(
                        new Resource("Unit " + i + " Lecture Notes: " + title + " (PDF)", "Comprehensive classroom notes covering key definitions and derivations for " + title + ".", "PDF", "https://example.com/notes-" + sub.getId() + "-unit" + i + ".pdf", savedUnit.getId()),
                        new Resource("Unit " + i + " Video Tutorial Playlist", "Step-by-step video lecture series explaining concepts of " + title + ".", "YOUTUBE", "https://youtube.com/watch?v=demo-" + sub.getId() + "-unit" + i, savedUnit.getId()),
                        new Resource("Unit " + i + " Important Exam Questions", "Most frequently asked university end-exam questions for " + title + ".", "IMPORTANT_QUESTION", "https://example.com/questions-" + sub.getId() + "-unit" + i + ".pdf", savedUnit.getId())
                    ));
                }
            }
        }
    }

    private String getSubjectUnitTitle(String subjectName, int unitNum) {
        if (subjectName.contains("Database")) {
            return switch (unitNum) {
                case 1 -> "Introduction to Database Systems & Architecture";
                case 2 -> "Entity-Relationship Data Model & ER Diagrams";
                case 3 -> "Relational Algebra and SQL";
                case 4 -> "Schema Refinement & Normal Forms (1NF, 2NF, 3NF, BCNF)";
                case 5 -> "Transaction Management, Concurrency Control & Recovery";
                default -> "Advanced Database Topics";
            };
        } else if (subjectName.contains("Java")) {
            return switch (unitNum) {
                case 1 -> "Java Fundamentals, Data Types & Control Structures";
                case 2 -> "Object-Oriented Programming, Classes & Inheritance";
                case 3 -> "Packages, Interfaces & Exception Handling";
                case 4 -> "Multithreading, Collections Framework & Generics";
                case 5 -> "GUI Programming with JavaFX/Swing & Event Handling";
                default -> "Advanced Java Topics";
            };
        } else if (subjectName.contains("Networks")) {
            return switch (unitNum) {
                case 1 -> "Computer Networks & The Internet Architecture";
                case 2 -> "Application Layer Protocols: HTTP, DNS & Sockets";
                case 3 -> "Transport Layer: TCP, UDP & Congestion Control";
                case 4 -> "Network Layer: Routing Algorithms & IP Addressing";
                case 5 -> "Link Layer, Wireless Networks & Network Security";
                default -> "Advanced Networking Topics";
            };
        } else if (subjectName.contains("Operating")) {
            return switch (unitNum) {
                case 1 -> "Operating System Structure & Process Management";
                case 2 -> "CPU Scheduling Algorithms & Thread Synchronization";
                case 3 -> "Deadlocks: Prevention, Detection & Avoidance";
                case 4 -> "Memory Management: Paging, Segmentation & Virtual Memory";
                case 5 -> "File Systems, Mass Storage & Security Protection";
                default -> "Advanced Operating Systems Topics";
            };
        } else {
            return switch (unitNum) {
                case 1 -> "Introduction to Algorithms & Complexity Analysis";
                case 2 -> "Linear Data Structures: Stacks, Queues & Linked Lists";
                case 3 -> "Trees & Binary Search Trees";
                case 4 -> "Graph Algorithms & Shortest Path";
                case 5 -> "Dynamic Programming & Hashing Techniques";
                default -> "Advanced Algorithm Topics";
            };
        }
    }

    private void seedPlacementResources() {
        if (placementResourceRepository.count() == 0) {
            PlacementResource dsa = new PlacementResource();
            dsa.setId("dsa");
            dsa.setCategory("DSA");
            dsa.setIcon("📊");
            dsa.setBadge("DSA MASTERCLASS");
            dsa.setBadgeColor("#7C3AED");
            dsa.setTitle("DSA Masterclass");
            dsa.setSubtitle("Data Structures & Algorithms");
            dsa.setDesc("Arrays, Linked Lists, Trees, Graphs, DP, Sorting & Searching — from scratch to advanced.");
            dsa.setTopics(List.of("Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming", "Recursion & Backtracking"));
            dsa.setDifficulty("Intermediate → Advanced");
            dsa.setHours("80 hrs");
            dsa.setProblems("350+ Problems");
            dsa.setCompanies(List.of("Google", "Amazon", "Microsoft", "Adobe"));
            dsa.setColor("#7C3AED");
            dsa.setLightColor("#EDE9FE");

            PlacementResource javaTrack = new PlacementResource();
            javaTrack.setId("java");
            javaTrack.setCategory("LANGUAGES");
            javaTrack.setIcon("☕");
            javaTrack.setBadge("JAVA OOPs");
            javaTrack.setBadgeColor("#DC2626");
            javaTrack.setTitle("Java Programming");
            javaTrack.setSubtitle("OOPs + Collections Framework");
            javaTrack.setDesc("Core Java, OOPs principles, Collections, Multithreading, JVM internals — all interview-ready concepts.");
            javaTrack.setTopics(List.of("Java OOPs", "Collections Framework", "Multithreading", "Exception Handling", "JVM Architecture"));
            javaTrack.setDifficulty("Beginner → Advanced");
            javaTrack.setHours("60 hrs");
            javaTrack.setProblems("180+ Problems");
            javaTrack.setCompanies(List.of("TCS", "Goldman Sachs", "Cognizant", "Capgemini"));
            javaTrack.setColor("#DC2626");
            javaTrack.setLightColor("#FEE2E2");

            PlacementResource quant = new PlacementResource();
            quant.setId("quant");
            quant.setCategory("APTITUDE");
            quant.setIcon("🧮");
            quant.setBadge("QUANT");
            quant.setBadgeColor("#FF7A00");
            quant.setTitle("Quantitative Aptitude");
            quant.setSubtitle("Numbers & Speed Math");
            quant.setDesc("Time & Work, Ratios, Percentages, Profit-Loss, Speed-Distance — with speed shortcut techniques.");
            quant.setTopics(List.of("Number Theory", "Time & Work", "Percentages", "Ratio & Proportion", "Profit & Loss"));
            quant.setDifficulty("Beginner → Intermediate");
            quant.setHours("35 hrs");
            quant.setProblems("500+ MCQs");
            quant.setCompanies(List.of("TCS NQT", "Wipro", "Infosys", "Capgemini"));
            quant.setColor("#FF7A00");
            quant.setLightColor("#FFF7ED");

            placementResourceRepository.saveAll(List.of(dsa, javaTrack, quant));
        }
    }

    private void seedCompanies() {
        if (companyRepository.count() == 0) {
            companyRepository.saveAll(List.of(
                new Company("Microsoft India", "Microsoft India R&D", "🟦", "#0078D4", "#E6F2FB", "Software Development", "https://microsoft.com"),
                new Company("Razorpay", "Razorpay Software Pvt Ltd", "💳", "#072654", "#E6ECF5", "Fintech / Payments", "https://razorpay.com"),
                new Company("Google India", "Google India Labs", "🔴", "#EA4335", "#FDECEA", "Artificial Intelligence & Search", "https://google.com"),
                new Company("Zepto", "Zepto Quick Commerce", "⚡", "#8B5CF6", "#F3E8FF", "E-Commerce", "https://zeptonow.com"),
                new Company("TCS Digital", "Tata Consultancy Services", "🔷", "#1A5276", "#D6EAF8", "IT Services", "https://tcs.com")
            ));
        }
    }

    private void seedJobs() {
        if (jobRepository.count() < 8) {
            Job j1 = new Job();
            j1.setId("job-1");
            j1.setTitle("Software Engineer — Graduate 2027");
            j1.setCompany("Microsoft India");
            j1.setLogo("🟦");
            j1.setColor("#0078D4");
            j1.setBgColor("#E6F2FB");
            j1.setLocation("Hyderabad / Bangalore");
            j1.setWorkMode("Hybrid");
            j1.setType("Full Time");
            j1.setCategory("SOFTWARE");
            j1.setBatch("2027");
            j1.setExperience("Fresher");
            j1.setBranch(List.of("CSE", "IT", "ECE"));
            j1.setSalary("₹18 - ₹24 LPA");
            j1.setPostedDate("2 days ago");
            j1.setDeadline("15 Sep 2026");
            j1.setVerified(true);
            j1.setSkills(List.of("C++", "Data Structures", "Algorithms", "OOPs", "System Design"));
            j1.setShortDesc("Build core cloud applications and enterprise backend systems at Microsoft. Ideal for 2027 graduating engineers.");
            j1.setDescription("Microsoft India is hiring Software Development Engineers for our Cloud & AI engineering teams in Hyderabad and Bangalore. Design, write high-performance code, and deploy large-scale cloud services used by millions globally.");
            j1.setResponsibilities(List.of("Implement scalable software services using modern C++ and C#.", "Collaborate with cross-functional teams on API specs.", "Write clean, tested code with high algorithmic efficiency."));
            j1.setRequirements(List.of("B.Tech / M.Tech in CSE/IT/ECE graduating in 2027.", "Strong problem-solving skills in DSA and OOPs.", "Minimum CGPA: 7.5/10."));
            j1.setExternalUrl("https://careers.microsoft.com/us/en/job/1749201/Software-Engineer-Graduate");

            Job j2 = new Job();
            j2.setId("job-2");
            j2.setTitle("Java Backend Developer Intern");
            j2.setCompany("Razorpay");
            j2.setLogo("💳");
            j2.setColor("#072654");
            j2.setBgColor("#E6ECF5");
            j2.setLocation("Bangalore");
            j2.setWorkMode("Remote");
            j2.setType("Internship");
            j2.setCategory("JAVA");
            j2.setBatch("2027");
            j2.setExperience("Fresher");
            j2.setBranch(List.of("CSE", "IT"));
            j2.setSalary("₹45,000 / month Stipend");
            j2.setPostedDate("1 day ago");
            j2.setDeadline("20 Sep 2026");
            j2.setVerified(true);
            j2.setSkills(List.of("Java", "Spring Boot", "SQL", "REST APIs", "Git"));
            j2.setShortDesc("Develop robust payment APIs and microservices for India’s top fintech payment gateway platform.");
            j2.setDescription("Razorpay is looking for passionate Java Engineering Interns to join our Core Payments team. You will build high-throughput microservices using Spring Boot, process millions of daily transactions, and work with distributed MySQL/Redis databases.");
            j2.setResponsibilities(List.of("Build and optimize microservices using Java 17 and Spring Boot.", "Integrate third-party banking APIs and webhooks.", "Write unit tests using JUnit and Mockito."));
            j2.setRequirements(List.of("Eligible Batches: 2027 and 2026.", "Hands-on experience building Java or Spring Boot projects.", "Understanding of relational databases (MySQL / PostgreSQL)."));
            j2.setExternalUrl("https://razorpay.com/jobs/engineering/java-backend-intern");

            Job j3 = new Job();
            j3.setId("job-3");
            j3.setTitle("Associate Software Engineer — Core Systems");
            j3.setCompany("Google India");
            j3.setLogo("🔴");
            j3.setColor("#EA4335");
            j3.setBgColor("#FCE8E6");
            j3.setLocation("Bangalore");
            j3.setWorkMode("On-site");
            j3.setType("Full Time");
            j3.setCategory("SOFTWARE");
            j3.setBatch("2026");
            j3.setExperience("Fresher");
            j3.setBranch(List.of("CSE", "IT", "ECE", "EEE"));
            j3.setSalary("₹22 - ₹30 LPA");
            j3.setPostedDate("3 days ago");
            j3.setDeadline("30 Sep 2026");
            j3.setVerified(true);
            j3.setSkills(List.of("Go", "Python", "Distributed Systems", "Data Structures", "Linux"));
            j3.setShortDesc("Solve complex algorithmic challenges at global scale with Google's Core Infrastructure engineering team.");
            j3.setDescription("Google invites passionate graduates to design and implement mission-critical infrastructure software. You will work on distributed storage, search indexing, and real-time processing pipelines serving billions of queries.");
            j3.setResponsibilities(List.of("Design and code efficient distributed systems in Go, C++, or Python.", "Analyze and optimize system bottlenecks and memory latency.", "Participate in architecture reviews and automated test engineering."));
            j3.setRequirements(List.of("B.Tech / M.Tech in Computer Science or related fields graduating in 2026.", "Demonstrated competitive programming or open-source credentials.", "Strong grasp of OS concepts, memory hierarchy, and networking."));
            j3.setExternalUrl("https://careers.google.com/jobs/results/associate-software-engineer");

            Job j4 = new Job();
            j4.setId("job-4");
            j4.setTitle("Applied Machine Learning Intern");
            j4.setCompany("Amazon");
            j4.setLogo("🟠");
            j4.setColor("#FF9900");
            j4.setBgColor("#FFF4E5");
            j4.setLocation("Hyderabad");
            j4.setWorkMode("Hybrid");
            j4.setType("Internship");
            j4.setCategory("AI_ML");
            j4.setBatch("2026");
            j4.setExperience("Fresher");
            j4.setBranch(List.of("CSE", "AI/ML", "Data Science"));
            j4.setSalary("₹60,000 / month Stipend");
            j4.setPostedDate("Just now");
            j4.setDeadline("18 Sep 2026");
            j4.setVerified(true);
            j4.setSkills(List.of("Python", "PyTorch", "NLP", "Transformers", "SQL"));
            j4.setShortDesc("Work with state-of-the-art LLMs, neural search, and recommendation models at Amazon Web Services & Retail.");
            j4.setDescription("Join Amazon's Applied Science team as an ML Intern. You will train deep learning architectures, evaluate LLM fine-tuning techniques, and deploy inference endpoints on AWS SageMaker.");
            j4.setResponsibilities(List.of("Train and benchmark transformer models on multi-modal datasets.", "Build data ingestion and validation pipelines in Python.", "Publish internal research summaries and technical evaluations."));
            j4.setRequirements(List.of("Bachelor's or Master's students graduating in 2026 with strong ML coursework.", "Proficiency in PyTorch or TensorFlow, NumPy, and Pandas.", "Experience with generative AI / LLM frameworks is a plus."));
            j4.setExternalUrl("https://amazon.jobs/en/jobs/applied-machine-learning-intern-2026");

            Job j5 = new Job();
            j5.setId("job-5");
            j5.setTitle("Systems Engineer — Digital Cadre");
            j5.setCompany("TCS Digital");
            j5.setLogo("🔷");
            j5.setColor("#1A5276");
            j5.setBgColor("#EBF5FB");
            j5.setLocation("Pan-India / Pune / Hyderabad");
            j5.setWorkMode("On-site");
            j5.setType("Full Time");
            j5.setCategory("SOFTWARE");
            j5.setBatch("2026");
            j5.setExperience("Fresher");
            j5.setBranch(List.of("All B.Tech Branches"));
            j5.setSalary("₹7.5 - ₹9.2 LPA");
            j5.setPostedDate("4 days ago");
            j5.setDeadline("25 Sep 2026");
            j5.setVerified(true);
            j5.setSkills(List.of("Java", "Python", "SQL", "Cloud Basics", "Problem Solving"));
            j5.setShortDesc("Premier campus entry program for high-aptitude engineers across TCS digital enterprise transformation units.");
            j5.setDescription("TCS Digital is the premium engineering band offered to top-tier campus recruits via the National Qualifier Test (NQT). Selected engineers work on advanced technologies including AI, Cloud computing, Blockchain, and IoT.");
            j5.setResponsibilities(List.of("Develop enterprise digital solutions for global Fortune 500 clients.", "Undergo specialized digital tech training in cloud and full stack.", "Collaborate in Agile teams delivering bi-weekly product increments."));
            j5.setRequirements(List.of("2026 Batch B.Tech/B.E. all engineering streams.", "Minimum 65% or 6.5 CGPA throughout 10th, 12th, and Degree.", "No active backlogs at time of joining."));
            j5.setExternalUrl("https://www.tcs.com/careers/digital-cadre");

            Job j6 = new Job();
            j6.setId("job-6");
            j6.setTitle("Full Stack React & Node Developer");
            j6.setCompany("Zepto");
            j6.setLogo("⚡");
            j6.setColor("#7C3AED");
            j6.setBgColor("#F3E8FF");
            j6.setLocation("Bangalore");
            j6.setWorkMode("On-site");
            j6.setType("Full Time");
            j6.setCategory("FULLSTACK");
            j6.setBatch("2025");
            j6.setExperience("0-1 years");
            j6.setBranch(List.of("CSE", "IT", "Circuital"));
            j6.setSalary("₹14 - ₹18 LPA");
            j6.setPostedDate("5 days ago");
            j6.setDeadline("22 Sep 2026");
            j6.setVerified(true);
            j6.setSkills(List.of("React", "Node.js", "TypeScript", "PostgreSQL", "Kafka"));
            j6.setShortDesc("Power lightning-fast 10-minute grocery delivery logistics and rider dispatcher platforms at Zepto.");
            j6.setDescription("Zepto is searching for exceptional Full Stack Engineers who thrive in high-speed, high-growth startup environments. You will architect responsive web apps, dark store operations dashboards, and real-time inventory management microservices.");
            j6.setResponsibilities(List.of("Build pixel-perfect UI with React, TypeScript, and Tailwind CSS.", "Develop resilient REST and GraphQL APIs using Node.js & NestJS.", "Optimize database queries on PostgreSQL and cache layers on Redis."));
            j6.setRequirements(List.of("2025 or 2026 graduates with 0-1 year experience or strong internship projects.", "Deep knowledge of React state management and component lifecycle.", "Ability to debug production web performance issues."));
            j6.setExternalUrl("https://zepto.freshteam.com/jobs/full-stack-engineer");

            Job j7 = new Job();
            j7.setId("job-7");
            j7.setTitle("Associate Data Analyst");
            j7.setCompany("Swiggy");
            j7.setLogo("🛵");
            j7.setColor("#FC8019");
            j7.setBgColor("#FFF1E5");
            j7.setLocation("Bangalore");
            j7.setWorkMode("Hybrid");
            j7.setType("Full Time");
            j7.setCategory("DATA");
            j7.setBatch("2026");
            j7.setExperience("Fresher");
            j7.setBranch(List.of("CSE", "IT", "Data Science", "ECE", "Maths"));
            j7.setSalary("₹10 - ₹14 LPA");
            j7.setPostedDate("1 week ago");
            j7.setDeadline("28 Sep 2026");
            j7.setVerified(true);
            j7.setSkills(List.of("SQL", "Python", "PowerBI", "Statistics", "Data Modeling"));
            j7.setShortDesc("Extract actionable business insights from millions of orders, delivery routes, and restaurant metrics.");
            j7.setDescription("As an Associate Data Analyst at Swiggy, you will work closely with product managers and ops leaders to uncover consumer behavior trends, optimize delivery economics, and build automated analytical dashboards.");
            j7.setResponsibilities(List.of("Author complex SQL queries over Snowflake and BigQuery data warehouses.", "Create interactive executive dashboards using Tableau and PowerBI.", "Run A/B test analysis for new UI experiments and delivery algorithms."));
            j7.setRequirements(List.of("Graduating in 2026 with strong analytical and quantitative foundations.", "Expertise in SQL (joins, window functions, CTEs) and basic Python.", "Exceptional communication and data visualization skills."));
            j7.setExternalUrl("https://careers.swiggy.com/data-analyst-associate");

            Job j8 = new Job();
            j8.setId("job-8");
            j8.setTitle("Cloud & Network Software Intern");
            j8.setCompany("Cisco");
            j8.setLogo("🌐");
            j8.setColor("#005073");
            j8.setBgColor("#E0F2F1");
            j8.setLocation("Chennai / Bangalore");
            j8.setWorkMode("Remote");
            j8.setType("Internship");
            j8.setCategory("CLOUD");
            j8.setBatch("2027");
            j8.setExperience("Fresher");
            j8.setBranch(List.of("CSE", "IT", "ECE", "Telecom"));
            j8.setSalary("₹50,000 / month Stipend");
            j8.setPostedDate("3 days ago");
            j8.setDeadline("1 Oct 2026");
            j8.setVerified(true);
            j8.setSkills(List.of("Python", "TCP/IP", "Docker", "Linux", "Kubernetes"));
            j8.setShortDesc("Engineer next-generation software defined networking (SDN) and cloud security infrastructure at Cisco.");
            j8.setDescription("Cisco's Cloud Networking group is offering 6-month internships for pre-final year students. Gain practical experience developing containerized network applications, automating cloud routing, and securing zero-trust networks.");
            j8.setResponsibilities(List.of("Develop automation scripts in Python for network telemetry.", "Containerize network microservices using Docker and Kubernetes.", "Assist in debugging protocol stacks (BGP, OSPF, HTTP/3)."));
            j8.setRequirements(List.of("B.Tech students graduating in 2027.", "Solid understanding of Computer Networks, OSI model, and TCP/IP.", "Proficiency in Python or Golang with Linux scripting experience."));
            j8.setExternalUrl("https://jobs.cisco.com/jobs/Project/Cloud-Network-Intern-2027");

            jobRepository.saveAll(List.of(j1, j2, j3, j4, j5, j6, j7, j8));
        }
    }

    private void seedPlacementTracksAndModules() {
        if (placementTrackRepository.count() > 0) {
            return;
        }

        // 1. Programming Fundamentals
        PlacementTrack progFund = new PlacementTrack();
        progFund.setSlug("prog-fund");
        progFund.setTitle("Programming Fundamentals");
        progFund.setSubtitle("Syntax, Logic & Memory Basics");
        progFund.setCategory("LANGUAGES");
        progFund.setStage("FOUNDATION");
        progFund.setDescription("Core programming concepts across C, C++, and Java: variables, control flow, recursion, pointer manipulation, and asymptotic complexity.");
        progFund.setDifficulty("Beginner");
        progFund.setEstimatedHours("30 hrs");
        progFund.setIcon("💻");
        progFund.setColor("#2563EB");
        progFund.setLightColor("#EFF6FF");
        progFund.setDisplayOrder(1);
        progFund.setTargetCompanies(List.of("TCS", "Infosys", "Wipro", "Capgemini"));

        PlacementModule pfM1 = createModule(progFund, "Core Syntax & Control Flow", "Variables, data types, loops, conditionals, and scope fundamentals.", 1);
        createTopic(pfM1, "Variables, Types & Operators", "Primitive vs reference types, arithmetic and bitwise operators, type casting rules.", "CONCEPT", "Easy", 1);
        createTopic(pfM1, "Loops & Conditional Branching", "for, while, do-while loops, switch statements, and loop optimization tricks.", "CODING", "Easy", 2);
        createTopic(pfM1, "Functions & Scope Rules", "Call by value vs reference, stack frames, and lexical variable scope.", "CONCEPT", "Easy", 3);

        PlacementModule pfM2 = createModule(progFund, "Memory & Problem Solving", "Pointers, dynamic allocation, recursion, and debugging techniques.", 2);
        createTopic(pfM2, "Pointers & References", "Pointer arithmetic, dereferencing, void pointers, and memory leaks prevention.", "CODING", "Medium", 1);
        createTopic(pfM2, "Recursion & Backtracking Basics", "Base conditions, recurrence relations, and recursion tree visualization.", "CODING", "Medium", 2);
        createTopic(pfM2, "Time & Space Complexity Basics", "Big-O, Big-Theta, Big-Omega notation and calculating asymptotic bounds.", "CONCEPT", "Easy", 3);

        progFund.setModules(List.of(pfM1, pfM2));
        placementTrackRepository.save(progFund);

        // 2. Data Structures & Algorithms
        PlacementTrack dsa = new PlacementTrack();
        dsa.setSlug("dsa");
        dsa.setTitle("Data Structures & Algorithms");
        dsa.setSubtitle("Problem Solving & Coding Patterns");
        dsa.setCategory("DSA");
        dsa.setStage("DSA");
        dsa.setDescription("Master foundational linear structures to complex graphs and dynamic programming patterns tested in technical interviews.");
        dsa.setDifficulty("Intermediate → Advanced");
        dsa.setEstimatedHours("90 hrs");
        dsa.setIcon("📊");
        dsa.setColor("#7C3AED");
        dsa.setLightColor("#F5F3FF");
        dsa.setDisplayOrder(2);
        dsa.setTargetCompanies(List.of("Google", "Microsoft", "Amazon", "Adobe", "Razorpay"));

        PlacementModule dsaM1 = createModule(dsa, "Linear Structures & Two Pointers", "Arrays, strings, sliding window, and singly/doubly linked lists.", 1);
        createTopic(dsaM1, "Arrays & Prefix Sum Patterns", "Subarray sum equals K, 2D grid prefix computations, andkadane's algorithm.", "CODING", "Medium", 1);
        createTopic(dsaM1, "Two Pointers & Sliding Window", "Container with most water, 3Sum, longest substring without repeats.", "CODING", "Medium", 2);
        createTopic(dsaM1, "Linked Lists In-place Reversal", "Fast & slow pointers, cycle detection, and merging sorted lists.", "CODING", "Medium", 3);

        PlacementModule dsaM2 = createModule(dsa, "Trees & Binary Search Trees", "Tree traversals, binary search tree operations, and lowest common ancestor.", 2);
        createTopic(dsaM2, "Binary Tree Traversals (BFS & DFS)", "Pre-order, in-order, post-order, and level-order zigzag traversal.", "CODING", "Medium", 1);
        createTopic(dsaM2, "BST Search, Insert & Validation", "Validate BST property, find LCA in BST, and Kth smallest element.", "CODING", "Medium", 2);
        createTopic(dsaM2, "Heaps & Top-K Problems", "Min-heap, max-heap, heapify, and finding K most frequent elements.", "CODING", "Hard", 3);

        PlacementModule dsaM3 = createModule(dsa, "Graphs & Dynamic Programming", "Graph traversals, shortest path, and 1D/2D DP optimization.", 3);
        createTopic(dsaM3, "Graph BFS, DFS & Connected Components", "Number of islands, cycle detection in directed graphs using Kahn's algorithm.", "CODING", "Hard", 1);
        createTopic(dsaM3, "1D & 2D Dynamic Programming", "0/1 Knapsack, Coin Change, Longest Common Subsequence, and Edit Distance.", "CODING", "Hard", 2);

        dsa.setModules(List.of(dsaM1, dsaM2, dsaM3));
        placementTrackRepository.save(dsa);

        // 3. Object-Oriented Programming (OOP)
        PlacementTrack oop = new PlacementTrack();
        oop.setSlug("oop");
        oop.setTitle("Object-Oriented Programming");
        oop.setSubtitle("OOPs Principles, SOLID & Design Patterns");
        oop.setCategory("CORE_CS");
        oop.setStage("CORE_CS");
        oop.setDescription("In-depth exploration of encapsulation, inheritance, polymorphism, abstraction, interface segregation, and software design principles.");
        oop.setDifficulty("Beginner → Intermediate");
        oop.setEstimatedHours("35 hrs");
        oop.setIcon("🧱");
        oop.setColor("#0D9488");
        oop.setLightColor("#F0FDFA");
        oop.setDisplayOrder(3);
        oop.setTargetCompanies(List.of("Amazon", "Microsoft", "Goldman Sachs", "TCS"));

        PlacementModule oopM1 = createModule(oop, "Core 4 Pillars of OOP", "Encapsulation, abstraction, inheritance hierarchy, and polymorphism types.", 1);
        createTopic(oopM1, "Encapsulation & Data Hiding", "Getters/setters, access modifiers (private, protected, public), and class invariants.", "CONCEPT", "Easy", 1);
        createTopic(oopM1, "Inheritance & Method Overriding", "Single, multilevel, multiple inheritance tradeoffs, and super/this keywords.", "CONCEPT", "Easy", 2);
        createTopic(oopM1, "Compile-Time vs Runtime Polymorphism", "Method overloading vs dynamic method dispatch with virtual tables.", "CONCEPT", "Medium", 3);

        PlacementModule oopM2 = createModule(oop, "SOLID Principles & Industry Patterns", "Writing clean, decoupled, and maintainable enterprise software.", 2);
        createTopic(oopM2, "SOLID Principles Explained", "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.", "CONCEPT", "Medium", 1);
        createTopic(oopM2, "Essential Design Patterns", "Singleton, Factory, Builder, Observer, and Strategy design patterns with code examples.", "CONCEPT", "Medium", 2);

        oop.setModules(List.of(oopM1, oopM2));
        placementTrackRepository.save(oop);

        // 4. Database Management Systems (DBMS)
        PlacementTrack dbms = new PlacementTrack();
        dbms.setSlug("dbms");
        dbms.setTitle("Database Management Systems");
        dbms.setSubtitle("Architecture, ER Modeling, Normalization & ACID");
        dbms.setCategory("CORE_CS");
        dbms.setStage("CORE_CS");
        dbms.setDescription("Comprehensive interview prep on relational theory, 1NF to BCNF normalization, transactions, concurrency control, and indexing.");
        dbms.setDifficulty("Intermediate");
        dbms.setEstimatedHours("45 hrs");
        dbms.setIcon("🗄️");
        dbms.setColor("#EA580C");
        dbms.setLightColor("#FFF7ED");
        dbms.setDisplayOrder(4);
        dbms.setTargetCompanies(List.of("Oracle", "Amazon", "Razorpay", "TCS", "Cognizant"));

        PlacementModule dbmsM1 = createModule(dbms, "Architecture & Data Modeling", "3-Tier architecture, relational data models, keys, and ER diagrams.", 1);
        createTopic(dbmsM1, "3-Tier Schema Architecture", "Physical, logical, and external schemas with logical and physical data independence.", "CONCEPT", "Easy", 1);
        createTopic(dbmsM1, "Primary, Foreign, Candidate & Super Keys", "Key constraints, referential integrity, and cascading delete/update behaviors.", "CONCEPT", "Easy", 2);
        createTopic(dbmsM1, "ER Diagrams & Relational Mapping", "Entities, relationships (1:1, 1:N, M:N), weak entities, and converting ER to tables.", "CONCEPT", "Medium", 3);

        PlacementModule dbmsM2 = createModule(dbms, "Normalization & Schema Refinement", "Eliminating anomalies via functional dependencies and normal forms.", 2);
        createTopic(dbmsM2, "Functional Dependencies & Attribute Closure", "Armstrong's axioms, finding minimal cover, and candidate key calculation.", "CONCEPT", "Medium", 1);
        createTopic(dbmsM2, "Normal Forms: 1NF, 2NF, 3NF & BCNF", "Decomposition, lossless join property, dependency preservation, and BCNF vs 3NF.", "CONCEPT", "Hard", 2);

        PlacementModule dbmsM3 = createModule(dbms, "Transactions, Concurrency & Indexing", "ACID guarantees, conflict serializability, 2PL, and indexing structures.", 3);
        createTopic(dbmsM3, "ACID Properties & Transaction States", "Atomicity, Consistency, Isolation, Durability, write-ahead logging (WAL), and rollback.", "CONCEPT", "Medium", 1);
        createTopic(dbmsM3, "Concurrency Control & Two-Phase Locking", "Dirty read, unrepeatable read, phantom read, Strict 2PL, and Deadlock detection.", "CONCEPT", "Hard", 2);
        createTopic(dbmsM3, "B-Trees & B+ Tree Indexing", "Clustered vs non-clustered indexes, index seek vs scan, and query optimization.", "CONCEPT", "Hard", 3);

        dbms.setModules(List.of(dbmsM1, dbmsM2, dbmsM3));
        placementTrackRepository.save(dbms);

        // 5. SQL Mastery
        PlacementTrack sql = new PlacementTrack();
        sql.setSlug("sql");
        sql.setTitle("SQL Mastery & Practical Queries");
        sql.setSubtitle("From DDL/DML to Window Functions & CTEs");
        sql.setCategory("CORE_CS");
        sql.setStage("CORE_CS");
        sql.setDescription("Hands-on query writing covering joins, aggregations, subqueries, ranking functions, and top interview SQL challenges.");
        sql.setDifficulty("Beginner → Advanced");
        sql.setEstimatedHours("40 hrs");
        sql.setIcon("⚡");
        sql.setColor("#D97706");
        sql.setLightColor("#FFFBEB");
        sql.setDisplayOrder(5);
        sql.setTargetCompanies(List.of("Google", "Microsoft", "Amazon", "Flipkart", "Accenture"));

        PlacementModule sqlM1 = createModule(sql, "SQL Foundations & Aggregations", "DDL, DML, WHERE filtering, pattern matching, and group aggregations.", 1);
        createTopic(sqlM1, "DDL, DML & Data Constraints", "CREATE, ALTER, DROP, TRUNCATE, NOT NULL, UNIQUE, and CHECK constraints.", "SQL", "Easy", 1);
        createTopic(sqlM1, "WHERE, LIKE, IN & BETWEEN Filtering", "Filtering query results with logical AND/OR, NULL checking, and wildcards.", "SQL", "Easy", 2);
        createTopic(sqlM1, "GROUP BY & HAVING Aggregations", "COUNT, SUM, AVG, MIN, MAX aggregations and filtering aggregated groups with HAVING.", "SQL", "Easy", 3);

        PlacementModule sqlM2 = createModule(sql, "Joins & Nested Subqueries", "Combining tables, self joins, outer joins, and correlated subqueries.", 2);
        createTopic(sqlM2, "INNER, LEFT, RIGHT & FULL OUTER Joins", "Joining relational tables, handling NULL mismatches, and multi-table join chains.", "SQL", "Medium", 1);
        createTopic(sqlM2, "Correlated Subqueries & EXISTS", "Writing dependent subqueries, EXISTS vs IN performance, and NOT EXISTS patterns.", "SQL", "Medium", 2);
        createTopic(sqlM2, "Self Joins: Manager-Employee Hierarchy", "Self-referencing tables, finding managers of employees, and hierarchical levels.", "SQL", "Medium", 3);

        PlacementModule sqlM3 = createModule(sql, "Window Functions, CTEs & Top Interview Queries", "Analytical queries, ranking, running totals, and company challenges.", 3);
        createTopic(sqlM3, "Window Functions: ROW_NUMBER, RANK, DENSE_RANK", "Partitioning data, order-dependent ranking, and comparing duplicate handling.", "SQL", "Hard", 1);
        createTopic(sqlM3, "Common Table Expressions (CTEs) & Recursive CTEs", "WITH clause, modularizing complex queries, and traversing hierarchical org charts.", "SQL", "Hard", 2);
        createTopic(sqlM3, "Nth Highest Salary & Deduplication", "Finding the 2nd/Nth highest salary using DENSE_RANK and deleting duplicate records.", "SQL", "Hard", 3);

        sql.setModules(List.of(sqlM1, sqlM2, sqlM3));
        placementTrackRepository.save(sql);

        // 6. Operating Systems
        PlacementTrack os = new PlacementTrack();
        os.setSlug("os");
        os.setTitle("Operating Systems");
        os.setSubtitle("Processes, Threads, Scheduling, Sync & Memory");
        os.setCategory("CORE_CS");
        os.setStage("CORE_CS");
        os.setDescription("Core concepts of modern OS architecture, race conditions, semaphores, deadlock algorithms, and virtual memory paging.");
        os.setDifficulty("Intermediate");
        os.setEstimatedHours("35 hrs");
        os.setIcon("🖥️");
        os.setColor("#059669");
        os.setLightColor("#ECFDF5");
        os.setDisplayOrder(6);
        os.setTargetCompanies(List.of("Microsoft", "Samsung", "Qualcomm", "TCS"));

        PlacementModule osM1 = createModule(os, "Processes & CPU Scheduling", "Process control blocks, thread models, and scheduling algorithms.", 1);
        createTopic(osM1, "Process Lifecycle & PCB Structure", "Process states, context switching, fork() system call, and zombie/orphan processes.", "CONCEPT", "Easy", 1);
        createTopic(osM1, "CPU Scheduling: FCFS, SJF, Round Robin & Priority", "Preemptive vs non-preemptive scheduling, Gantt charts, and turnaround time.", "CONCEPT", "Medium", 2);

        PlacementModule osM2 = createModule(os, "Synchronization, Deadlocks & Memory", "Critical section problem, mutexes, Banker's algorithm, and page replacement.", 2);
        createTopic(osM2, "Process Synchronization & Semaphores", "Critical section, Peterson's solution, counting semaphores, and Producer-Consumer.", "CONCEPT", "Hard", 1);
        createTopic(osM2, "Deadlocks & Banker's Algorithm", "Mutual exclusion, hold & wait, no preemption, circular wait, and deadlock avoidance.", "CONCEPT", "Hard", 2);
        createTopic(osM2, "Virtual Memory, Paging & Page Replacement", "MMU, TLB, page faults, FIFO, LRU, and Optimal page replacement algorithms.", "CONCEPT", "Hard", 3);

        os.setModules(List.of(osM1, osM2));
        placementTrackRepository.save(os);

        // 7. Computer Networks
        PlacementTrack cn = new PlacementTrack();
        cn.setSlug("cn");
        cn.setTitle("Computer Networks");
        cn.setSubtitle("OSI, TCP/IP, Protocols & Web Architecture");
        cn.setCategory("CORE_CS");
        cn.setStage("CORE_CS");
        cn.setDescription("Network layer models, reliable transport protocols, socket communication, DNS, and secure HTTP web data transfer.");
        cn.setDifficulty("Intermediate");
        cn.setEstimatedHours("30 hrs");
        cn.setIcon("🌐");
        cn.setColor("#0284C7");
        cn.setLightColor("#F0F9FF");
        cn.setDisplayOrder(7);
        cn.setTargetCompanies(List.of("Cisco", "Google", "Amazon", "Infosys"));

        PlacementModule cnM1 = createModule(cn, "Network Layers & Addressing", "OSI 7 layers, TCP/IP protocol suite, and IPv4/IPv6 addressing.", 1);
        createTopic(cnM1, "OSI 7 Layers vs TCP/IP Suite", "Physical to Application layer responsibilities, data encapsulation, and headers.", "CONCEPT", "Easy", 1);
        createTopic(cnM1, "IP Addressing & CIDR Subnetting", "Classful vs Classless addressing, subnet masks, and network/broadcast addresses.", "CONCEPT", "Medium", 2);

        PlacementModule cnM2 = createModule(cn, "Transport & Application Protocols", "TCP 3-way handshake, UDP, HTTP/HTTPS, and DNS resolution.", 2);
        createTopic(cnM2, "TCP 3-Way Handshake, Flow & Congestion Control", "SYN, SYN-ACK, ACK, sliding window, slow start, and congestion avoidance.", "CONCEPT", "Hard", 1);
        createTopic(cnM2, "HTTP, HTTPS, TLS & DNS Workflow", "Request-response cycle, status codes, SSL/TLS handshake, and recursive DNS queries.", "CONCEPT", "Medium", 2);

        cn.setModules(List.of(cnM1, cnM2));
        placementTrackRepository.save(cn);

        // 8. Full-Stack & Backend Engineering
        PlacementTrack dev = new PlacementTrack();
        dev.setSlug("dev");
        dev.setTitle("Full-Stack & Backend Engineering");
        dev.setSubtitle("Java, Spring Boot, REST APIs, React & Databases");
        dev.setCategory("DEV");
        dev.setStage("DEVELOPMENT");
        dev.setDescription("Practical engineering track aligned with Campus Connect's stack: building production REST APIs, authentication, and React interfaces.");
        dev.setDifficulty("Intermediate → Advanced");
        dev.setEstimatedHours("60 hrs");
        dev.setIcon("🚀");
        dev.setColor("#4F46E5");
        dev.setLightColor("#EEF2FF");
        dev.setDisplayOrder(8);
        dev.setTargetCompanies(List.of("Razorpay", "Zepto", "Swiggy", "Accenture"));

        PlacementModule devM1 = createModule(dev, "Spring Boot Microservices & REST", "Controller design, dependency injection, and JPA repository patterns.", 1);
        createTopic(devM1, "RESTful API Design & HTTP Standards", "Idempotency, resource URI naming conventions, query params, and JSON payloads.", "CONCEPT", "Easy", 1);
        createTopic(devM1, "Spring Boot Controllers, Services & DI", "@RestController, @Service, @Autowired constructor injection, and application lifecycle.", "CODING", "Medium", 2);
        createTopic(devM1, "Spring Data JPA & Entity Relationships", "@Entity, @OneToMany, @ManyToOne, cascade types, and JPQL queries.", "CODING", "Medium", 3);

        PlacementModule devM2 = createModule(dev, "Security, Frontend & Deployment", "JWT security filter chain, React component architecture, and cloud deployment.", 2);
        createTopic(devM2, "JWT Authentication & Spring Security Filter", "Stateless authentication, claims extraction, token verification, and CORS configuration.", "CODING", "Hard", 1);
        createTopic(devM2, "React State Management & Hooks", "useState, useEffect, useMemo, custom hooks, and consuming backend APIs with axios.", "CODING", "Medium", 2);

        dev.setModules(List.of(devM1, devM2));
        placementTrackRepository.save(dev);

        // 9. Quantitative & Logical Aptitude
        PlacementTrack aptitude = new PlacementTrack();
        aptitude.setSlug("aptitude");
        aptitude.setTitle("Quantitative & Logical Aptitude");
        aptitude.setSubtitle("Speed Math, Logic Puzzles & Verbal Reasoning");
        aptitude.setCategory("APTITUDE");
        aptitude.setStage("FOUNDATION");
        aptitude.setDescription("Prepare for initial campus screening rounds with speed math shortcut formulas, reasoning patterns, and reading comprehension.");
        aptitude.setDifficulty("Beginner → Intermediate");
        aptitude.setEstimatedHours("35 hrs");
        aptitude.setIcon("🧮");
        aptitude.setColor("#F97316");
        aptitude.setLightColor("#FFF7ED");
        aptitude.setDisplayOrder(9);
        aptitude.setTargetCompanies(List.of("TCS NQT", "Wipro", "Infosys", "Cognizant", "Capgemini"));

        PlacementModule aptM1 = createModule(aptitude, "Speed Quantitative Math", "Time & work, ratios, percentages, and speed-distance shortcuts.", 1);
        createTopic(aptM1, "Percentages, Profit & Loss", "Fraction-to-percentage conversions, marked price, discounts, and successive percentage.", "MCQ", "Easy", 1);
        createTopic(aptM1, "Time, Work & Pipes-Cisterns", "Unitary method, efficiency ratios, negative work (leakage), and alternate days.", "MCQ", "Medium", 2);
        createTopic(aptM1, "Speed, Distance, Trains & Boats", "Relative speed, crossing platforms and oncoming trains, upstream/downstream motion.", "MCQ", "Medium", 3);

        PlacementModule aptM2 = createModule(aptitude, "Logical Reasoning & Puzzles", "Blood relations, seating arrangements, coding-decoding, and syllogisms.", 2);
        createTopic(aptM2, "Syllogisms & Logical Deductions", "Venn diagram method, 'Some', 'All', 'No', and 'Only a few' condition statements.", "MCQ", "Medium", 1);
        createTopic(aptM2, "Linear & Circular Seating Arrangement", "Facing center vs outward, complex multi-variable constraints, and row arrangements.", "MCQ", "Hard", 2);

        aptitude.setModules(List.of(aptM1, aptM2));
        placementTrackRepository.save(aptitude);

        // 10. Technical & Behavioral Interview Prep
        PlacementTrack interview = new PlacementTrack();
        interview.setSlug("interview-prep");
        interview.setTitle("Interview & HR Preparation");
        interview.setSubtitle("Technical Rounds, Machine Coding & STAR HR Method");
        interview.setCategory("INTERVIEW");
        interview.setStage("INTERVIEW");
        interview.setDescription("Crack high-stakes technical interviews, present projects convincingly, and master behavioral HR questions.");
        interview.setDifficulty("Intermediate");
        interview.setEstimatedHours("25 hrs");
        interview.setIcon("🎯");
        interview.setColor("#9333EA");
        interview.setLightColor("#FAF5FF");
        interview.setDisplayOrder(10);
        interview.setTargetCompanies(List.of("All Top Product & Service Recruiters"));

        PlacementModule intM1 = createModule(interview, "Technical & Resume Round Mastery", "Project walkthroughs, architecture diagrams, and coding under pressure.", 1);
        createTopic(intM1, "Project Deep-Dive & Architecture Defense", "Explaining project trade-offs, database schema decisions, and performance bottlenecks.", "CONCEPT", "Medium", 1);
        createTopic(intM1, "Live Coding & Thinking Out Loud", "Clarifying requirements, communicating time/space complexity, and handling edge cases.", "CONCEPT", "Medium", 2);

        PlacementModule intM2 = createModule(interview, "HR & Behavioral Excellence", "Behavioral frameworks and culture-fit navigation.", 2);
        createTopic(intM2, "STAR Method: Situation, Task, Action, Result", "Structuring answers for leadership, conflict resolution, teamwork, and failure reflections.", "CONCEPT", "Easy", 1);
        createTopic(intM2, "'Tell Me About Yourself' & Company Fit", "Constructing the 90-second elevator pitch, researching company values, and asking smart questions.", "CONCEPT", "Easy", 2);

        interview.setModules(List.of(intM1, intM2));
        placementTrackRepository.save(interview);
    }

    private PlacementModule createModule(PlacementTrack track, String title, String desc, int order) {
        PlacementModule m = new PlacementModule();
        m.setTrack(track);
        m.setTitle(title);
        m.setDescription(desc);
        m.setDisplayOrder(order);
        return m;
    }

    private void createTopic(PlacementModule module, String title, String summary, String practiceType, String difficulty, int order) {
        PlacementTopic t = new PlacementTopic();
        t.setModule(module);
        t.setTitle(title);
        t.setDescription(summary);
        t.setConceptSummary(summary);
        t.setPracticeType(practiceType);
        t.setDifficulty(difficulty);
        t.setDisplayOrder(order);
        module.getTopics().add(t);
    }

    private void seedPlacementQuestions() {
        if (placementQuestionRepository.count() > 0) {
            return;
        }

        // CODING
        PlacementQuestion q1 = new PlacementQuestion();
        q1.setTitle("Two Sum (Optimal O(N) Hash Map)");
        q1.setCategory("CODING");
        q1.setTrackSlug("dsa");
        q1.setDifficulty("Easy");
        q1.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");
        q1.setSampleInput("nums = [2,7,11,15], target = 9");
        q1.setSampleOutput("[0, 1] (since nums[0] + nums[1] == 9)");
        q1.setSolutionNotes("Maintain a Hash Map storing (complement = target - current_val, index). Traverse once in O(N) time and O(N) auxiliary space.");
        q1.setCompanies(List.of("Google", "Amazon", "Microsoft", "TCS"));
        q1.setDisplayOrder(1);

        PlacementQuestion q2 = new PlacementQuestion();
        q2.setTitle("Longest Substring Without Repeating Characters");
        q2.setCategory("CODING");
        q2.setTrackSlug("dsa");
        q2.setDifficulty("Medium");
        q2.setDescription("Given a string s, find the length of the longest substring without repeating characters.");
        q2.setSampleInput("s = \"abcabcbb\"");
        q2.setSampleOutput("3 (The answer is \"abc\", with the length of 3)");
        q2.setSolutionNotes("Use the Sliding Window technique with two pointers [left, right] and an unordered_map / Set to track seen characters in O(N) time.");
        q2.setCompanies(List.of("Amazon", "Microsoft", "Adobe"));
        q2.setDisplayOrder(2);

        PlacementQuestion q3 = new PlacementQuestion();
        q3.setTitle("Reverse a Singly Linked List");
        q3.setCategory("CODING");
        q3.setTrackSlug("dsa");
        q3.setDifficulty("Easy");
        q3.setDescription("Given the head of a singly linked list, reverse the list in-place and return the reversed list's head.");
        q3.setSampleInput("head = [1,2,3,4,5]");
        q3.setSampleOutput("[5,4,3,2,1]");
        q3.setSolutionNotes("Iterative solution using 3 pointers (prev = null, curr = head, nextNode = curr.next). Re-point curr.next = prev in O(N) time and O(1) space.");
        q3.setCompanies(List.of("TCS", "Infosys", "Wipro", "Cognizant"));
        q3.setDisplayOrder(3);

        // SQL
        PlacementQuestion q4 = new PlacementQuestion();
        q4.setTitle("Find the Second Highest Salary");
        q4.setCategory("SQL");
        q4.setTrackSlug("sql");
        q4.setDifficulty("Medium");
        q4.setDescription("Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, return NULL.");
        q4.setSampleInput("Employee table: { id: 1, salary: 100 }, { id: 2, salary: 200 }, { id: 3, salary: 300 }");
        q4.setSampleOutput("+---------------------+\n| SecondHighestSalary |\n+---------------------+\n| 200                 |\n+---------------------+");
        q4.setSolutionNotes("SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); OR using DENSE_RANK() window function.");
        q4.setCompanies(List.of("Google", "Microsoft", "Amazon", "Oracle"));
        q4.setDisplayOrder(4);

        PlacementQuestion q5 = new PlacementQuestion();
        q5.setTitle("Employees Earning More Than Their Managers");
        q5.setCategory("SQL");
        q5.setTrackSlug("sql");
        q5.setDifficulty("Easy");
        q5.setDescription("Write an SQL query to find the employees who earn more than their managers. The Employee table contains id, name, salary, managerId.");
        q5.setSampleInput("Employee: (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL)");
        q5.setSampleOutput("+----------+\n| Employee |\n+----------+\n| Joe      |\n+----------+");
        q5.setSolutionNotes("SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;");
        q5.setCompanies(List.of("Microsoft", "Razorpay", "TCS"));
        q5.setDisplayOrder(5);

        // CORE CS
        PlacementQuestion q6 = new PlacementQuestion();
        q6.setTitle("Explain the 4 Coffman Conditions for Deadlock");
        q6.setCategory("CORE_CS");
        q6.setTrackSlug("os");
        q6.setDifficulty("Medium");
        q6.setDescription("What are the four necessary and sufficient conditions for a deadlock to occur in an operating system, and how does OS prevent it?");
        q6.setSampleInput("Theoretical interview question");
        q6.setSampleOutput("1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait");
        q6.setSolutionNotes("A deadlock can only occur if all four conditions hold simultaneously. Preventing even one (e.g. imposing linear resource ordering to break circular wait) prevents deadlocks.");
        q6.setCompanies(List.of("Microsoft", "Amazon", "Samsung", "TCS"));
        q6.setDisplayOrder(6);

        PlacementQuestion q7 = new PlacementQuestion();
        q7.setTitle("Differentiate between 3NF and BCNF with Example");
        q7.setCategory("CORE_CS");
        q7.setTrackSlug("dbms");
        q7.setDifficulty("Medium");
        q7.setDescription("What is the difference between Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF)? Why is BCNF strictly stronger?");
        q7.setSampleInput("Relation R(A, B, C) with FDs: AB -> C, C -> B");
        q7.setSampleOutput("3NF allows: For X -> Y, either X is superkey OR Y is prime attribute. BCNF strictly requires X to be a superkey.");
        q7.setSolutionNotes("In 3NF, if Y is part of a candidate key (prime attribute), the FD is allowed even if X is not a superkey. In BCNF, every determinant must be a superkey.");
        q7.setCompanies(List.of("Oracle", "Google", "Razorpay", "Cognizant"));
        q7.setDisplayOrder(7);

        // APTITUDE
        PlacementQuestion q8 = new PlacementQuestion();
        q8.setTitle("Pipes & Cisterns Combined Work Rate");
        q8.setCategory("APTITUDE");
        q8.setTrackSlug("aptitude");
        q8.setDifficulty("Easy");
        q8.setDescription("Pipe A can fill a tank in 12 hours and Pipe B can fill it in 18 hours. If both pipes are opened simultaneously, how many hours will it take to fill the tank?");
        q8.setSampleInput("Pipe A: 12 hrs, Pipe B: 18 hrs");
        q8.setSampleOutput("7.2 hours (7 hours 12 minutes)");
        q8.setSolutionNotes("Total capacity = LCM(12, 18) = 36 units. Rate of A = 3 units/hr, Rate of B = 2 units/hr. Combined rate = 5 units/hr. Time = 36 / 5 = 7.2 hours.");
        q8.setCompanies(List.of("TCS NQT", "Wipro", "Infosys", "Capgemini"));
        q8.setDisplayOrder(8);

        placementQuestionRepository.saveAll(List.of(q1, q2, q3, q4, q5, q6, q7, q8));
    }
}

