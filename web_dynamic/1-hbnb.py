#!/usr/bin/python3
"""Flask app with dynamic amenities selection"""
from flask import Flask, render_template
from models import storage
import uuid

app = Flask(__name__)
app.url_map.strict_slashes = False


@app.route("/1-hbnb/")
def hbnb_filters():
    """Generate page with dynamic amenities"""
    states = storage.all("State")
    amenities = storage.all("Amenity")
    places = storage.all("Place")
    cache_id = str(uuid.uuid4())
    return render_template(
        "1-hbnb.html",
        states=states,
        amenities=amenities,
        places=places,
        cache_id=cache_id,
    )


@app.teardown_appcontext
def teardown_db(*args, **kwargs):
    """Close database or file storage"""
    storage.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
