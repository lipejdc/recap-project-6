import { useRouter } from "next/router";
import useSWR, {mutate} from "swr";
import Form from "../../../components/Form";
import { StyledLink } from "../../../components/StyledLink";

export default function EditPage() {
  const router = useRouter();
  //Wait for the router to be ready, then get the id from the url
  const { isReady } = router;
  const { id } = router.query;
  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);

  //Called when the edit form is submitted
  async function editPlace(placeToUpdate) {
    try {
    const response = await fetch(`/api/places/${id}`, {
      method: "PUT",
      //Tell the server we are sending json data
      headers: {
        "Content-Type": "application/json",
      },
      //Converts the place object into json
      body: JSON.stringify(placeToUpdate),
    });

    if (!response.ok) {
      throw new Error("Failed to update place");
    }

    //Refresh data after added
    mutate("/api/places");

    //Imperative Routing. Goes back to place details page after editing.
    router.push(`/places/${id}`);
  } catch (error) {
    console.error("Error updating place:", error);
    alert("Failed to update place, please try again.");
  }
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-place">Edit Place</h2>
      <StyledLink href={`/places/${id}`} $justifySelf="start">
        back
      </StyledLink>
      <Form onSubmit={editPlace} formName={"edit-place"} defaultData={place} />
    </>
  );
}
