document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById('search-form');
    const animalsContainer = document.getElementById('animals');
    const favoritesList = document.getElementById('favorites-list');
    const viewFavoritesButton = document.getElementById('view-favorites');
    const paginationContainer = document.getElementById('pagination');
    const loadingSpinner = document.getElementById('loading-spinner');

    let currentPage = 1;

    // Show and hide the loading spinner
    function showSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideSpinner() {
        loadingSpinner.style.display = 'none';
    }

    // Fetch animals based on user input
    async function fetchAnimals() {
        const location = document.getElementById('location').value;
        const type = document.getElementById('type').value;
        const breed = document.getElementById('breed').value;
        const age = document.getElementById('age').value;
        const size = document.getElementById('size').value;

        try {
            showSpinner();
            const queryParams = new URLSearchParams({
                location,
                type,
                breed,
                age,
                size,
                page: currentPage,
            });

            const response = await fetch(`/api/animals?${queryParams.toString()}`);
            const data = await response.json();

            if (data.animals && data.animals.length > 0) {
                displayAnimals(data.animals);
                updatePagination(data.pagination);
            } else {
                animalsContainer.innerHTML = `<p>No animals found matching the criteria.</p>`;
                paginationContainer.innerHTML = ''; // Clear pagination
            }
        } catch (error) {
            console.error('Error fetching animals:', error);
        } finally {
            hideSpinner();
        }
    }

    // Display animals in the DOM
    function displayAnimals(animals) {
        animalsContainer.innerHTML = ''; // Clear previous results
        animals.forEach(animal => {
            const animalDiv = document.createElement('div');
            animalDiv.classList.add('animal');
            animalDiv.innerHTML = `
                <img src="${animal.photos[0]?.small || 'https://via.placeholder.com/150'}" alt="${animal.name}">
                <h3>
                    <a href="${animal.url}" target="_blank" rel="noopener noreferrer">${animal.name}</a>
                </h3>
                <p>Type: ${animal.type}</p>
                <p>Breed: ${animal.breeds.primary}</p>
                <p>Age: ${animal.age}</p>
                <p>Size: ${animal.size}</p>
                <button onclick="saveFavorite('${animal.id}')">Add to Favorites</button>
            `;
            animalsContainer.appendChild(animalDiv);
        });
    }

    // Handle search form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1; // Reset to the first page
        fetchAnimals();
    });

    // View favorite animals
    viewFavoritesButton.addEventListener('click', async () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = ''; // Clear the existing favorites list

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorite animals added yet.</p>';
            return;
        }

        for (const id of favorites) {
            try {
                const response = await fetch(`/api/animals/${id}`);
                const data = await response.json();
                const animal = data.animal;

                // Create a list item for each favorite
                const listItem = document.createElement('div');
                listItem.classList.add('favorite-animal');

                listItem.innerHTML = `
                    <a href="${animal.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 20px;">
                        <img src="${animal.photos[0]?.small || 'https://via.placeholder.com/150'}" 
                             alt="${animal.name}" style="width: 150px; height: auto; object-fit: cover; border-radius: 8px;" />
                    </a>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                        <h3 style="margin: 0;">
                            <a href="${animal.url}" target="_blank" rel="noopener noreferrer">${animal.name}</a>
                        </h3>
                        <p style="margin: 0;">Type: ${animal.type}</p>
                        <p style="margin: 0;">Breed: ${animal.breeds.primary}</p>
                        <button class="hover-button" onclick="removeFavorite('${id}')">Remove</button>
                    </div>
                `;
                favoritesList.appendChild(listItem);
            } catch (error) {
                console.error(`Error fetching details for favorite ID ${id}:`, error);
            }
        }
    });

    // Remove favorite from localStorage
    window.removeFavorite = (id) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(favoriteId => favoriteId !== id);  // Remove the selected ID
        localStorage.setItem('favorites', JSON.stringify(favorites));  // Update local storage

        // Refresh the displayed list after removing
        const favoriteItem = document.querySelector(`.favorite-animal button[onclick="removeFavorite('${id}')"]`).parentElement;
        if (favoriteItem) {
            favoriteItem.remove();  // Remove the element from DOM
        }

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorite animals added yet.</p>';  // Show message if no favorites
        }

        alert(`${id} has been removed from favorites.`);
    };

    // Save favorite to localStorage
    window.saveFavorite = (id) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(id)) {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${id} has been added to favorites.`);
        } else {
            alert(`${id} is already in your favorites.`);
        }
    };

    // Pagination update function
    function updatePagination(pagination) {
        paginationContainer.innerHTML = '';  // Clear previous pagination

        if (pagination.current_page > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.onclick = () => {
                currentPage--;
                fetchAnimals();
            };
            paginationContainer.appendChild(prevButton);
        }

        if (pagination.current_page < pagination.total_pages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.onclick = () => {
                currentPage++;
                fetchAnimals();
            };
            paginationContainer.appendChild(nextButton);
        }
    }
    
    // Home button to redirect to the root of the app
    document.getElementById("home-button").addEventListener("click", () => {
        window.location.href = "/";  // Redirects to the root of your app
    });

});
