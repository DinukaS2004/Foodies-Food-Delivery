# 🍔 Foodies API

A **production-ready Spring Boot REST API** for managing food items with **image uploads using AWS S3**.
This project demonstrates modern backend engineering practices including **RESTful API design, cloud storage integration, and clean layered architecture**.

---

## 📌 Overview

Foodies API is designed as a scalable backend service for food-related applications such as restaurant platforms or food ordering systems. The system allows users to create, retrieve, update, and delete food items while storing associated images securely in **AWS S3**.

This project focuses on implementing **industry-standard backend architecture** using Spring Boot and cloud services.

---

## 🏗️ Architecture

The project follows a **layered architecture pattern**:

```
Controller Layer
       │
Service Layer
       │
Repository Layer
       │
Database
```

### Components

* **Controller Layer** – Handles incoming HTTP requests
* **Service Layer** – Contains business logic
* **Repository Layer** – Manages database interactions using Spring Data JPA
* **AWS S3 Integration** – Handles image storage and retrieval

---

## 🚀 Features

* Create food items with image upload
* Retrieve food items from database
* Upload images directly to **AWS S3**
* Generate **unique filenames using UUID**
* RESTful API design
* Clean separation of concerns
* Exception handling with proper HTTP responses

---

## 🛠️ Tech Stack

**Backend**

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA

**Cloud Services**

* AWS S3 (Image Storage)

**Database**

* MySQL / PostgreSQL (configurable)

**Build Tool**

* Maven

**Libraries**

* Lombok
* AWS SDK v2

---

## 📂 Project Structure

```
foodiesapi
│
├── config
│   └── AWS configuration
│
├── entity
│   └── FoodEntity
│
├── repository
│   └── FoodRepository
│
├── service
│   └── FoodService
│   └── FoodServiceImpl
│
├── io
│   └── FoodRequest
│   └── FoodResponse
│
└── FoodiesapiApplication
```

---

## 🔗 API Endpoints

### Create Food Item

```
POST /foods
```

Request (Multipart Form Data):

```
name: String
description: String
price: Double
image: MultipartFile
```

---

### Get All Food Items

```
GET /foods
```

---

### Get Food By ID

```
GET /foods/{id}
```

---

### Delete Food Item

```
DELETE /foods/{id}
```

---

## ☁️ AWS S3 Integration

Images uploaded through the API are stored in **AWS S3 buckets**.

The application:

1. Extracts the file extension
2. Generates a unique filename using **UUID**
3. Uploads the file to S3
4. Stores the public image URL in the database

Example Image URL:

```
https://your-bucket-name.s3.amazonaws.com/uuid-image.jpg
```

---

## ⚙️ Configuration

Update your `application.properties`:

```
aws.s3.bucketname=your-bucket-name
aws.region=your-region
```

You must also configure AWS credentials:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

---

## ▶️ Running the Project

Clone the repository:

```
git clone https://github.com/yourusername/foodiesapi.git
```

Navigate to the project:

```
cd foodiesapi
```

Run the application:

```
./mvnw spring-boot:run
```

---

## 🧪 Future Improvements

* JWT Authentication
* Pagination & Filtering
* Docker Containerization
* CI/CD Pipeline
* API Documentation with Swagger
* Microservices architecture

---

## 👨‍💻 Author

**Dinuka Samarasinghe**

Software Engineering Undergraduate
Passionate about **Backend Engineering, Cloud Systems, and Scalable APIs**

---

## ⭐ Contribution

Contributions are welcome.
Feel free to fork this repository and submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.
