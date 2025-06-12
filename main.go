package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type Project struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	ProjectURL  string `json:"project_url"`
	Tags        string `json:"tags"`
}

type Admin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var db *sql.DB

func main() {
	// Initialize SQLite database
	var err error
	db, err = sql.Open("sqlite3", "./portfolio.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Create tables if they don't exist
	initDB()

	// Initialize router
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/projects", getProjects).Methods("GET")
	r.HandleFunc("/api/projects", authMiddleware(createProject)).Methods("POST")
	r.HandleFunc("/api/projects/{id}", authMiddleware(updateProject)).Methods("PUT")
	r.HandleFunc("/api/projects/{id}", authMiddleware(deleteProject)).Methods("DELETE")
	r.HandleFunc("/api/login", handleLogin).Methods("POST")
	r.HandleFunc("/api/profile", authMiddleware(updateProfile)).Methods("POST", "PUT")
	r.HandleFunc("/api/profile", getProfile).Methods("GET")

	// Page routes
	r.HandleFunc("/", homeHandler).Methods("GET")

	// Serve static files
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	fmt.Printf("Server running at http://localhost:8080\n")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func initDB() {
	// Create projects table
	projectsTable := `
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        project_url TEXT,
        tags TEXT
    );`

	// Create admins table
	adminsTable := `
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );`

	// Create profile table
	profileTable := `
    CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY,
        name TEXT,
        title TEXT,
        bio TEXT,
        skills TEXT,
        image_url TEXT
    );`

	_, err := db.Exec(projectsTable)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(adminsTable)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(profileTable)
	if err != nil {
		panic(err)
	}

	defaultAdmin := "Bigman"
	defaultPassword := "Bs.25456580"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`
        INSERT OR IGNORE INTO admins (username, password_hash)
        VALUES (?, ?)`, defaultAdmin, string(hashedPassword))
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`
        INSERT OR IGNORE INTO profile (id, name, title, bio, skills, image_url)
        VALUES (1, 'Default Name', 'Default Title', 'Default Bio', 'Go,JavaScript,React,Node.js,SQL', '')`)
	if err != nil {
		panic(err)
	}
}

func getProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description, image_url, project_url, tags FROM projects")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.ImageURL, &p.ProjectURL, &p.Tags)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		projects = append(projects, p)
	}

	json.NewEncoder(w).Encode(projects)
}

func updateProject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var project Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := db.Exec(`
        UPDATE projects 
        SET title=?, description=?, image_url=?, project_url=?, tags=?
        WHERE id=?`,
		project.Title, project.Description, project.ImageURL, project.ProjectURL, project.Tags, vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(project)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_, err := db.Exec("DELETE FROM projects WHERE id=?", vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	var admin Admin
	if err := json.NewDecoder(r.Body).Decode(&admin); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var storedHash string
	err := db.QueryRow("SELECT password_hash FROM admins WHERE username = ?", admin.Username).Scan(&storedHash)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(admin.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// In a real application, you would generate and return a JWT token here
	w.WriteHeader(http.StatusOK)
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: Implement proper JWT token validation
		// For now, this is a placeholder that allows all requests
		next(w, r)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/index.html")
}

func uploadFile(file io.Reader, filename string) (string, error) {
	// Create uploads directory if it doesn't exist
	uploadDir := "./static/uploads"
	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		return "", err
	}

	// Generate unique filename
	filename = filepath.Join(uploadDir, filename)

	// Create the file
	dst, err := os.Create(filename)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// Copy the uploaded file to the created file
	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}

	// Return the relative path to the file
	return "/static/uploads/" + filepath.Base(filename), nil
}

// Update the createProject handler
func createProject(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form
	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get the file from the form
	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Upload the file
	imageURL, err := uploadFile(file, header.Filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create the project with the image URL
	project := Project{
		Title:       r.FormValue("title"),
		Description: r.FormValue("description"),
		ImageURL:    imageURL,
		ProjectURL:  r.FormValue("project_url"),
		Tags:        r.FormValue("tags"),
	}

	result, err := db.Exec(`
        INSERT INTO projects (title, description, image_url, project_url, tags)
        VALUES (?, ?, ?, ?, ?)`,
		project.Title, project.Description, project.ImageURL, project.ProjectURL, project.Tags)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	project.ID = int(id)
	json.NewEncoder(w).Encode(project)
}

func updateProfile(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Methods", "POST, PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Parse multipart form with 10MB max memory
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Get form values
	name := r.FormValue("name")
	title := r.FormValue("title")
	bio := r.FormValue("bio")
	skills := r.FormValue("skills")

	var imageURL string
	// Handle file upload if present
	if file, handler, err := r.FormFile("image"); err == nil {
		defer file.Close()

		// Generate unique filename
		ext := filepath.Ext(handler.Filename)
		newFileName := fmt.Sprintf("profile_%d%s", time.Now().UnixNano(), ext)

		imageURL, err = uploadFile(file, newFileName)
		if err != nil {
			http.Error(w, "Failed to upload image: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Update database
	query := `
        UPDATE profile 
        SET name = ?, 
            title = ?, 
            bio = ?,
            skills = ?
        WHERE id = 1`

	args := []interface{}{name, title, bio, skills}

	// Add image_url to update if present
	if imageURL != "" {
		query = `
            UPDATE profile 
            SET name = ?, 
                title = ?, 
                bio = ?,
                skills = ?,
                image_url = ?
            WHERE id = 1`
		args = append(args, imageURL)
	}

	_, err := db.Exec(query, args...)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Profile updated successfully",
	})
}

func getProfile(w http.ResponseWriter, r *http.Request) {
	var profile struct {
		Name     string `json:"name"`
		Title    string `json:"title"`
		Bio      string `json:"bio"`
		Skills   string `json:"skills"`
		ImageURL string `json:"image_url"`
	}

	err := db.QueryRow("SELECT name, title, bio, skills, image_url FROM profile WHERE id = 1").Scan(
		&profile.Name,
		&profile.Title,
		&profile.Bio,
		&profile.Skills,
		&profile.ImageURL,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}
