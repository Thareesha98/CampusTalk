package com.example.taskmanager;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * TaskManager - A simple in-memory task management system.
 * -------------------------------------------------------
 * Features:
 * - Create, update, delete, and search for tasks and projects.
 * - Assign users to projects.
 * - Track task status, due dates, and priorities.
 * - Provides filtering, sorting, and reporting features.
 * - Uses collections, streams, and enums for a realistic structure.
 *
 * Author: ChatGPT (GPT-5)
 * Date: 2025-10-23
 */
public class TaskManager {

    private static final Logger LOGGER = Logger.getLogger(TaskManager.class.getName());
    private final Map<Integer, Project> projects = new HashMap<>();
    private final Map<Integer, User> users = new HashMap<>();
    private final AtomicInteger taskIdCounter = new AtomicInteger(1);
    private final AtomicInteger projectIdCounter = new AtomicInteger(1);
    private final AtomicInteger userIdCounter = new AtomicInteger(1);

    // ============================ ENUMS ============================ //

    public enum Priority { LOW, MEDIUM, HIGH, CRITICAL }
    public enum Status { TODO, IN_PROGRESS, DONE, BLOCKED }

    // ============================ MODELS ============================ //

    public static class User {
        private final int id;
        private String name;
        private String email;
        private final LocalDate joinedDate;

        public User(int id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.joinedDate = LocalDate.now();
        }

        public int getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public LocalDate getJoinedDate() { return joinedDate; }

        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }

        @Override
        public String toString() {
            return String.format("User{id=%d, name='%s', email='%s', joined=%s}", id, name, email, joinedDate);
        }
    }

    public static class Task {
        private final int id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private Priority priority;
        private Status status;
        private User assignedTo;
        private LocalDate createdAt;
        private LocalDate updatedAt;

        public Task(int id, String title, String description, LocalDate dueDate, Priority priority) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
            this.status = Status.TODO;
            this.createdAt = LocalDate.now();
            this.updatedAt = LocalDate.now();
        }

        public int getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public LocalDate getDueDate() { return dueDate; }
        public Priority getPriority() { return priority; }
        public Status getStatus() { return status; }
        public User getAssignedTo() { return assignedTo; }

        public void setTitle(String title) { this.title = title; }
        public void setDescription(String description) { this.description = description; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public void setPriority(Priority priority) { this.priority = priority; }
        public void setStatus(Status status) { this.status = status; }
        public void assignTo(User user) { this.assignedTo = user; }
        public void updateTimestamp() { this.updatedAt = LocalDate.now(); }

        @Override
        public String toString() {
            return String.format("Task{id=%d, title='%s', status=%s, priority=%s, assignedTo=%s}",
                    id, title, status, priority, assignedTo != null ? assignedTo.getName() : "Unassigned");
        }
    }

    public static class Project {
        private final int id;
        private String name;
        private String description;
        private final LocalDate createdDate;
        private final List<Task> tasks = new ArrayList<>();
        private final List<User> members = new ArrayList<>();

        public Project(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.createdDate = LocalDate.now();
        }

        public int getId() { return id; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public List<Task> getTasks() { return tasks; }
        public List<User> getMembers() { return members; }

        public void setName(String name) { this.name = name; }
        public void setDescription(String description) { this.description = description; }

        public void addMember(User user) {
            if (!members.contains(user)) {
                members.add(user);
            }
        }

        public void addTask(Task task) {
            tasks.add(task);
        }

        @Override
        public String toString() {
            return String.format("Project{id=%d, name='%s', tasks=%d, members=%d}", id, name, tasks.size(), members.size());
        }
    }

    // ============================ CORE METHODS ============================ //

    // ---------- User Management ---------- //

    public User createUser(String name, String email) {
        int id = userIdCounter.getAndIncrement();
        User user = new User(id, name, email);
        users.put(id, user);
        LOGGER.info("Created user: " + user);
        return user;
    }

    public Optional<User> getUser(int id) {
        return Optional.ofNullable(users.get(id));
    }

    public List<User> listUsers() {
        return new ArrayList<>(users.values());
    }

    // ---------- Project Management ---------- //

    public Project createProject(String name, String description) {
        int id = projectIdCounter.getAndIncrement();
        Project project = new Project(id, name, description);
        projects.put(id, project);
        LOGGER.info("Created project: " + project);
        return project;
    }

    public Optional<Project> getProject(int id) {
        return Optional.ofNullable(projects.get(id));
    }

    public List<Project> listProjects() {
        return new ArrayList<>(projects.values());
    }

    // ---------- Task Management ---------- //

    public Task createTask(int projectId, String title, String desc, LocalDate due, Priority priority) {
        Project project = projects.get(projectId);
        if (project == null) {
            LOGGER.warning("Project not found for ID: " + projectId);
            throw new IllegalArgumentException("Invalid project ID");
        }
        int id = taskIdCounter.getAndIncrement();
        Task task = new Task(id, title, desc, due, priority);
        project.addTask(task);
        LOGGER.info("Created task: " + task);
        return task;
    }

    public List<Task> listAllTasks() {
        return projects.values().stream()
                .flatMap(p -> p.getTasks().stream())
                .collect(Collectors.toList());
    }

    public List<Task> findTasksByStatus(Status status) {
        return listAllTasks().stream()
                .filter(t -> t.getStatus() == status)
                .collect(Collectors.toList());
    }

    public List<Task> findTasksByPriority(Priority priority) {
        return listAllTasks().stream()
                .filter(t -> t.getPriority() == priority)
                .collect(Collectors.toList());
    }

    public void assignTask(int projectId, int taskId, int userId) {
        Project project = projects.get(projectId);
        if (project == null) throw new IllegalArgumentException("Project not found");
        Optional<Task> taskOpt = project.getTasks().stream().filter(t -> t.getId() == taskId).findFirst();
        User user = users.get(userId);
        if (user == null) throw new IllegalArgumentException("User not found");
        taskOpt.ifPresent(task -> {
            task.assignTo(user);
            task.updateTimestamp();
            LOGGER.info(String.format("Assigned task %d to %s", taskId, user.getName()));
        });
    }

    // ============================ REPORTS ============================ //

    public void printProjectSummary() {
        System.out.println("\n=== Project Summary ===");
        projects.values().forEach(p -> {
            System.out.printf("Project: %s (%d tasks, %d members)%n", p.getName(), p.getTasks().size(), p.getMembers().size());
        });
    }

    public void printOverdueTasks() {
        System.out.println("\n=== Overdue Tasks ===");
        LocalDate today = LocalDate.now();
        listAllTasks().stream()
                .filter(t -> t.getDueDate().isBefore(today) && t.getStatus() != Status.DONE)
                .forEach(System.out::println);
    }

    public void printUserTasks(int userId) {
        System.out.println("\n=== Tasks Assigned to User ===");
        listAllTasks().stream()
                .filter(t -> t.getAssignedTo() != null && t.getAssignedTo().getId() == userId)
                .forEach(System.out::println);
    }

    // ============================ UTILITIES ============================ //

    public void exportData() {
        System.out.println("\n=== Exporting Data ===");
        projects.values().forEach(project -> {
            System.out.printf("\nProject: %s%n", project.getName());
            project.getTasks().forEach(task -> System.out.println("  " + task));
        });
    }

    public void deleteProject(int projectId) {
        if (projects.remove(projectId) != null) {
            LOGGER.info("Deleted project with ID: " + projectId);
        } else {
            LOGGER.warning("No project found to delete with ID: " + projectId);
        }
    }

    // ============================ DEMO MAIN ============================ //

    public static void main(String[] args) {
        TaskManager tm = new TaskManager();

        // Create users
        User alice = tm.createUser("Alice", "alice@example.com");
        User bob = tm.createUser("Bob", "bob@example.com");

        // Create project
        Project p1 = tm.createProject("AI Platform", "Build a scalable AI backend system");
        p1.addMember(alice);
        p1.addMember(bob);

        // Create tasks
        tm.createTask(p1.getId(), "Design database schema", "Create ERD and schema", LocalDate.now().plusDays(7), Priority.HIGH);
        tm.createTask(p1.getId(), "Implement API", "Develop RESTful APIs", LocalDate.now().plusDays(10), Priority.CRITICAL);
        tm.createTask(p1.getId(), "Write documentation", "Create developer guide", LocalDate.now().plusDays(12), Priority.MEDIUM);

        // Assign tasks
        tm.assignTask(p1.getId(), 1, alice.getId());
        tm.assignTask(p1.getId(), 2, bob.getId());

        // Generate reports
        tm.printProjectSummary();
        tm.printUserTasks(alice.getId());
        tm.printOverdueTasks();
        tm.exportData();
    }
}

