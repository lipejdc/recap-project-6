import Place from "@/db/models/Place";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  //Make sure data base is connected
  await dbConnect();
  //Get id from the url
  const { id } = request.query;

  switch (request.method) {
    case "GET":
      return getPlaceById(id, response);
    case "PUT":
      return editPlaceById(id, request.body, response);
    case "DELETE":
      return deletePlaceById(id, response);
    default:
      return response.status(405).json({ status: "Method Not Allowed" });
  }
}

async function getPlaceById(id, response) {
  try {
    const place = await Place.findById(id);
    if (!place) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json(place);
  } catch (error) {
    response.status(500).json({ status: "Error", message: error.message });
  }
}

async function editPlaceById(id, data, response) {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPlace) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json({ status: `Place ${id} updated!`, data: updatedPlace });
  } catch (error) {
    response.status(500).json({ status: "Error", message: error.message });
  }
}

async function deletePlaceById(id, response) {
  try {
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json({ status: `Place ${id} successfully deleted.` });
  } catch (error) {
    response.status(500).json({ status: "Error", message: error.message });
  }
}
