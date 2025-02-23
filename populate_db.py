#!/usr/bin/python3
"""Script to populate the database with comprehensive test data"""
from models import storage
from models.state import State
from models.city import City
from models.user import User
from models.place import Place
from models.amenity import Amenity
from models.review import Review

def populate_database():
    """Populate the database with test data"""
    # Create Users
    users = [
        User(
            email="john@example.com",
            password="password123",
            first_name="John",
            last_name="Doe"
        ),
        User(
            email="jane@example.com",
            password="password456",
            first_name="Jane",
            last_name="Smith"
        ),
        User(
            email="bob@example.com",
            password="password789",
            first_name="Bob",
            last_name="Johnson"
        )
    ]
    
    for user in users:
        user.save()
    
    # Create States
    states_data = {
        "California": ["San Francisco", "Los Angeles", "San Diego"],
        "New York": ["New York City", "Buffalo", "Albany"],
        "Florida": ["Miami", "Orlando", "Tampa"],
        "Texas": ["Austin", "Houston", "Dallas"],
        "Washington": ["Seattle", "Spokane", "Tacoma"]
    }
    
    states = {}
    cities = {}
    
    for state_name, city_names in states_data.items():
        state = State(name=state_name)
        state.save()
        states[state_name] = state
        
        for city_name in city_names:
            city = City(name=city_name, state_id=state.id)
            city.save()
            cities[city_name] = city
    
    # Create Amenities
    amenities_list = [
        "WiFi",
        "Air conditioning",
        "Heating",
        "Kitchen",
        "TV",
        "Pool",
        "Gym",
        "Free parking",
        "Washing machine",
        "Dryer",
        "Iron",
        "Workspace",
        "Hot tub",
        "BBQ grill",
        "Beach access"
    ]
    
    amenities = {}
    for amenity_name in amenities_list:
        amenity = Amenity(name=amenity_name)
        amenity.save()
        amenities[amenity_name] = amenity
    
    # Create Places with varied amenities
    places_data = [
        {
            "name": "Cozy SF Studio",
            "city": "San Francisco",
            "user": users[0],
            "description": "A beautiful studio in the heart of San Francisco",
            "number_rooms": 1,
            "number_bathrooms": 1,
            "max_guest": 2,
            "price_by_night": 150,
            "latitude": 37.774929,
            "longitude": -122.419418,
            "amenities": ["WiFi", "TV", "Kitchen", "Heating"]
        },
        {
            "name": "LA Luxury Villa",
            "city": "Los Angeles",
            "user": users[1],
            "description": "Spacious villa with pool and amazing views",
            "number_rooms": 4,
            "number_bathrooms": 3,
            "max_guest": 8,
            "price_by_night": 500,
            "latitude": 34.052235,
            "longitude": -118.243683,
            "amenities": ["Pool", "WiFi", "Air conditioning", "Gym", "BBQ grill"]
        },
        {
            "name": "Manhattan Penthouse",
            "city": "New York City",
            "user": users[2],
            "description": "Luxury penthouse with stunning city views",
            "number_rooms": 3,
            "number_bathrooms": 2,
            "max_guest": 6,
            "price_by_night": 800,
            "latitude": 40.712776,
            "longitude": -74.005974,
            "amenities": ["WiFi", "Air conditioning", "Kitchen", "Gym", "Hot tub"]
        },
        {
            "name": "Miami Beach House",
            "city": "Miami",
            "user": users[0],
            "description": "Beautiful house steps from the beach",
            "number_rooms": 3,
            "number_bathrooms": 2,
            "max_guest": 6,
            "price_by_night": 400,
            "latitude": 25.761680,
            "longitude": -80.191790,
            "amenities": ["Beach access", "Pool", "WiFi", "BBQ grill"]
        },
        {
            "name": "Austin Modern Loft",
            "city": "Austin",
            "user": users[1],
            "description": "Modern loft in downtown Austin",
            "number_rooms": 2,
            "number_bathrooms": 2,
            "max_guest": 4,
            "price_by_night": 250,
            "latitude": 30.266666,
            "longitude": -97.733330,
            "amenities": ["WiFi", "Kitchen", "Workspace", "Free parking"]
        }
    ]
    
    places = []
    for place_data in places_data:
        place = Place(
            city_id=cities[place_data["city"]].id,
            user_id=place_data["user"].id,
            name=place_data["name"],
            description=place_data["description"],
            number_rooms=place_data["number_rooms"],
            number_bathrooms=place_data["number_bathrooms"],
            max_guest=place_data["max_guest"],
            price_by_night=place_data["price_by_night"],
            latitude=place_data["latitude"],
            longitude=place_data["longitude"]
        )
        place.save()
        
        # Add amenities to place
        for amenity_name in place_data["amenities"]:
            place.amenities.append(amenities[amenity_name])
        
        places.append(place)
    
    # Create Reviews
    reviews_data = [
        {
            "place": places[0],
            "user": users[1],
            "text": "Great cozy place in the heart of SF! Loved the location."
        },
        {
            "place": places[0],
            "user": users[2],
            "text": "Perfect for a weekend getaway. Very clean and well maintained."
        },
        {
            "place": places[1],
            "user": users[0],
            "text": "Amazing villa! The pool and views are incredible."
        },
        {
            "place": places[1],
            "user": users[2],
            "text": "Luxurious stay with great amenities. Will definitely come back!"
        },
        {
            "place": places[2],
            "user": users[0],
            "text": "Stunning penthouse with breathtaking views of NYC."
        },
        {
            "place": places[2],
            "user": users[1],
            "text": "Perfect location and amazing amenities. Worth every penny!"
        },
        {
            "place": places[3],
            "user": users[2],
            "text": "Beautiful beach house! Steps from the ocean."
        },
        {
            "place": places[4],
            "user": users[0],
            "text": "Great modern loft in the heart of Austin. Perfect location!"
        }
    ]
    
    for review_data in reviews_data:
        review = Review(
            place_id=review_data["place"].id,
            user_id=review_data["user"].id,
            text=review_data["text"]
        )
        review.save()
    
    storage.save()
    print("Database populated successfully!")

if __name__ == "__main__":
    # Clear existing data (optional)
    for cls in [Review, Place, State, City, User, Amenity]:
        for obj in storage.all(cls).values():
            obj.delete()
    storage.save()
    
    # Populate with new data
    populate_database()
