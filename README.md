
## Adopt-a-Pet Finder with Petfinder API by Aniya Stanford

## Description
This project is a web application that enables users to search for adoptable pets, view their details, and save their favorites. The application integrates the Petfinder API to dynamically fetch and display pet information, offering a seamless and user-friendly experience for potential adopters.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/stanfordaniya/Adopt-A-Pet.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Adopt-A-Pet
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your API credentials:
   ```
   PETFINDER_API_KEY=your-api-key
   PETFINDER_API_SECRET=your-api-secret
   PORT=5000
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Open your browser and navigate to `http://localhost:5000`.

## Usage
The Adopt-a-Pet Finder application provides an intuitive interface for users to search for pets, view details, and save their favorites. Here’s how to use it:

1. **Search for Pets**: 
   - Enter a location (e.g., ZIP code) and select filters like species, breed, age, and size.
   - Click the **Search** button to initiate a query to the Petfinder API.
   - The app will display a list of pets matching your search criteria, showing the name, species, breed, and a thumbnail image.

2. **View Pet Details**:
   - Click on any pet name or image to view more details.
   - This includes information such as the pet’s description, health details, and shelter contact information.

3. **Save Favorites**:
   - Click the **Add to Favorites** button to save pets for later review.
   - Access saved pets in the **Favorites** section for easy comparison.

4. **Pagination**:
   - Navigate through multiple pages of results if your search query returns many pets.
   - Use the **Next** and **Previous** buttons to browse through the pages seamlessly.

This app is designed to connect potential adopters with animals in need, making it easier for shelters and rescue groups to find loving homes for their pets.
