import Place from "@/db/models/Place";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  switch (request.method) {
    case "GET":
      return handleGet(id, response);
    case "PUT":
      return handlePut(id, request.body, response);
    case "DELETE":
      return handleDelete(id, response);
    default:
      return response.status(405).json({ status: "Method Not Allowed" });
  }
}

async function handleGet(id, response) {
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

async function handlePut(id, data, response) {
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

async function handleDelete(id, response) {
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
