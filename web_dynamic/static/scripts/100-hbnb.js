$(document).ready(function () {
    const amenities = {};
    const states = {};
    const cities = {};
  
    // Amenities checkbox handler
    $('.amenities input[type="checkbox"]').change(function () {
      if (this.checked) {
        amenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete amenities[$(this).data('id')];
      }
      
      const amenitiesList = Object.values(amenities).join(', ');
      $('.amenities h4').text(amenitiesList || '\u00A0');
    });
  
    // States checkbox handler
    $('.locations h2 input[type="checkbox"]').change(function () {
      if (this.checked) {
        states[$(this).data('id')] = $(this).data('name');
      } else {
        delete states[$(this).data('id')];
      }
      updateLocations();
    });
  
    // Cities checkbox handler
    $('.locations li li input[type="checkbox"]').change(function () {
      if (this.checked) {
        cities[$(this).data('id')] = $(this).data('name');
      } else {
        delete cities[$(this).data('id')];
      }
      updateLocations();
    });
  
    function updateLocations() {
      const locations = [...Object.values(states), ...Object.values(cities)].join(', ');
      $('.locations h4').text(locations || '\u00A0');
    }
  
    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }).fail(function () {
      $('#api_status').removeClass('available');
    });
  
    // Search button click handler
    $('button').click(function () {
      fetchPlaces();
    });
  
    function fetchPlaces() {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: Object.keys(amenities),
          states: Object.keys(states),
          cities: Object.keys(cities)
        }),
        success: function (data) {
          $('.places').empty();
          data.forEach(place => {
            const article = `
              <article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>
            `;
            $('.places').append(article);
          });
        },
      });
    }
  
    // Initial fetch of all places
    fetchPlaces();
  });
