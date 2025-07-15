import styled from "styled-components";
import { useRouter } from "next/router";
import Form from "../components/Form";
import { StyledLink } from "../components/StyledLink";
import { mutate } from "swr";

const StyledBackLink = styled(StyledLink)`
  justify-self: flex-start;
`;

export default function CreatePlacePage() {
  const router = useRouter();

  //Gets called when the user submits the form
  async function addPlace(place) {
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        //Tell the server we are sending json data
        headers: {
          "Content-Type": "application/json",
        },
        //Converts the place object into json
        body: JSON.stringify(place),
      });

      if (!response.ok) {
        throw new Error("Failed to add place");
      }

      //Refresh data after added
      mutate("/api/places");

      //Imperative routing. Redirect user to homepage.
      router.push("/");
    } catch (error) {
      console.error("Error adding place:", error);
      alert("Failed to add place, please try again.");
    }
  }

  return (
    <>
      <h2 id="add-place">Add Place</h2>
      <StyledBackLink href="/">back</StyledBackLink>
      <Form onSubmit={addPlace} formName={"add-place"} />
    </>
  );
}
