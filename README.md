# Faustus Price Checker  

## Status  
🚧 *Work in Progress* 🚧  

This project aims to provide an efficient way to check item prices from *Faustus Exchange* and *poe.ninja* using OCR and API data collection.  

### Project Status  
Currently, the project is **on hold** until the *Path of Exile 3.26 release date* or if *Path of Exile 2* sees significant improvements.  

---

## Overview  

**Faustus Price Checker** automates price checking for items in *Path of Exile* by:  
- Extracting data from *Faustus Exchange* using OCR.  
- Fetching JSON price data from *poe.ninja*.  
- Combining and updating this data in a Postgres database.  

The frontend and backend components are deployed using cloud services to ensure smooth performance and scalability.  

---

## Tech Stack  

### Frontend & Backend  
- **Frontend:** React  
- **Backend:** Node.js / Express  

### Database & Hosting  
- **Database:** PostgreSQL (Hosted on [Supabase](https://supabase.com/))  
- **Frontend & Backend Hosting:** [Render](https://render.com/)  

---

## Project Structure  

📂 **Archive Folder** *(Python scripts for data processing)*  
- 📝 `main.py` → Extracts item data from *Faustus Exchange* via OCR.  
- 📥 `ninjaApi.py` → Pulls item price data from *poe.ninja* API.  
- 🔄 `create_sequelize_seeder.py` → Merges JSON data and updates the PostgreSQL database.  

---

## Future Development Plans  
- 🔹 Resume work after PoE 3.26 release date confirmed.  
- 🔹 Improve OCR accuracy and performance.  
- 🔹 Enhance database query efficiency.  
- 🔹 Implement a UI for real-time price tracking.  
- 🔹 Consider integrating AI-powered price trend predictions.  

---

## Contributing  
This project is currently in an early stage and contributions are not open yet. Stay tuned for updates!  

---

## License  
📝 **TBD** – Will be defined once the project is further developed.  
