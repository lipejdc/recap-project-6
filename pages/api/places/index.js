import Place from "@/db/models/Place";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  //Make sure the data base is connected
  await dbConnect();

  switch (request.method) {
    case "GET":
      return getAllPlaces(response);
    case "POST":
      return createPlace(request.body, response);
    default:
      return response.status(405).json({ status: "Method Not Allowed" });
  }
}

async function getAllPlaces(response) {
  try {
    //Get all places from the DB
    const places = await Place.find();
    console.log(places);
    //Return the places as json
    return response.status(200).json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return response.status(500).json({ status: "Error", message: error.message });
  }
}

async function createPlace(placeData, response) {
  try {
    console.log("Incoming place data:", placeData);
    //Create a new place object with the data the user entered in the form (placeData parameter)
    const newPlace = await Place.create(placeData);
    return response.status(201).json({ status: "Place created", data: newPlace });
  } catch (error) {
    console.error("Error creating place:", error);
    return response.status(400).json({ status: "Error", message: error.message });
  }
}
