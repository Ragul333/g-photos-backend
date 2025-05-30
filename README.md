# Google Photos Clone - Backend

## Overview
This backend service is a RESTful API built with Node.js and MongoDB to power the Google Photos clone application. It manages photo uploads, metadata, favorites, trash, and search.

## Features

- **Photo Management**
  - Upload photos
  - Store photo metadata: filename, upload date, tags.
  - Soft delete .
  - Permanent delete.

- **Favorites**
  - Mark/unmark photos as favorites using a separate `favorites` collection.

- **Tags and Metadata**
  - Add tags to photos.
  - Update and delete tags.

- **Search**
  - Text search on tags names using MongoDB aggregation.

- **Photo Info**
  - Fetch photo details including metadata, tags associations.

- **Error Handling**
  - Consistent error handling with middleware.
  - Async functions wrapped with catchAsync utility.

## Technologies Used
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Multer and Dummy S3 upload simulation

## API Endpoints Overview

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| POST   | `/upload`       | Upload multiple photos              |
| PUT    | `/trash/:id`    | Move a photo to Trash (soft delete) |
| PUT    | `/restore/:id`  | Restore a photo from Trash          |
| GET    | `/`             | Get all non-deleted photos          |
| GET    | `/trash`        | Get all trashed photos              |
| PATCH  | `/:id/metadata` | Update photo metadata and tags      |
| GET    | `/search?q=`    | Search photos by name/tags   |
| GET    | `/:id/metadata` | Get metadata for a specific photo   |

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| GET    | `/`      | Get all available tags           |
| PUT    | `/:id`   | Update tags for a specific photo |

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| PUT    | `/:id`   | Toggle favorite status of a photo |
| GET    | `/`      | Get all favorite photos           |



## Setup Instructions
  1. git clone https://github.com/Ragul333/g-photos-backend.git
  2. cd g-photos-backend
  3. add .env.development file 
  4. npm install
  5. npm run dev
