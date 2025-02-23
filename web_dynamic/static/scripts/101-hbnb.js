$(document).ready(() => {
    const amenities = {}
    const states = {}
    const cities = {}
  
    // Amenities checkbox handler
    $('.amenities input[type="checkbox"]').change(function () {
      if (this.checked) {
        amenities[$(this).data("id")] = $(this).data("name")
      } else {
        delete amenities[$(this).data("id")]
      }
  
      const amenitiesList = Object.values(amenities).join(", ")
      $(".amenities h4").text(amenitiesList || "\u00A0")
    })
  
    // States checkbox handler
    $('.locations h2 input[type="checkbox"]').change(function () {
      if (this.checked) {
        states[$(this).data("id")] = $(this).data("name")
      } else {
        delete states[$(this).data("id")]
      }
      updateLocations()
    })
  
    // Cities checkbox handler
    $('.locations li li input[type="checkbox"]').change(function () {
      if (this.checked) {
        cities[$(this).data("id")] = $(this).data("name")
      } else {
        delete cities[$(this).data("id")]
      }
      updateLocations()
    })
  
    function updateLocations() {
      const locations = [...Object.values(states), ...Object.values(cities)].join(", ")
      $(".locations h4").text(locations || "\u00A0")
    }
  
    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", (data) => {
      if (data.status === "OK") {
        $("#api_status").addClass("available")
      } else {
        $("#api_status").removeClass("available")
      }
    })
  
    // Search button click handler
    $("button").click(() => {
      fetchPlaces()
    })
  
    function fetchPlaces() {
      $.ajax({
        url: "http://0.0.0.0:5001/api/v1/places_search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          amenities: Object.keys(amenities),
          states: Object.keys(states),
          cities: Object.keys(cities),
        }),
        success: (data) => {
          $(".places").empty()
          data.forEach((place) => {
            const article = `
              <article data-id="${place.id}">
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
                <div class="reviews">
                  <h2>Reviews <span class="toggle-reviews" style="cursor: pointer; font-size: 12px; margin-left: 10px;">show</span></h2>
                  <div class="reviews-list"></div>
                </div>
              </article>
            `
            $(".places").append(article)
          })
        },
      })
    }
  
    // Reviews toggle handler
    $(document).on("click", ".toggle-reviews", function () {
      const article = $(this).closest("article")
      const placeId = article.data("id")
      const reviewsList = article.find(".reviews-list")
      const toggleButton = $(this)
  
      if (toggleButton.text() === "show") {
        // Fetch and display reviews
        // Fetch reviews and user data
        async function fetchReviewData(placeId) {
          const reviews = await $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`);
          const reviewPromises = reviews.map(async (review) => {
            const user = await $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`);
            const date = new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            return `
              <div class="review">
            <h3>From ${user.first_name} ${user.last_name} on ${date}</h3>
            <p>${review.text}</p>
              </div>
            `;
          });

          const reviewsHtml = await Promise.all(reviewPromises);
          reviewsList.html(reviewsHtml.join(''));
          toggleButton.text("hide");
        }

        // Call the async function
        fetchReviewData(placeId).catch(error => console.error('Error fetching reviews:', error));
      } else {
        // Hide reviews
        reviewsList.empty()
        toggleButton.text("show")
      }
    })
  
    // Initial fetch
    fetchPlaces()
  })
  
  