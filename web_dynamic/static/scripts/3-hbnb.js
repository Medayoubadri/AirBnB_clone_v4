$(document).ready(() => {
    const amenities = {}

    $('input[type="checkbox"]').change(function () {
        if (this.checked) {
            amenities[$(this).data("id")] = $(this).data("name")
        } else {
            delete amenities[$(this).data("id")]
        }

        const amenitiesList = Object.values(amenities).join(", ")
        $(".amenities h4").text(amenitiesList || "\u00A0")
    })

    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", (data) => {
        if (data.status === "OK") {
            $("#api_status").addClass("available")
        } else {
            $("#api_status").removeClass("available")
        }
    })

    // Fetch places
    $.ajax({
        url: "http://0.0.0.0:5001/api/v1/places_search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: (data) => {
            data.forEach((place) => {
                const article = `
            <article>
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
            </article>
          `
                $(".places").append(article)
            })
        },
    })
})

