import requests
import os
import json
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase Admin SDK
firebase_config = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
}

cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)
db = firestore.client()
collection = db.collection("love_babbar_sheet")

URL = "https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/"

def scrape_love_babbar_sheet():
    response = requests.get(URL)
    soup = BeautifulSoup(response.content, "html.parser")

    all_problems = []

    for header in soup.find_all(["h2", "h3"]):
        topic = header.get_text(strip=True)
        next_sibling = header.find_next_sibling()

        while next_sibling and next_sibling.name != "table":
            next_sibling = next_sibling.find_next_sibling()

        if next_sibling and next_sibling.name == "table":
            rows = next_sibling.find_all("tr")[1:]  # Skip header row
            for row in rows:
                cols = row.find_all("td")
                question_name = cols[0].get_text(strip=True)

                if len(cols) >= 3:
                    link_tag = cols[2].find("a")
                    if link_tag and link_tag.get("href"):
                        problem = {
                            "topic": topic,
                            "question": question_name,
                            "link": link_tag["href"],
                        }
                        all_problems.append(problem)
    return all_problems

if __name__ == "__main__":
    problems = scrape_love_babbar_sheet()
    
    # Clear existing documents in the collection
    docs = collection.stream()
    for doc in docs:
        collection.document(doc.id).delete()
    
    # Insert all problems
    for problem in problems:
        # Use auto-generated document ID
        collection.add(problem)

    print(f"{len(problems)} problems inserted into Firestore.")
