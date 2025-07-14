import Place from "@/db/models/Place";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    try {
      const place = await Place.findById(id);
      console.log(place);
      

      if (!place) {
        response.status(404).json({ status: "Not Found" });
        return;
      }

      response.status(200).json(place);
    } catch (error) {
      response.status(500).json({ status: "Error", message: error.message });
    }
  }
}
